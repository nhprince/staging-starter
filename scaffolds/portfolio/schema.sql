-- Portfolio Scaffold — Database Schema
-- Cloudflare D1 (SQLite) compatible

-- Projects/works
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  image_url TEXT,
  project_url TEXT,
  github_url TEXT,
  tags TEXT,  -- JSON array
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Work experience
CREATE TABLE IF NOT EXISTS experience (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  start_date TEXT,
  end_date TEXT,
  current BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  level INTEGER DEFAULT 0,  -- 0-100
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_experience_sort ON experience(sort_order);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);

-- Seed data
INSERT OR IGNORE INTO projects (id, title, slug, description, content, tags, featured, sort_order) VALUES
  ('proj-1', 'Saturday Framework', 'saturday-framework', 'A full-stack web development framework for building on 100% free infrastructure.', 'Saturday is a full-stack web development framework that lets anyone build and deploy web applications on 100% free Cloudflare infrastructure. Built with Next.js, Hono, D1, and KV.', '["nextjs", "cloudflare", "typescript", "hono"]', 1, 1),
  ('proj-2', 'Personal Blog', 'personal-blog', 'A dark-themed blog built with Next.js and Cloudflare D1.', 'A minimal, fast blog with MDX support, dark theme, and edge deployment. Features include syntax highlighting, RSS feed, and SEO optimization.', '["nextjs", "mdx", "d1", "tailwindcss"]', 1, 2),
  ('proj-3', 'API Service', 'api-service', 'RESTful API built on Cloudflare Workers with D1 database.', 'A high-performance API service running at the edge. Features include rate limiting, JWT authentication, and automatic documentation.', '["hono", "workers", "d1", "api"]', 0, 3);

INSERT OR IGNORE INTO experience (id, company, role, description, start_date, end_date, current, sort_order) VALUES
  ('exp-1', 'Freelance', 'Full-Stack Developer', 'Building modern web applications with Next.js, Cloudflare, and serverless architecture.', '2024-01-01', NULL, TRUE, 1),
  ('exp-2', 'Open Source', 'Contributor', 'Contributing to open-source projects in the Cloudflare and Next.js ecosystems.', '2023-06-01', NULL, TRUE, 2);

INSERT OR IGNORE INTO skills (id, name, category, level, sort_order) VALUES
  ('skill-1', 'TypeScript', 'Languages', 95, 1),
  ('skill-2', 'Python', 'Languages', 90, 2),
  ('skill-3', 'JavaScript', 'Languages', 95, 3),
  ('skill-4', 'Next.js', 'Frontend', 90, 4),
  ('skill-5', 'React', 'Frontend', 90, 5),
  ('skill-6', 'TailwindCSS', 'Frontend', 85, 6),
  ('skill-7', 'Hono', 'Backend', 85, 7),
  ('skill-8', 'Cloudflare Workers', 'Backend', 85, 8),
  ('skill-9', 'D1 Database', 'Database', 80, 9),
  ('skill-10', 'PostgreSQL', 'Database', 75, 10);
