-- Stripe Payments Module — D1 Database Schema
-- Cloudflare D1 (SQLite) compatible

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT DEFAULT 'active',  -- active/canceled/past_due/trialing
  plan TEXT,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subs_customer ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subs_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subs_email ON subscriptions(email);
