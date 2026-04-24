import { pgTable, text, integer, boolean, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  titleNl: text("title_nl"),
  titleFr: text("title_fr"),
  description: text("description").notNull(),
  descriptionEn: text("description_en"),
  descriptionNl: text("description_nl"),
  descriptionFr: text("description_fr"),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  clientName: text("client_name"),
  websiteUrl: text("website_url"),
  galleryImages: text("gallery_images").array().notNull().default([]),
  tags: text("tags").array().notNull().default([]),
  statFollowers: text("stat_followers"),
  statLikes: text("stat_likes"),
  statViews: text("stat_views"),
  published: boolean("published").notNull().default(false),
  showOnHomepage: boolean("show_on_homepage").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;
