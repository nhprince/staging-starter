-- SaaS Scaffold — D1 Database Schema
-- Cloudflare D1 (SQLite) compatible

-- Users (managed by AuthJS module)
-- CREATE TABLE users — see modules/authjs

-- Subscriptions (managed by Payments module)
-- CREATE TABLE subscriptions — see modules/payments-stripe

-- Teams
CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id TEXT NOT NULL,
  plan TEXT DEFAULT 'free',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  team_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT DEFAULT 'member',  -- owner/admin/member
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  UNIQUE(team_id, user_id)
);

-- Usage tracking
CREATE TABLE IF NOT EXISTS usage_logs (
  id TEXT PRIMARY KEY,
  team_id TEXT NOT NULL,
  action TEXT NOT NULL,
  metadata TEXT,  -- JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_teams_owner ON teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_team ON usage_logs(team_id);
CREATE INDEX IF NOT EXISTS idx_usage_created ON usage_logs(created_at);
