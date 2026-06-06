-- Blog Scaffold — D1 Database Schema
-- Cloudflare D1 (SQLite) compatible

-- Blog posts
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,              -- MDX content
  cover_image TEXT,
  published BOOLEAN DEFAULT FALSE,
  author_id TEXT,
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT
);

-- Tags
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- Post-Tag relation
CREATE TABLE IF NOT EXISTS post_tags (
  post_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Post-Category relation
CREATE TABLE IF NOT EXISTS post_categories (
  post_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  PRIMARY KEY (post_id, category_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Authors (extends users)
CREATE TABLE IF NOT EXISTS authors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  twitter TEXT,
  github TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);
CREATE INDEX IF NOT EXISTS idx_post_tags_post ON post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag ON post_tags(tag_id);

-- Seed data
INSERT OR IGNORE INTO categories (id, name, slug) VALUES
  ('cat-1', 'General', 'general'),
  ('cat-2', 'Tutorial', 'tutorial'),
  ('cat-3', 'News', 'news');

INSERT OR IGNORE INTO tags (id, name, slug) VALUES
  ('tag-1', 'nextjs', 'nextjs'),
  ('tag-2', 'cloudflare', 'cloudflare'),
  ('tag-3', 'typescript', 'typescript'),
  ('tag-4', 'react', 'react');

INSERT OR IGNORE INTO authors (id, name, bio) VALUES
  ('author-1', 'Prince', 'Full-Stack Developer | Python | Cybersecurity');
