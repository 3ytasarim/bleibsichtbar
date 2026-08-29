import { Router, type IRouter, type Request, type Response } from "express";
import { db, supportTicketsTable, supportTicketMessagesTable, customersTable } from "@workspace/db";
import { eq, desc, asc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth.js";
import { notifyCustomer } from "../lib/notifications.js";

const router: IRouter = Router();

const STATUSES = ["open", "in_progress", "in_review", "resolved", "closed"] as const;
type Status = (typeof STATUSES)[number];

const STATUS_LABELS: Record<Status, string> = {
  open: "Offen",
  in_progress: "In Bearbeitung",
  in_review: "Wird geprüft",
  resolved: "Gelöst",
  closed: "Geschlossen",
};

// All support tickets across every customer, newest first — the admin's
// inbox for what customers opened via "Ticket erstellen" on their dashboard.
// Each ticket carries `unread`: true when the customer has the last word
// (a brand-new ticket nobody has actioned yet, or a reply since the admin's
// last message/status change) — drives the sidebar's unread-count badge.
router.get("/", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const rows = await db
      .select({
        id: supportTicketsTable.id,
        customerId: supportTicketsTable.customerId,
        category: supportTicketsTable.category,
        subject: supportTicketsTable.subject,
        message: supportTicketsTable.message,
        status: supportTicketsTable.status,
        createdAt: supportTicketsTable.createdAt,
        updatedAt: supportTicketsTable.updatedAt,
        customerCompanyName: customersTable.companyName,
        customerUsername: customersTable.username,
      })
      .from(supportTicketsTable)
      .innerJoin(customersTable, eq(supportTicketsTable.customerId, customersTable.id))
      .orderBy(desc(supportTicketsTable.createdAt));

    const allMessages = await db
      .select({
        ticketId: supportTicketMessagesTable.ticketId,
        senderType: supportTicketMessagesTable.senderType,
      })
      .from(supportTicketMessagesTable)
      .orderBy(asc(supportTicketMessagesTable.createdAt));

    const lastSenderByTicket = new Map<number, string>();
    for (const m of allMessages) lastSenderByTicket.set(m.ticketId, m.senderType); // ascending order → last write is the latest message

    const withUnread = rows.map((t) => {
      const lastSender = lastSenderByTicket.get(t.id);
      const unread = t.status !== "closed" && (lastSender ? lastSender === "customer" : t.status === "open");
      return { ...t, unread };
    });

    res.json(withUnread);
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

// Update a ticket's status — fires a portal notification + email to the
// customer, mirroring the invoice/monthly_report notification pattern.
router.put("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { status } = req.body ?? {};

    if (typeof status !== "string" || !STATUSES.includes(status as Status)) {
      res.status(400).json({ message: "Ungültiger Status." });
      return;
    }

    const [existing] = await db.select().from(supportTicketsTable).where(eq(supportTicketsTable.id, id));
    if (!existing) {
      res.status(404).json({ message: "Ticket nicht gefunden." });
      return;
    }

    const [updated] = await db
      .update(supportTicketsTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(supportTicketsTable.id, id))
      .returning();

    if (status !== existing.status) {
      const statusLabel = STATUS_LABELS[status as Status];
      await notifyCustomer({
        customerId: existing.customerId,
        type: "support_ticket",
        title: `Ticket-Update: ${existing.subject}`,
        message: `Status geändert zu „${statusLabel}“.`,
        link: "/dashboard/support",
      });
    }

    res.json(updated);
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

// The reply thread for one ticket (admin can read any ticket's thread).
router.get("/:id/messages", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
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

// Admin reply — appends to the thread and notifies the customer.
router.post("/:id/messages", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { message } = req.body ?? {};
    if (typeof message !== "string" || !message.trim()) {
      res.status(400).json({ message: "Nachricht darf nicht leer sein." });
      return;
    }

    const [ticket] = await db.select().from(supportTicketsTable).where(eq(supportTicketsTable.id, id));
    if (!ticket) {
      res.status(404).json({ message: "Ticket nicht gefunden." });
      return;
    }

    const [created] = await db
      .insert(supportTicketMessagesTable)
      .values({ ticketId: id, senderType: "admin", message: message.trim() })
      .returning();

    await db.update(supportTicketsTable).set({ updatedAt: new Date() }).where(eq(supportTicketsTable.id, id));

    await notifyCustomer({
      customerId: ticket.customerId,
      type: "support_ticket",
      title: `Neue Antwort: ${ticket.subject}`,
      message: message.trim(),
      link: "/dashboard/support",
    });

    res.status(201).json(created);
    return;
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
    return;
  }
});

export default router;
