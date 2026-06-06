# Email Module for Saturday Framework

## Overview

Transactional email sending via [Resend](https://resend.com) — the developer-friendly email API.

**Cost:** Free tier includes 3,000 emails/month.

## Setup

### 1. Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Create an account and verify your domain
3. Get your API key

### 2. Configure

```bash
wrangler secret put RESEND_API_KEY
```

Add to `saturday.yaml`:
```yaml
secrets:
  - RESEND_API_KEY
```

## Backend Integration

Copy `backend/src/routes/email.ts` into your project:

```typescript
import { emailRouter } from "./routes/email";
app.route("/api/email", emailRouter);
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/email/send` | Send a transactional email |
| POST | `/api/email/welcome` | Send welcome email |
| POST | `/api/email/notify` | Send notification |

## Send Email

```bash
curl -X POST https://your-worker.workers.dev/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Hello from Saturday",
    "html": "<h1>Welcome!</h1><p>Thanks for joining.</p>"
  }'
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_FROM` | Default sender email (e.g., `noreply@yourdomain.com`) |
