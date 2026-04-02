import { pgTable, text, timestamp, serial, jsonb } from "drizzle-orm/pg-core";

export const onboardingsTable = pgTable("onboardings", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  ansprechpartner: text("ansprechpartner"),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Onboarding = typeof onboardingsTable.$inferSelect;
export type InsertOnboarding = typeof onboardingsTable.$inferInsert;
