-- CMS Module — D1 Database Schema
-- Cloudflare D1 (SQLite) compatible

-- Content types (defines the structure)
CREATE TABLE IF NOT EXISTS content_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  schema TEXT NOT NULL,          -- JSON: field definitions
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Content entries (actual content)
CREATE TABLE IF NOT EXISTS content_entries (
  id TEXT PRIMARY KEY,
  type_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  data TEXT NOT NULL,            -- JSON: field values
  status TEXT DEFAULT 'draft',   -- draft/published/archived
  author_id TEXT,
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (type_id) REFERENCES content_types(id) ON DELETE CASCADE,
  UNIQUE(type_id, slug)
);

-- Media library
CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT,
  mime_type TEXT,
  size_bytes INTEGER,
  r2_key TEXT NOT NULL,          -- R2 object key
  alt_text TEXT,
  uploaded_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_entries_type ON content_entries(type_id);
CREATE INDEX IF NOT EXISTS idx_entries_status ON content_entries(status);
CREATE INDEX IF NOT EXISTS idx_entries_slug ON content_entries(slug);
CREATE INDEX IF NOT EXISTS idx_media_uploaded ON media(uploaded_by);
