import { pgTable, serial, integer, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { customersTable } from "./customers";

export const notificationsTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customersTable.id, { onDelete: "cascade" }),
  /** "invoice" | "monthly_report" */
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message"),
  /** Portal-relative path the notification should navigate to, e.g. "/dashboard/rechnungen" */
  link: text("link"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Notification = typeof notificationsTable.$inferSelect;
