# CMS Module

Headless CMS with admin panel, content types, and media library.

## Usage
```bash
cp -r modules/cms/* ~/projects/<name>/modules/cms/
```

## Features
- Content type builder (text, rich text, image, relation)
- Admin panel for content management
- Media library with R2 storage
- API for fetching content
- Preview mode
- Draft/publish workflow

## Database Schema
```sql
CREATE TABLE content_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  schema TEXT NOT NULL,  -- JSON schema
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_entries (
  id TEXT PRIMARY KEY,
  type_id TEXT NOT NULL,
  data TEXT NOT NULL,  -- JSON data
  status TEXT DEFAULT 'draft',
  author_id TEXT,
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (type_id) REFERENCES content_types(id)
);
```
