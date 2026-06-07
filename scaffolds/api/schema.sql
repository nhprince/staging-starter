-- API Scaffold — D1 Database Schema
-- Cloudflare D1 (SQLite) compatible
-- This is a minimal starter — extend with your own resources

-- Example resource table (rename/delete as needed)
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  data TEXT,          -- JSON
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_slug ON resources(slug);
