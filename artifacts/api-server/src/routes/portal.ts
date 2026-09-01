import { Router, type IRouter, type Request, type Response } from "express";
import { db, customersTable, invoicesTable, instagramDailySnapshotsTable, monthlyMetricsTable, customerDocumentsTable, notificationsTable, supportTicketsTable, supportTicketMessagesTable, roadmapItemsTable } from "@workspace/db";
import { eq, desc, asc, and, gte, like } from "drizzle-orm";
import { requireCustomer } from "../middlewares/auth.js";
import { decryptToken, encryptToken } from "../lib/tokenCrypto.js";
import { getInstagramProfile, refreshLongLivedToken, getHistoricalMonthlyBackfill, getCurrentMonthReachSeries } from "../lib/instagram.js";
import { resolveBufferChannelId, listBufferPosts } from "../lib/buffer.js";
import { sendSupportTicketEmail, sendSupportTicketReplyEmail } from "../lib/mailer.js";
import { getNotionPageBlocks, getNotionPageTitle } from "../lib/notion.js";

const SUPPORT_TICKET_CATEGORIES = ["invoice", "social_media", "website", "ki_automatisierungen", "other"] as const;

const router: IRouter = Router();

async function getSessionCustomer(req: Request) {
  const customerId = (req.session as any).customerId;
  if (!customerId) return null;
  const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, customerId));
  return customer || null;
}

// ─── Instagram ──────────────────────────────────────────────

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Meta only offers a real daily time_series for "reach" and "follower_count" —
 * verified against the live API; the other Insights metrics only ever return
 * a same-day total. To give those metrics history and deltas too, we store
 * one row per customer per day ourselves, opportunistically, on every load —
 * the same no-cron-needed pattern already used for token refresh. History
 * starts accumulating from the day this shipped; there is no way to backfill
 * days before that without fabricating numbers, so it isn't attempted.
 */
async function recordDailySnapshot(customerId: number, insights: { totalInteractions?: number; profileViews?: number; accountsEngaged?: number; websiteClicks?: number }) {
  await db
    .insert(instagramDailySnapshotsTable)
    .values({
      customerId,
      date: todayIsoDate(),
      totalInteractions: insights.totalInteractions ?? null,
      profileViews: insights.profileViews ?? null,
      accountsEngaged: insights.accountsEngaged ?? null,
      websiteClicks: insights.websiteClicks ?? null,
    })
    .onConflictDoUpdate({
      target: [instagramDailySnapshotsTable.customerId, instagramDailySnapshotsTable.date],
      set: {
        totalInteractions: insights.totalInteractions ?? null,
        profileViews: insights.profileViews ?? null,
        accountsEngaged: insights.accountsEngaged ?? null,
        websiteClicks: insights.websiteClicks ?? null,
      },
    });
}

async function getSnapshotSeries(customerId: number) {
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const sinceIso = since.toISOString().slice(0, 10);

  const rows = await db
    .select()
    .from(instagramDailySnapshotsTable)
    .where(and(eq(instagramDailySnapshotsTable.customerId, customerId), gte(instagramDailySnapshotsTable.date, sinceIso)))
    .orderBy(instagramDailySnapshotsTable.date);

  return {
    totalInteractionsSeries: rows.filter((r) => r.totalInteractions !== null).map((r) => ({ date: r.date, value: r.totalInteractions! })),
    profileViewsSeries: rows.filter((r) => r.profileViews !== null).map((r) => ({ date: r.date, value: r.profileViews! })),
    accountsEngagedSeries: rows.filter((r) => r.accountsEngaged !== null).map((r) => ({ date: r.date, value: r.accountsEngaged! })),
  };
}

function currentYearMonth(): string {
  return todayIsoDate().slice(0, 7);
}

/**
 * Rolls the current calendar month's numbers into monthly_metrics — reach
 * summed from Meta's own 30-day series (restricted to this month), the other
 * three summed from our own daily snapshots (also restricted to this month).
 * Runs opportunistically on every load, same as the daily snapshot. A month
 * only has real numbers once it's actually been tracked this way; earlier
 * months are left absent rather than backfilled with guesses.
 */
async function rollUpCurrentMonth(customerId: number, followers: number | undefined, reachSeries: { date: string; value: number }[] | undefined) {
  const yearMonth = currentYearMonth();

  const reachThisMonth = (reachSeries ?? [])
    .filter((p) => p.date.startsWith(yearMonth))
    .reduce((sum, p) => sum + p.value, 0);

  const snapshotRows = await db
    .select()
    .from(instagramDailySnapshotsTable)
    .where(and(eq(instagramDailySnapshotsTable.customerId, customerId), like(instagramDailySnapshotsTable.date, `${yearMonth}%`)));

  const sumField = (field: "totalInteractions" | "profileViews" | "accountsEngaged") =>
    snapshotRows.reduce((sum, r) => sum + (r[field] ?? 0), 0);

  await db
    .insert(monthlyMetricsTable)
    .values({
      customerId,
      yearMonth,
      source: "api",
      followers: followers ?? null,
      reach: reachThisMonth,
      totalInteractions: sumField("totalInteractions"),
      profileViews: sumField("profileViews"),
      accountsEngaged: sumField("accountsEngaged"),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [monthlyMetricsTable.customerId, monthlyMetricsTable.yearMonth],
      set: {
        followers: followers ?? null,
        reach: reachThisMonth,
        totalInteractions: sumField("totalInteractions"),
        profileViews: sumField("profileViews"),
        accountsEngaged: sumField("accountsEngaged"),
        updatedAt: new Date(),
      },
    });
}

/**
 * Backfills real historical months (followers + reach only — the other three
 * metrics have no historical API at all, confirmed empirically) for any of
 * the last 12 calendar months that don't already have a monthly_metrics row.
 * Never overwrites an existing row — manual entries (e.g. the customer's own
 * "Deneme" test rows) and previously-rolled-up months are left untouched.
 * The existence check is cheap and runs every load; the real ~year-long API
 * fetch only fires when a genuine gap is found, so this is a no-op on every
 * subsequent load once history is fully populated.
 */
async function backfillHistoricalMonths(customerId: number, accountId: string, accessToken: string, currentFollowers: number | undefined) {
  const existing = await db
    .select({ yearMonth: monthlyMetricsTable.yearMonth })
    .from(monthlyMetricsTable)
    .where(eq(monthlyMetricsTable.customerId, customerId));
  const existingSet = new Set(existing.map((r) => r.yearMonth));

  const thisMonth = currentYearMonth();
  const missing: string[] = [];
  const cursor = new Date();
  for (let i = 0; i < 12; i++) {
    cursor.setUTCMonth(cursor.getUTCMonth() - 1);
    const ym = cursor.toISOString().slice(0, 7);
    if (ym === thisMonth) continue;
    if (!existingSet.has(ym)) missing.push(ym);
  }
  if (missing.length === 0) return;

  const months = await getHistoricalMonthlyBackfill(accountId, accessToken, currentFollowers, 365);
  for (const m of months) {
    if (!missing.includes(m.yearMonth)) continue;
    if (m.followers == null && m.reach == null) continue; // nothing real to record for this month

    await db
      .insert(monthlyMetricsTable)
      .values({
        customerId,
        yearMonth: m.yearMonth,
        source: "api",
        followers: m.followers,
        reach: m.reach,
        totalInteractions: null,
        profileViews: null,
        accountsEngaged: null,
        updatedAt: new Date(),
      })
      .onConflictDoNothing({ target: [monthlyMetricsTable.customerId, monthlyMetricsTable.yearMonth] });
  }
}

/**
 * Full recorded history, oldest first — not capped to a recent window.
 * The doc explicitly asks for multi-year comparisons ("Mayıs → Haziran →
 * ... gelişimini yıllar sonra bile görebilir"), and a customer's monthly
 * row count is naturally small (at most 12/year), so there's no real cost
 * to returning everything and letting the frontend slice by year/metric.
 */
async function getMonthlyHistory(customerId: number) {
  return db
    .select()
    .from(monthlyMetricsTable)
    .where(eq(monthlyMetricsTable.customerId, customerId))
    .orderBy(monthlyMetricsTable.yearMonth);
}

router.get("/instagram", requireCustomer, async (req: Request, res: Response) => {
  try {
    const customer = await getSessionCustomer(req);
    if (!customer) return res.status(401).json({ message: "Nicht angemeldet" });

    if (!customer.instagramAccountId || !customer.metaAccessTokenEncrypted) {
      res.json({ connected: false });
      return;
    }

    let token = decryptToken(customer.metaAccessTokenEncrypted);

    // Opportunistically refresh the long-lived token if it's expiring soon —
    // keeps the connection alive indefinitely with no separate cron job.
    const REFRESH_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
    if (customer.instagramTokenExpiresAt && customer.instagramTokenExpiresAt.getTime() - Date.now() < REFRESH_WINDOW_MS) {
      const refreshed = await refreshLongLivedToken(token);
      if (refreshed.success && refreshed.accessToken) {
        token = refreshed.accessToken;
        await db
          .update(customersTable)
          .set({
            metaAccessTokenEncrypted: encryptToken(refreshed.accessToken),
            instagramTokenExpiresAt: refreshed.expiresAt ?? null,
          })
          .where(eq(customersTable.id, customer.id));
      }
    }

    // Optional customer-facing date-range filter for the Entwicklung/Muster
    // charts — either a relative "letzte N Tage" window or an absolute
    // since/until range. Absent entirely, the profile defaults to the real
    // current calendar month (unchanged prior behavior).
    const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
    const daysParam = typeof req.query.days === "string" ? parseInt(req.query.days, 10) : NaN;
    const sinceParam = typeof req.query.since === "string" && DATE_RE.test(req.query.since) ? req.query.since : undefined;
    const untilParam = typeof req.query.until === "string" && DATE_RE.test(req.query.until) ? req.query.until : undefined;
    const rangeOptions =
      sinceParam !== undefined
        ? { since: sinceParam, until: untilParam }
        : Number.isFinite(daysParam) && daysParam > 0 && daysParam <= 366
          ? { daysBack: daysParam }
          : undefined;
    const usingCustomRange = !!rangeOptions;

    const profile = await getInstagramProfile(customer.instagramAccountId, token, rangeOptions);

    let monthlyHistory: Awaited<ReturnType<typeof getMonthlyHistory>> = [];
    if (profile.connected && profile.insights) {
      await recordDailySnapshot(customer.id, profile.insights);
      const snapshotSeries = await getSnapshotSeries(customer.id);
      Object.assign(profile.insights, snapshotSeries);

      // rollUpCurrentMonth must always sum the real current month, never a
      // display-only custom range — reuse the already-fetched series when
      // it genuinely is the current month (the common case, no extra Meta
      // API call), otherwise fetch a dedicated current-month series.
      const reachForRollup = usingCustomRange
        ? await getCurrentMonthReachSeries(customer.instagramAccountId, token)
        : profile.insights.reachSeries;
      await rollUpCurrentMonth(customer.id, profile.followers, reachForRollup);
      await backfillHistoricalMonths(customer.id, customer.instagramAccountId, token, profile.followers);
      monthlyHistory = await getMonthlyHistory(customer.id);
    }

    res.json({ ...profile, monthlyHistory });
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

// ─── Files (a single admin-provided Nextcloud public share link — no
// per-customer WebDAV credentials; the frontend just embeds the link) ──

router.get("/files", requireCustomer, async (req: Request, res: Response) => {
  try {
    const customer = await getSessionCustomer(req);
    if (!customer) return res.status(401).json({ message: "Nicht angemeldet" });

    res.json({
      enabled: !!customer.nextcloudShareLink,
      shareLink: customer.nextcloudShareLink ?? null,
    });
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

// Separate Nextcloud share link for the KI & Automatisierungen "Datenbank"
// area — independent from the Social Media one above so a customer booked
// for both services gets two distinct file areas.
router.get("/files-ki", requireCustomer, async (req: Request, res: Response) => {
  try {
    const customer = await getSessionCustomer(req);
    if (!customer) return res.status(401).json({ message: "Nicht angemeldet" });

    res.json({
      enabled: !!customer.nextcloudShareLinkKi,
      shareLink: customer.nextcloudShareLinkKi ?? null,
    });
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

// ─── Invoices ───────────────────────────────────────────────

router.get("/invoices", requireCustomer, async (req: Request, res: Response) => {
  try {
    const customer = await getSessionCustomer(req);
    if (!customer) return res.status(401).json({ message: "Nicht angemeldet" });

    const invoices = await db
      .select()
      .from(invoicesTable)
      .where(eq(invoicesTable.customerId, customer.id))
      .orderBy(desc(invoicesTable.invoiceDate));

    res.json(invoices);
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

// ─── Content Calendar (read-only — admin manages entries) ──

// Buffer's `dueAt` is a UTC ISO timestamp (e.g. "2026-09-07T22:30:00.000Z").
// Naively slicing the first 10 chars gives the UTC calendar date, which is
// WRONG for any post scheduled late evening/early morning German time — e.g.
// 00:30 CEST on Sep 8 is 22:30 UTC on Sep 7, so a raw slice would misfile it
// under Sep 7 instead of Sep 8, making it look like nothing is scheduled on
// the real day (and bunching posts onto the wrong day in the calendar grid).
// Format in Europe/Berlin so the calendar always reflects the customer's own
// local date, correctly handling the CET/CEST DST switch too.
const berlinDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Berlin",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
function toBerlinDateKey(isoUtc: string | null): string {
  if (!isoUtc) return "";
  const d = new Date(isoUtc);
  if (Number.isNaN(d.getTime())) return "";
  return berlinDateFormatter.format(d); // en-CA formats as YYYY-MM-DD
}

// The customer's Content Calendar shows real, live Buffer data — whatever
// the team has actually scheduled/published for their channel, whether it
// went through this portal's admin tool or was entered directly in Buffer's
// own dashboard. It intentionally does NOT read from
// content_calendar_entries (that table is the admin's own internal
// draft/planning tool, private until pushed to Buffer).
router.get("/content-calendar", requireCustomer, async (req: Request, res: Response) => {
  try {
    const customer = await getSessionCustomer(req);
    if (!customer) return res.status(401).json({ message: "Nicht angemeldet" });

    if (!customer.bufferChannelName) {
      res.json({ enabled: false, entries: [] });
      return;
    }

    const channelId = await resolveBufferChannelId(customer.bufferChannelName);
    if (!channelId) {
      res.json({ enabled: false, entries: [] });
      return;
    }

    const posts = await listBufferPosts(channelId);
    const entries = posts.map((p) => ({
      id: p.id,
      date: toBerlinDateKey(p.dueAt),
      text: p.text,
      status: p.status,
      thumbnailUrl: p.assets[0]?.thumbnail ?? null,
      // Full-quality original — bigger image or the actual playable video —
      // used by the customer-facing calendar's click-to-enlarge/autoplay popup.
      mediaUrl: p.assets[0]?.source ?? null,
      mediaType: p.assets[0]?.type ?? null,
    }));

    res.json({ enabled: true, entries });
    return;
  } catch (err) {
    res.status(502).json({ message: err instanceof Error ? err.message : "Buffer-Verbindung fehlgeschlagen." });
    return;
  }
});

// ─── Content Planung (Notion — read-only, Social Media customers only) ──

// The customer's own Notion page, fetched live server-side with the shared
// integration token and rendered in our own UI (never publicly embedded, so
// the content stays private even though Notion itself has no per-customer
// scoping).
router.get("/content-planning", requireCustomer, async (req: Request, res: Response) => {
  try {
    const customer = await getSessionCustomer(req);
    if (!customer) return res.status(401).json({ message: "Nicht angemeldet" });

    if (!customer.notionPageId) {
      res.json({ enabled: false, title: null, blocks: [] });
      return;
    }

    const [title, blocks] = await Promise.all([
      getNotionPageTitle(customer.notionPageId),
      getNotionPageBlocks(customer.notionPageId),
    ]);

    res.json({ enabled: true, title, blocks });
    return;
  } catch (err) {
    res.status(502).json({ message: err instanceof Error ? err.message : "Notion-Verbindung fehlgeschlagen." });
    return;
  }
});

// ─── Documents (read-only — admin manages uploads) ──

router.get("/documents", requireCustomer, async (req: Request, res: Response) => {
  try {
    const customer = await getSessionCustomer(req);
    if (!customer) return res.status(401).json({ message: "Nicht angemeldet" });

    const documents = await db
      .select()
      .from(customerDocumentsTable)
      .where(eq(customerDocumentsTable.customerId, customer.id))
      .orderBy(desc(customerDocumentsTable.createdAt));

    res.json(documents);
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

// ─── Notifications ──────────────────────────────────────────

router.get("/notifications", requireCustomer, async (req: Request, res: Response) => {
  try {
    const customer = await getSessionCustomer(req);
    if (!customer) return res.status(401).json({ message: "Nicht angemeldet" });

    const notifications = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.customerId, customer.id))
      .orderBy(desc(notificationsTable.createdAt))
      .limit(50);

    res.json(notifications);
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

router.put("/notifications/:id/read", requireCustomer, async (req: Request, res: Response) => {
  try {
    const customer = await getSessionCustomer(req);
    if (!customer) return res.status(401).json({ message: "Nicht angemeldet" });

    const id = parseInt(req.params.id as string);
    await db
      .update(notificationsTable)
      .set({ read: true })
      .where(and(eq(notificationsTable.id, id), eq(notificationsTable.customerId, customer.id)));

    res.json({ success: true });
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

router.put("/notifications/read-all", requireCustomer, async (req: Request, res: Response) => {
  try {
    const customer = await getSessionCustomer(req);
    if (!customer) return res.status(401).json({ message: "Nicht angemeldet" });

    await db
      .update(notificationsTable)
      .set({ read: true })
      .where(eq(notificationsTable.customerId, customer.id));

    res.json({ success: true });
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

// ─── Support Tickets ────────────────────────────────────────

router.get("/support-tickets", requireCustomer, async (req: Request, res: Response) => {
  try {
    const customer = await getSessionCustomer(req);
    if (!customer) return res.status(401).json({ message: "Nicht angemeldet" });

    const tickets = await db
      .select()
      .from(supportTicketsTable)
      .where(eq(supportTicketsTable.customerId, customer.id))
      .orderBy(desc(supportTicketsTable.createdAt));

    res.json(tickets);
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

router.post("/support-tickets", requireCustomer, async (req: Request, res: Response) => {
  try {
    const customer = await getSessionCustomer(req);
    if (!customer) return res.status(401).json({ message: "Nicht angemeldet" });

    const { category, subject, message } = req.body ?? {};
    if (typeof subject !== "string" || !subject.trim() || typeof message !== "string" || !message.trim()) {
      res.status(400).json({ message: "Betreff und Nachricht sind erforderlich." });
      return;
    }
    if (typeof category !== "string" || !SUPPORT_TICKET_CATEGORIES.includes(category as any)) {
      res.status(400).json({ message: "Ungültige Kategorie." });
      return;
    }

    const [created] = await db
      .insert(supportTicketsTable)
      .values({ customerId: customer.id, category, subject: subject.trim(), message: message.trim() })
      .returning();

    // Best-effort admin alert — a failed email never blocks ticket creation,
    // the ticket itself (visible in the admin panel) is the reliable record.
    try {
      await sendSupportTicketEmail({
        companyName: customer.companyName,
        username: customer.username,
        category,
        subject: subject.trim(),
        message: message.trim(),
      });
    } catch (err) {
      console.error("sendSupportTicketEmail failed", err);
    }

    res.status(201).json(created);
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

// One ticket's reply thread — customer can only read their own ticket's thread.
router.get("/support-tickets/:id/messages", requireCustomer, async (req: Request, res: Response) => {
  try {
    const customer = await getSessionCustomer(req);
    if (!customer) return res.status(401).json({ message: "Nicht angemeldet" });

    const id = parseInt(req.params.id as string);
    const [ticket] = await db.select().from(supportTicketsTable).where(eq(supportTicketsTable.id, id));
    if (!ticket || ticket.customerId !== customer.id) {
      res.status(404).json({ message: "Ticket nicht gefunden." });
      return;
    }

    const messages = await db
      .select()
      .from(supportTicketMessagesTable)
      .where(eq(supportTicketMessagesTable.ticketId, id))
      .orderBy(asc(supportTicketMessagesTable.createdAt));

    res.json(messages);
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

// Customer reply — reopens a resolved/closed ticket and alerts the admin by email.
router.post("/support-tickets/:id/messages", requireCustomer, async (req: Request, res: Response) => {
  try {
    const customer = await getSessionCustomer(req);
    if (!customer) return res.status(401).json({ message: "Nicht angemeldet" });

    const id = parseInt(req.params.id as string);
    const { message } = req.body ?? {};
    if (typeof message !== "string" || !message.trim()) {
      res.status(400).json({ message: "Nachricht darf nicht leer sein." });
      return;
    }

    const [ticket] = await db.select().from(supportTicketsTable).where(eq(supportTicketsTable.id, id));
    if (!ticket || ticket.customerId !== customer.id) {
      res.status(404).json({ message: "Ticket nicht gefunden." });
      return;
    }

    const [created] = await db
      .insert(supportTicketMessagesTable)
      .values({ ticketId: id, senderType: "customer", message: message.trim() })
      .returning();

    const reopen = ticket.status === "resolved" || ticket.status === "closed";
    await db
      .update(supportTicketsTable)
      .set({ updatedAt: new Date(), ...(reopen ? { status: "open" } : {}) })
      .where(eq(supportTicketsTable.id, id));

    try {
      await sendSupportTicketReplyEmail({
        companyName: customer.companyName,
        username: customer.username,
        subject: ticket.subject,
        message: message.trim(),
      });
    } catch (err) {
      console.error("sendSupportTicketReplyEmail failed", err);
    }

    res.status(201).json(created);
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

// ─── Roadmap ("Update" Kanban board) — read-only for the customer ────

router.get("/roadmap", requireCustomer, async (req: Request, res: Response) => {
  try {
    const customer = await getSessionCustomer(req);
    if (!customer) return res.status(401).json({ message: "Nicht angemeldet" });

    const rows = await db
      .select()
      .from(roadmapItemsTable)
      .where(eq(roadmapItemsTable.customerId, customer.id))
      .orderBy(asc(roadmapItemsTable.sortOrder), asc(roadmapItemsTable.createdAt));

    res.json(rows);
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

export default router;
