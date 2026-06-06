-- Portfolio Scaffold — D1 Database Schema
-- Cloudflare D1 (SQLite) compatible

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  github_url TEXT,
  live_url TEXT,
  tags TEXT,                     -- JSON array
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Site settings (key-value)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed data
INSERT OR IGNORE INTO settings (key, value) VALUES
  ('site_title', 'My Portfolio'),
  ('site_description', 'Full-Stack Developer'),
  ('hero_title', 'Hi, I''m a Developer'),
  ('hero_subtitle', 'I build things for the web'),
  ('about_bio', 'Full-Stack Developer passionate about building great products.'),
  ('contact_email', 'hello@example.com'),
  ('github_url', 'https://github.com/'),
  ('linkedin_url', 'https://linkedin.com/in/'),
  ('twitter_url', 'https://twitter.com/');
