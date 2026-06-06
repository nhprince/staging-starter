-- Landing Page Scaffold — D1 Database Schema
-- Cloudflare D1 (SQLite) compatible

-- Leads (from contact/subscribe forms)
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  source TEXT,                   -- which page/form
  metadata TEXT,                 -- JSON (utm params, etc.)
  subscribed BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Page analytics (simple counter)
CREATE TABLE IF NOT EXISTS page_views (
  path TEXT NOT NULL,
  date TEXT NOT NULL,            -- YYYY-MM-DD
  count INTEGER DEFAULT 0,
  PRIMARY KEY (path, date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
