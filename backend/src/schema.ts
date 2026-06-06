import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  avatar: text("avatar"),
  role: text("role").default("user"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Sessions table
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  token: text("token").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// API keys table
export const apiKeys = sqliteTable("api_keys", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  key: text("key").notNull().unique(),
  name: text("name"),
  permissions: text("permissions").default("read"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  lastUsedAt: integer("last_used_at", { mode: "timestamp" }),
});

// Content table (generic, used by blog, etc.)
export const content = sqliteTable("content", {
  id: text("id").primaryKey(),
  type: text("type").notNull(), // "post", "page", "product", etc.
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  body: text("body"),
  excerpt: text("excerpt"),
  status: text("status").default("draft"), // "draft", "published", "archived"
  authorId: text("author_id").notNull().references(() => users.id),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
