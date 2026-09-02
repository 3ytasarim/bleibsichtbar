import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const customersTable = pgTable("customers", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("customer"),
  status: text("status").notNull().default("active"),
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone"),
  startDate: timestamp("start_date"),
  quickbooksId: text("quickbooks_id"),
  crmId: text("crm_id"),
  instagramAccountId: text("instagram_account_id"),
  instagramUsername: text("instagram_username"),
  instagramFollowerCount: integer("instagram_follower_count"),
  facebookPageId: text("facebook_page_id"),
  metaAccessTokenEncrypted: text("meta_access_token_encrypted"),
  instagramConnectedAt: timestamp("instagram_connected_at"),
  instagramTokenExpiresAt: timestamp("instagram_token_expires_at"),
  nextcloudShareLink: text("nextcloud_share_link"),
  /** Separate Nextcloud share link for the "Datenbank" area shown to KI & Automatisierungen customers — kept independent from the Social Media one above so a customer booked for both services gets two distinct file areas. */
  nextcloudShareLinkKi: text("nextcloud_share_link_ki"),
  /** Exact Buffer channel "name" (e.g. Instagram handle) as shown in Buffer's channel list — resolved to a real channelId at publish time. */
  bufferChannelName: text("buffer_channel_name"),
  /** Canonical dashed-UUID Notion page ID for this customer's "Content Planung" tab — content is fetched live server-side via the Notion API (one shared integration token) and rendered in our own UI, never publicly embedded. Social Media customers only. */
  notionPageId: text("notion_page_id"),
  /**
   * Which service(s) this customer is booked for — "social_media" | "website" | "ki_automatisierungen".
   * Drives which dashboard variant they see after login: social_media (alone
   * or combined with anything) gets the existing Instagram-centric
   * CustomerDashboard; website-only is a placeholder for now; ki_automatisierungen-only
   * gets its own dashboard (same portal shell, different nav — TBD).
   */
  serviceTypes: text("service_types").array().notNull().default(sql`ARRAY['social_media']::text[]`),
  /** Internal-only CRM tags (e.g. "VIP", "Kündigungsrisiko") — for the admin team's own tracking, never exposed to the customer via any customer-facing endpoint. */
  internalTags: text("internal_tags").array().notNull().default(sql`ARRAY[]::text[]`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCustomerSchema = createInsertSchema(customersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customersTable.$inferSelect;
