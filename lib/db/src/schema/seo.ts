import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const seoTable = pgTable("seo_settings", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  pageLabel: text("page_label").notNull(),
  metaTitle: text("meta_title").notNull().default(""),
  metaDescription: text("meta_description").notNull().default(""),
  keywords: text("keywords").notNull().default(""),
  googleVerification: text("google_verification").notNull().default(""),
  headScript: text("head_script").notNull().default(""),
  bodyScript: text("body_script").notNull().default(""),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSeoSchema = createInsertSchema(seoTable).omit({ id: true, updatedAt: true });
export type InsertSeo = z.infer<typeof insertSeoSchema>;
export type SeoSetting = typeof seoTable.$inferSelect;
