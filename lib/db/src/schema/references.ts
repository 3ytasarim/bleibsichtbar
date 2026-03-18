import { pgTable, text, integer, boolean, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const referencesTable = pgTable("references", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  clientTitle: text("client_title"),
  company: text("company").notNull(),
  logoUrl: text("logo_url"),
  testimonial: text("testimonial"),
  rating: integer("rating"),
  published: boolean("published").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReferenceSchema = createInsertSchema(referencesTable).omit({ id: true, createdAt: true });
export type InsertReference = z.infer<typeof insertReferenceSchema>;
export type Reference = typeof referencesTable.$inferSelect;
