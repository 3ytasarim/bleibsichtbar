import { pgTable, serial, integer, text, timestamp, unique } from "drizzle-orm/pg-core";
import { customersTable } from "./customers";

export const instagramDailySnapshotsTable = pgTable(
  "instagram_daily_snapshots",
  {
    id: serial("id").primaryKey(),
    customerId: integer("customer_id").notNull().references(() => customersTable.id, { onDelete: "cascade" }),
    date: text("date").notNull(),
    totalInteractions: integer("total_interactions"),
    profileViews: integer("profile_views"),
    accountsEngaged: integer("accounts_engaged"),
    websiteClicks: integer("website_clicks"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [unique().on(table.customerId, table.date)]
);

export type InstagramDailySnapshot = typeof instagramDailySnapshotsTable.$inferSelect;
