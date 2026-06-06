-- API Scaffold — D1 Database Schema
-- Cloudflare D1 (SQLite) compatible

-- API keys for authentication
CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  key TEXT UNIQUE NOT NULL,
  name TEXT,
  permissions TEXT DEFAULT '["read"]',  -- JSON array
  rate_limit INTEGER DEFAULT 100,      -- requests per hour
  active BOOLEAN DEFAULT TRUE,
  last_used_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- API usage logging
CREATE TABLE IF NOT EXISTS api_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  api_key_id TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (api_key_id) REFERENCES api_keys(id)
);

-- Rate limit tracking
CREATE TABLE IF NOT EXISTS rate_limits (
  api_key_id TEXT PRIMARY KEY,
  window_start DATETIME NOT NULL,
  request_count INTEGER DEFAULT 0,
  FOREIGN KEY (api_key_id) REFERENCES api_keys(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_key ON api_usage(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_created ON api_usage(created_at);

-- Seed: default admin key (replace in production)
-- Key: test-api-key-12345
INSERT OR IGNORE INTO api_keys (id, user_id, key, name, permissions, rate_limit) VALUES
  ('key-1', 'admin', 'test-api-key-12345', 'Default Admin Key', '["read","write","delete"]', 1000);
