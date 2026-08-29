import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { customersTable } from "./customers";

export const contentCalendarEntriesTable = pgTable("content_calendar_entries", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customersTable.id, { onDelete: "cascade" }),
  /** "YYYY-MM-DD" */
  date: text("date").notNull(),
  title: text("title").notNull(),
  /** "post" | "story" | "reel" | "campaign" */
  contentType: text("content_type").notNull().default("post"),
  /** "planned" | "published" */
  status: text("status").notNull().default("planned"),
  note: text("note"),
  /** Full post text actually sent to Buffer — separate from the internal planning `title`. */
  caption: text("caption"),
  /** Public URL (our own /api/gcs/... or any public image URL) attached as the post's image. */
  mediaUrl: text("media_url"),
  /** When this should actually go live via Buffer. */
  scheduledAt: timestamp("scheduled_at"),
  /** Buffer's own post id once createPost succeeds — for status tracking. */
  bufferPostId: text("buffer_post_id"),
  /** "scheduled" | "published" | "failed" — null until a Buffer send is attempted. */
  bufferStatus: text("buffer_status"),
  bufferError: text("buffer_error"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type ContentCalendarEntry = typeof contentCalendarEntriesTable.$inferSelect;
