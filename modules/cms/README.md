# CMS Module

Headless CMS with content type builder, entries management, and media library.

## Features

- **Content Type Builder** — Define custom content types with JSON schema
- **Entries CRUD** — Create, read, update, delete content entries
- **Draft/Publish Workflow** — Status management (draft → published → archived)
- **Media Library** — File uploads via R2 with metadata tracking
- **Validation** — Zod-based request validation
- **REST API** — Full RESTful API for all operations

## Usage

```bash
# Copy module files into your project
cp -r modules/cms/backend/* ~/projects/my-project/backend/src/routes/
cp modules/cms/schema.sql ~/projects/my-project/database/
```

Mount the router in your Worker:

```typescript
// backend/src/index.ts
import { cmsRouter } from "./routes/cms";
app.route("/api/cms", cmsRouter());
```

Run the schema:

```bash
wrangler d1 execute my-db --file=database/schema.sql
```

## API Endpoints

### Content Types

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/cms/types` | List all content types |
| GET | `/api/cms/types/:id` | Get single content type |
| POST | `/api/cms/types` | Create content type |
| PUT | `/api/cms/types/:id` | Update content type |
| DELETE | `/api/cms/types/:id` | Delete content type |

### Content Entries

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/cms/entries?type=&status=&limit=&offset=` | List entries |
| GET | `/api/cms/entries/:id` | Get single entry |
| POST | `/api/cms/entries` | Create entry |
| PUT | `/api/cms/entries/:id` | Update entry |
| DELETE | `/api/cms/entries/:id` | Delete entry |

### Media Library

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/cms/media?limit=&offset=` | List media files |
| POST | `/api/cms/media/upload-url` | Get upload URL |
| DELETE | `/api/cms/media/:id` | Delete media file |

## Example: Creating a Blog Post

```bash
# 1. Create content type
curl -X POST /api/cms/types \
  -d '{"name":"Post","slug":"post","schema":"{\"fields\":[{\"name\":\"title\",\"type\":\"text\",\"required\":true},{\"name\":\"body\",\"type\":\"richtext\"}]}"}'

# 2. Create entry
curl -X POST /api/cms/entries \
  -d '{"type_id":"<type-id>","slug":"hello-world","title":"Hello World","data":"{\"title\":\"Hello World\",\"body\":\"<p>My first post</p>\"}","status":"published"}'
```

## Database Schema

See `schema.sql` for the full D1 schema.

## Cloudflare Bindings

```toml
# wrangler.toml
[[d1_databases]]
binding = "DB"
database_name = "my-db"

[[r2_buckets]]
binding = "R2"
bucket_name = "my-media"
```

## Environment Variables

None required. Uses standard Cloudflare bindings (`DB`, `R2`).
