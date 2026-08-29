import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { customersTable } from "./customers";

/**
 * A customer's step-by-step roadmap ("Update" page) — admin writes items
 * ("Wir richten X ein", "Y wird getestet"...) and moves them across three
 * stages; the customer sees a read-only Kanban board of their own items.
 * Moving an item to a new status notifies the customer (see notifyCustomer
 * type "roadmap_update").
 */
export const roadmapItemsTable = pgTable("roadmap_items", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  /** "in_progress" (İşlemde) | "preparing" (Hazırlanıyor) | "completed" (Tamamlandı) */
  status: text("status").notNull().default("in_progress"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type RoadmapItem = typeof roadmapItemsTable.$inferSelect;
