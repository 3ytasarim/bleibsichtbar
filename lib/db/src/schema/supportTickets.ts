import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { customersTable } from "./customers";

/**
 * Customer-initiated support requests ("Ticket erstellen" on the customer
 * dashboard). `message` is the opening message; everything after that
 * (customer follow-ups, admin replies) lives in supportTicketMessagesTable
 * as a proper thread — see below.
 */
export const supportTicketsTable = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customersTable.id, { onDelete: "cascade" }),
  /** "invoice" | "social_media" | "website" | "other" */
  category: text("category").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  /** "open" | "in_progress" | "in_review" | "resolved" | "closed" */
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSupportTicketSchema = createInsertSchema(supportTicketsTable).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type SupportTicket = typeof supportTicketsTable.$inferSelect;

/** One message in a ticket's reply thread — from either side. */
export const supportTicketMessagesTable = pgTable("support_ticket_messages", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").notNull().references(() => supportTicketsTable.id, { onDelete: "cascade" }),
  /** "customer" | "admin" */
  senderType: text("sender_type").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type SupportTicketMessage = typeof supportTicketMessagesTable.$inferSelect;
