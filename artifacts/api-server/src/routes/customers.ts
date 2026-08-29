import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import { db, customersTable, monthlyMetricsTable, invoicesTable, customerDocumentsTable } from "@workspace/db";
import { eq, desc, and, like } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { requireAdmin } from "../middlewares/auth.js";
import { encryptToken } from "../lib/tokenCrypto.js";
import { testInstagramConnection, exchangeForLongLivedToken } from "../lib/instagram.js";
import { uploadBufferToGCS, deleteGCSObject } from "../lib/gcsUpload.js";
import { notifyCustomer } from "../lib/notifications.js";
import { listBufferChannels } from "../lib/buffer.js";

const router: IRouter = Router();
const pdfUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });
const documentUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

/**
 * Tries to upgrade a freshly-entered Instagram token to a long-lived (~60d)
 * one so admins don't have to re-paste it every hour. Falls back to storing
 * the token as given if INSTAGRAM_APP_SECRET isn't configured or the
 * exchange fails for any reason — the connection may just be shorter-lived.
 */
async function resolveMetaAccessToken(rawToken: string): Promise<{ token: string; expiresAt: Date | null }> {
  const exchange = await exchangeForLongLivedToken(rawToken);
  if (exchange.success && exchange.accessToken) {
    return { token: exchange.accessToken, expiresAt: exchange.expiresAt ?? null };
  }
  return { token: rawToken, expiresAt: null };
}

function toSafeCustomer(row: typeof customersTable.$inferSelect) {
  const { passwordHash, metaAccessTokenEncrypted, ...safe } = row;
  return safe;
}

router.get("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(customersTable).orderBy(desc(customersTable.createdAt));
    res.json(rows.map(toSafeCustomer));
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

router.post("/instagram-test", requireAdmin, async (req: Request, res: Response) => {
  const { instagramAccountId, metaAccessToken } = req.body;
  if (!instagramAccountId || !metaAccessToken) {
    return res.status(400).json({
      success: false,
      error: "Instagram Professional Account ID und Meta Access Token sind erforderlich",
    });
  }

  const result = await testInstagramConnection(instagramAccountId, metaAccessToken);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
  return;
});

router.post("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const {
      companyName,
      username,
      password,
      passwordConfirm,
      status,
      contactPerson,
      email,
      phone,
      startDate,
      quickbooksId,
      crmId,
      instagramAccountId,
      instagramUsername,
      instagramFollowerCount,
      facebookPageId,
      metaAccessToken,
      nextcloudShareLink,
      bufferChannelName,
    } = req.body;

    if (!companyName || !username || !password) {
      return res.status(400).json({ message: "Firmenname, Benutzername und Passwort sind erforderlich" });
    }
    if (passwordConfirm !== undefined && password !== passwordConfirm) {
      return res.status(400).json({ message: "Passwörter stimmen nicht überein" });
    }

    const [existing] = await db.select().from(customersTable).where(eq(customersTable.username, username));
    if (existing) {
      return res.status(409).json({ message: "Benutzername bereits vergeben" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let metaAccessTokenEncrypted: string | null = null;
    let instagramTokenExpiresAt: Date | null = null;
    if (metaAccessToken) {
      const resolved = await resolveMetaAccessToken(metaAccessToken);
      metaAccessTokenEncrypted = encryptToken(resolved.token);
      instagramTokenExpiresAt = resolved.expiresAt;
    }

    const [created] = await db
      .insert(customersTable)
      .values({
        companyName,
        username,
        passwordHash,
        role: "customer",
        status: status || "active",
        contactPerson: contactPerson || null,
        email: email || null,
        phone: phone || null,
        startDate: startDate ? new Date(startDate) : null,
        quickbooksId: quickbooksId || null,
        crmId: crmId || null,
        instagramAccountId: instagramAccountId || null,
        instagramUsername: instagramUsername || null,
        instagramFollowerCount: instagramFollowerCount ?? null,
        facebookPageId: facebookPageId || null,
        metaAccessTokenEncrypted,
        instagramConnectedAt: metaAccessTokenEncrypted ? new Date() : null,
        instagramTokenExpiresAt,
        nextcloudShareLink: nextcloudShareLink || null,
        bufferChannelName: bufferChannelName || null,
      })
      .returning();

    res.status(201).json(toSafeCustomer(created));
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

router.put("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const {
      companyName,
      username,
      password,
      passwordConfirm,
      status,
      contactPerson,
      email,
      phone,
      startDate,
      quickbooksId,
      crmId,
      instagramAccountId,
      instagramUsername,
      instagramFollowerCount,
      facebookPageId,
      metaAccessToken,
      nextcloudShareLink,
      bufferChannelName,
    } = req.body;

    if (password !== undefined && password !== passwordConfirm) {
      return res.status(400).json({ message: "Passwörter stimmen nicht überein" });
    }

    if (username !== undefined) {
      const [existing] = await db.select().from(customersTable).where(eq(customersTable.username, username));
      if (existing && existing.id !== id) {
        return res.status(409).json({ message: "Benutzername bereits vergeben" });
      }
    }

    const updates: Partial<typeof customersTable.$inferInsert> = { updatedAt: new Date() };
    if (companyName !== undefined) updates.companyName = companyName;
    if (username !== undefined) updates.username = username;
    if (status !== undefined) updates.status = status;
    if (contactPerson !== undefined) updates.contactPerson = contactPerson || null;
    if (email !== undefined) updates.email = email || null;
    if (phone !== undefined) updates.phone = phone || null;
    if (startDate !== undefined) updates.startDate = startDate ? new Date(startDate) : null;
    if (quickbooksId !== undefined) updates.quickbooksId = quickbooksId || null;
    if (crmId !== undefined) updates.crmId = crmId || null;
    if (instagramAccountId !== undefined) updates.instagramAccountId = instagramAccountId || null;
    if (instagramUsername !== undefined) updates.instagramUsername = instagramUsername || null;
    if (instagramFollowerCount !== undefined) updates.instagramFollowerCount = instagramFollowerCount ?? null;
    if (facebookPageId !== undefined) updates.facebookPageId = facebookPageId || null;
    if (password) updates.passwordHash = await bcrypt.hash(password, 10);
    if (metaAccessToken !== undefined) {
      if (metaAccessToken) {
        const resolved = await resolveMetaAccessToken(metaAccessToken);
        updates.metaAccessTokenEncrypted = encryptToken(resolved.token);
        updates.instagramTokenExpiresAt = resolved.expiresAt;
      } else {
        updates.metaAccessTokenEncrypted = null;
        updates.instagramTokenExpiresAt = null;
      }
      updates.instagramConnectedAt = metaAccessToken ? new Date() : null;
    }
    if (nextcloudShareLink !== undefined) updates.nextcloudShareLink = nextcloudShareLink || null;
    if (bufferChannelName !== undefined) updates.bufferChannelName = bufferChannelName || null;

    const [updated] = await db.update(customersTable).set(updates).where(eq(customersTable.id, id)).returning();
    if (!updated) {
      return res.status(404).json({ message: "Nicht gefunden" });
    }

    res.json(toSafeCustomer(updated));
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    await db.delete(customersTable).where(eq(customersTable.id, id));
    res.json({ success: true, message: "Kunde gelöscht" });
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

// ─── Monatsdaten (manual entry, complements the automated Instagram rollup) ──

const YEAR_MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

router.get("/:id/monthly-metrics", requireAdmin, async (req: Request, res: Response) => {
  try {
    const customerId = parseInt(req.params.id as string);
    const rows = await db
      .select()
      .from(monthlyMetricsTable)
      .where(eq(monthlyMetricsTable.customerId, customerId))
      .orderBy(desc(monthlyMetricsTable.yearMonth));
    res.json(rows);
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

router.post("/:id/monthly-metrics", requireAdmin, async (req: Request, res: Response) => {
  try {
    const customerId = parseInt(req.params.id as string);
    const { yearMonth, followers, reach, totalInteractions, profileViews, accountsEngaged, note } = req.body;

    if (!yearMonth || !YEAR_MONTH_RE.test(yearMonth)) {
      return res.status(400).json({ message: "Gültiger Monat im Format JJJJ-MM erforderlich" });
    }

    const [existing] = await db
      .select()
      .from(monthlyMetricsTable)
      .where(and(eq(monthlyMetricsTable.customerId, customerId), eq(monthlyMetricsTable.yearMonth, yearMonth)));
    if (existing) {
      return res.status(409).json({ message: "Für diesen Monat existieren bereits Daten. Bitte bearbeiten Sie den vorhandenen Eintrag." });
    }

    const [created] = await db
      .insert(monthlyMetricsTable)
      .values({
        customerId,
        yearMonth,
        source: "manual",
        followers: followers ?? null,
        reach: reach ?? null,
        totalInteractions: totalInteractions ?? null,
        profileViews: profileViews ?? null,
        accountsEngaged: accountsEngaged ?? null,
        note: note || null,
      })
      .returning();

    const monthLabel = new Date(`${yearMonth}-01T00:00:00`).toLocaleDateString("de-DE", { month: "long", year: "numeric" });
    notifyCustomer({
      customerId,
      type: "monthly_report",
      title: `Neuer Analysebericht: ${monthLabel}`,
      message: `Ihr Analysebericht für ${monthLabel} ist jetzt im Kundenportal verfügbar.`,
      link: "/dashboard/instagram",
    }).catch((err) => console.error("notifyCustomer (monthly_report) failed", err));

    res.status(201).json(created);
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

router.put("/:id/monthly-metrics/:yearMonth", requireAdmin, async (req: Request, res: Response) => {
  try {
    const customerId = parseInt(req.params.id as string);
    const yearMonth = req.params.yearMonth as string;
    const { followers, reach, totalInteractions, profileViews, accountsEngaged, note } = req.body;

    const [existing] = await db
      .select()
      .from(monthlyMetricsTable)
      .where(and(eq(monthlyMetricsTable.customerId, customerId), eq(monthlyMetricsTable.yearMonth, yearMonth)));
    if (!existing) {
      return res.status(404).json({ message: "Nicht gefunden" });
    }

    const updates: Partial<typeof monthlyMetricsTable.$inferInsert> = { updatedAt: new Date() };
    if (note !== undefined) updates.note = note || null;

    const numericFieldsProvided = [followers, reach, totalInteractions, profileViews, accountsEngaged].some((v) => v !== undefined);
    if (numericFieldsProvided) {
      if (existing.source !== "manual") {
        return res.status(400).json({ message: "Automatisch erfasste Zahlen können nicht überschrieben werden — nur die Notiz ist bearbeitbar." });
      }
      if (followers !== undefined) updates.followers = followers ?? null;
      if (reach !== undefined) updates.reach = reach ?? null;
      if (totalInteractions !== undefined) updates.totalInteractions = totalInteractions ?? null;
      if (profileViews !== undefined) updates.profileViews = profileViews ?? null;
      if (accountsEngaged !== undefined) updates.accountsEngaged = accountsEngaged ?? null;
    }

    const [updated] = await db
      .update(monthlyMetricsTable)
      .set(updates)
      .where(and(eq(monthlyMetricsTable.customerId, customerId), eq(monthlyMetricsTable.yearMonth, yearMonth)))
      .returning();
    res.json(updated);
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

router.delete("/:id/monthly-metrics/:yearMonth", requireAdmin, async (req: Request, res: Response) => {
  try {
    const customerId = parseInt(req.params.id as string);
    const yearMonth = req.params.yearMonth as string;

    const [existing] = await db
      .select()
      .from(monthlyMetricsTable)
      .where(and(eq(monthlyMetricsTable.customerId, customerId), eq(monthlyMetricsTable.yearMonth, yearMonth)));
    if (!existing) {
      return res.status(404).json({ message: "Nicht gefunden" });
    }
    if (existing.source !== "manual") {
      return res.status(400).json({ message: "Automatisch erfasste Monate können nicht gelöscht werden." });
    }

    await db
      .delete(monthlyMetricsTable)
      .where(and(eq(monthlyMetricsTable.customerId, customerId), eq(monthlyMetricsTable.yearMonth, yearMonth)));
    res.json({ success: true, message: "Monat gelöscht" });
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

// Content Calendar itself is scheduled directly in Buffer's own dashboard
// (not through this admin panel) — the customer portal just displays it
// live (see GET /portal/content-calendar). Admin only needs to pick which
// Buffer channel belongs to which customer, via this picker:
router.get("/buffer-channels", requireAdmin, async (req: Request, res: Response) => {
  try {
    const channels = await listBufferChannels();
    res.json(channels);
    return;
  } catch (err) {
    res.status(502).json({ message: err instanceof Error ? err.message : "Buffer-Verbindung fehlgeschlagen." });
    return;
  }
});

// ─── Invoices (admin-managed, PDF stored in the shared object storage) ──

router.get("/:id/invoices", requireAdmin, async (req: Request, res: Response) => {
  try {
    const customerId = parseInt(req.params.id as string);
    const rows = await db
      .select()
      .from(invoicesTable)
      .where(eq(invoicesTable.customerId, customerId))
      .orderBy(desc(invoicesTable.invoiceDate));
    res.json(rows);
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

router.post("/:id/invoices", requireAdmin, async (req: Request, res: Response) => {
  try {
    const customerId = parseInt(req.params.id as string);
    const { invoiceNumber, invoiceDate, dueDate, amount, currency, status } = req.body;

    if (!invoiceNumber || !String(invoiceNumber).trim()) {
      return res.status(400).json({ message: "Rechnungsnummer ist erforderlich" });
    }
    if (!invoiceDate) {
      return res.status(400).json({ message: "Rechnungsdatum ist erforderlich" });
    }
    if (amount === undefined || amount === null || amount === "") {
      return res.status(400).json({ message: "Betrag ist erforderlich" });
    }

    const [created] = await db
      .insert(invoicesTable)
      .values({
        customerId,
        invoiceNumber: String(invoiceNumber).trim(),
        invoiceDate: new Date(invoiceDate),
        dueDate: dueDate ? new Date(dueDate) : null,
        amount: String(amount),
        currency: currency || "EUR",
        status: status || "open",
      })
      .returning();

    const amountLabel = `${Number(amount).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency === "EUR" || !currency ? "€" : currency}`;
    notifyCustomer({
      customerId,
      type: "invoice",
      title: `Neue Rechnung: ${String(invoiceNumber).trim()}`,
      message: `Eine neue Rechnung über ${amountLabel} wurde zu Ihrem Konto hinzugefügt.`,
      link: "/dashboard/rechnungen",
    }).catch((err) => console.error("notifyCustomer (invoice) failed", err));

    res.status(201).json(created);
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

/**
 * Generates the next sequential invoice number for a year: "{year}-001",
 * "{year}-002", ... — scoped globally across all customers (standard
 * sequential invoicing), not per-customer.
 */
async function generateInvoiceNumber(year: string): Promise<string> {
  const prefix = `${year}-`;
  const existing = await db
    .select({ invoiceNumber: invoicesTable.invoiceNumber })
    .from(invoicesTable)
    .where(like(invoicesTable.invoiceNumber, `${prefix}%`));

  let maxSeq = 0;
  for (const row of existing) {
    const suffix = row.invoiceNumber.slice(prefix.length);
    const n = parseInt(suffix, 10);
    if (!Number.isNaN(n) && n > maxSeq) maxSeq = n;
  }
  return `${prefix}${String(maxSeq + 1).padStart(3, "0")}`;
}

// Quick-upload flow: admin picks a customer + year + dates and drops a PDF —
// no invoice number or amount to type. Number is auto-generated; amount
// stays null until someone fills it in later via the edit row.
router.post("/:id/invoices/upload", requireAdmin, pdfUpload.single("file"), async (req: Request, res: Response) => {
  try {
    const customerId = parseInt(req.params.id as string);
    const { year, invoiceDate, dueDate } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Keine Datei erhalten." });
    }
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Nur PDF-Dateien sind erlaubt." });
    }
    if (!year || !/^\d{4}$/.test(String(year))) {
      return res.status(400).json({ message: "Gültiges Jahr erforderlich." });
    }
    if (!invoiceDate) {
      return res.status(400).json({ message: "Rechnungsdatum ist erforderlich." });
    }

    const invoiceNumber = await generateInvoiceNumber(String(year));
    const pdfFileReference = await uploadBufferToGCS(req.file.buffer, req.file.originalname, req.file.mimetype, "invoices");

    const [created] = await db
      .insert(invoicesTable)
      .values({
        customerId,
        invoiceNumber,
        invoiceDate: new Date(invoiceDate),
        dueDate: dueDate ? new Date(dueDate) : null,
        amount: null,
        currency: "EUR",
        status: "open",
        pdfFileReference,
      })
      .returning();

    notifyCustomer({
      customerId,
      type: "invoice",
      title: `Neue Rechnung: ${invoiceNumber}`,
      message: `Eine neue Rechnung wurde zu Ihrem Konto hinzugefügt.`,
      link: "/dashboard/rechnungen",
    }).catch((err) => console.error("notifyCustomer (invoice) failed", err));

    res.status(201).json(created);
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

router.put("/:id/invoices/:invoiceId", requireAdmin, async (req: Request, res: Response) => {
  try {
    const customerId = parseInt(req.params.id as string);
    const invoiceId = parseInt(req.params.invoiceId as string);
    const { invoiceNumber, invoiceDate, dueDate, amount, currency, status } = req.body;

    const updates: Partial<typeof invoicesTable.$inferInsert> = { updatedAt: new Date() };
    if (invoiceNumber !== undefined) updates.invoiceNumber = String(invoiceNumber).trim();
    if (invoiceDate !== undefined) updates.invoiceDate = new Date(invoiceDate);
    if (dueDate !== undefined) updates.dueDate = dueDate ? new Date(dueDate) : null;
    if (amount !== undefined) updates.amount = amount === "" || amount === null ? null : String(amount);
    if (currency !== undefined) updates.currency = currency;
    if (status !== undefined) updates.status = status;

    const [updated] = await db
      .update(invoicesTable)
      .set(updates)
      .where(and(eq(invoicesTable.id, invoiceId), eq(invoicesTable.customerId, customerId)))
      .returning();
    if (!updated) {
      return res.status(404).json({ message: "Nicht gefunden" });
    }
    res.json(updated);
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

router.delete("/:id/invoices/:invoiceId", requireAdmin, async (req: Request, res: Response) => {
  try {
    const customerId = parseInt(req.params.id as string);
    const invoiceId = parseInt(req.params.invoiceId as string);

    const [existing] = await db
      .select()
      .from(invoicesTable)
      .where(and(eq(invoicesTable.id, invoiceId), eq(invoicesTable.customerId, customerId)));
    if (existing?.pdfFileReference) {
      await deleteGCSObject(existing.pdfFileReference);
    }

    await db.delete(invoicesTable).where(and(eq(invoicesTable.id, invoiceId), eq(invoicesTable.customerId, customerId)));
    res.json({ success: true, message: "Rechnung gelöscht" });
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

router.post("/:id/invoices/:invoiceId/pdf", requireAdmin, pdfUpload.single("file"), async (req: Request, res: Response) => {
  try {
    const customerId = parseInt(req.params.id as string);
    const invoiceId = parseInt(req.params.invoiceId as string);

    if (!req.file) {
      return res.status(400).json({ message: "Keine Datei erhalten." });
    }
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Nur PDF-Dateien sind erlaubt." });
    }

    const [existing] = await db
      .select()
      .from(invoicesTable)
      .where(and(eq(invoicesTable.id, invoiceId), eq(invoicesTable.customerId, customerId)));
    if (!existing) {
      return res.status(404).json({ message: "Nicht gefunden" });
    }
    if (existing.pdfFileReference) {
      await deleteGCSObject(existing.pdfFileReference);
    }

    const pdfFileReference = await uploadBufferToGCS(req.file.buffer, req.file.originalname, req.file.mimetype, "invoices");

    const [updated] = await db
      .update(invoicesTable)
      .set({ pdfFileReference, updatedAt: new Date() })
      .where(and(eq(invoicesTable.id, invoiceId), eq(invoicesTable.customerId, customerId)))
      .returning();
    res.json(updated);
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

// ─── Customer Documents (onboarding docs, briefings, brand assets — admin-managed) ──

router.get("/:id/documents", requireAdmin, async (req: Request, res: Response) => {
  try {
    const customerId = parseInt(req.params.id as string);
    const rows = await db
      .select()
      .from(customerDocumentsTable)
      .where(eq(customerDocumentsTable.customerId, customerId))
      .orderBy(desc(customerDocumentsTable.createdAt));
    res.json(rows);
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

router.post("/:id/documents", requireAdmin, documentUpload.single("file"), async (req: Request, res: Response) => {
  try {
    const customerId = parseInt(req.params.id as string);
    const { title, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Keine Datei erhalten." });
    }
    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: "Titel ist erforderlich" });
    }

    const fileReference = await uploadBufferToGCS(req.file.buffer, req.file.originalname, req.file.mimetype, "documents");

    const [created] = await db
      .insert(customerDocumentsTable)
      .values({
        customerId,
        title: String(title).trim(),
        category: category || "other",
        fileReference,
        fileName: req.file.originalname,
      })
      .returning();
    res.status(201).json(created);
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

router.delete("/:id/documents/:documentId", requireAdmin, async (req: Request, res: Response) => {
  try {
    const customerId = parseInt(req.params.id as string);
    const documentId = parseInt(req.params.documentId as string);

    const [existing] = await db
      .select()
      .from(customerDocumentsTable)
      .where(and(eq(customerDocumentsTable.id, documentId), eq(customerDocumentsTable.customerId, customerId)));
    if (existing) {
      await deleteGCSObject(existing.fileReference);
    }

    await db.delete(customerDocumentsTable).where(and(eq(customerDocumentsTable.id, documentId), eq(customerDocumentsTable.customerId, customerId)));
    res.json({ success: true, message: "Dokument gelöscht" });
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

// Archive/file browsing for admin is no longer WebDAV-backed — admin sees
// and edits nextcloudShareLink through the regular customer record (GET /,
// POST /, PUT /:id above) and opens the same public share link directly.

export default router;
