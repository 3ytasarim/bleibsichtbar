import { pgTable, serial, integer, text, timestamp, unique } from "drizzle-orm/pg-core";
import { customersTable } from "./customers";

export const monthlyMetricsTable = pgTable(
  "monthly_metrics",
  {
    id: serial("id").primaryKey(),
    customerId: integer("customer_id").notNull().references(() => customersTable.id, { onDelete: "cascade" }),
    /** "YYYY-MM", e.g. "2026-08" */
    yearMonth: text("year_month").notNull(),
    /** Where the numbers came from — kept distinct so manual entries (later) never get silently overwritten by automated rollups. */
    source: text("source").notNull().default("api"),
    followers: integer("followers"),
    reach: integer("reach"),
    totalInteractions: integer("total_interactions"),
    profileViews: integer("profile_views"),
    accountsEngaged: integer("accounts_engaged"),
    note: text("note"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [unique().on(table.customerId, table.yearMonth)]
);

export type MonthlyMetric = typeof monthlyMetricsTable.$inferSelect;
