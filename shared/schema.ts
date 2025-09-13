import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const assessments = pgTable("assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  type: varchar("type").notNull(), // 'anxiety', 'depression', 'stress', 'sleep'
  responses: json("responses").notNull(),
  score: integer("score").notNull(),
  severity: varchar("severity").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const moodEntries = pgTable("mood_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  mood: integer("mood").notNull(), // 1-10 scale
  notes: text("notes"),
  sleepHours: integer("sleep_hours"),
  stressLevel: integer("stress_level"), // 1-10 scale
  createdAt: timestamp("created_at").defaultNow(),
});

export const forumPosts = pgTable("forum_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: varchar("category").notNull(), // 'anxiety', 'depression', 'stress', 'general'
  isModerated: boolean("is_moderated").default(false),
  likesCount: integer("likes_count").default(0),
  repliesCount: integer("replies_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const forumReplies = pgTable("forum_replies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull(),
  sessionId: varchar("session_id").notNull(),
  content: text("content").notNull(),
  likesCount: integer("likes_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const resources = pgTable("resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: varchar("category").notNull(), // 'anxiety', 'depression', 'stress', 'sleep', 'general'
  type: varchar("type").notNull(), // 'article', 'video', 'audio', 'exercise'
  readTime: integer("read_time"), // in minutes
  icon: varchar("icon"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const campusServices = pgTable("campus_services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: varchar("type").notNull(), // 'counseling', 'support_group', 'wellness', 'crisis'
  availability: text("availability"),
  contact: text("contact"),
  location: text("location"),
  bookingUrl: text("booking_url"),
});

// Insert schemas
export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
});

export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({
  id: true,
  createdAt: true,
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  createdAt: true,
  likesCount: true,
  repliesCount: true,
  isModerated: true,
});

export const insertForumReplySchema = createInsertSchema(forumReplies).omit({
  id: true,
  createdAt: true,
  likesCount: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

export const insertCampusServiceSchema = createInsertSchema(campusServices).omit({
  id: true,
});

// Types
export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;

export type MoodEntry = typeof moodEntries.$inferSelect;
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;

export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;

export type ForumReply = typeof forumReplies.$inferSelect;
export type InsertForumReply = z.infer<typeof insertForumReplySchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export type CampusService = typeof campusServices.$inferSelect;
export type InsertCampusService = z.infer<typeof insertCampusServiceSchema>;
