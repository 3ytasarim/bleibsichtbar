import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { customersTable } from "./customers";

export const customerDocumentsTable = pgTable("customer_documents", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  /** "briefing" | "strategy" | "brand" | "other" */
  category: text("category").notNull().default("other"),
  fileReference: text("file_reference").notNull(),
  fileName: text("file_name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type CustomerDocument = typeof customerDocumentsTable.$inferSelect;
