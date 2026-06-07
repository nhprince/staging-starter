# Comments Module

Nested comment system with moderation support.

## Features

- **Nested Comments** — Threaded replies with parent_id
- **Moderation** — pending/approved/spam status workflow
- **REST API** — Full CRUD with count endpoint
- **Author Info** — Name, email, avatar for each comment

## Usage

```bash
cp -r modules/comments/backend/* ~/projects/my-project/backend/src/routes/
cp modules/comments/schema.sql ~/projects/my-project/database/
```

Mount the router:

```typescript
import { commentsRouter } from "./routes/comments";
app.route("/api/comments", commentsRouter());
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/comments/:postId?status=approved` | Get nested comments |
| POST | `/api/comments` | Create comment (default: pending) |
| PATCH | `/api/comments/:id/status` | Moderate (approved/spam/pending) |
| DELETE | `/api/comments/:id` | Delete comment |
| GET | `/api/comments/:postId/count` | Approved comment count |

## Example

```bash
# Post a comment
curl -X POST /api/comments \
  -d '{"post_id":"my-post","author_name":"John","author_email":"john@example.com","content":"Great post!"}'

# Approve it
curl -PATCH /api/comments/<id>/status \
  -d '{"status":"approved"}'
```
