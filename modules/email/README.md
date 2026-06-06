# Email Module

Transactional email via Resend, Mailgun, or Cloudflare Email.

## Usage
```bash
cp -r modules/email/* ~/projects/<name>/modules/email/
```

## What's Included
- `backend/src/routes/email.ts` — Email sending API
- `backend/src/lib/email.ts` — Email client (Resend)
- `backend/src/templates/` — HTML email templates
- `frontend/components/SubscribeForm.tsx` — Newsletter signup

## Setup
1. Create Resend account (recommended)
2. Verify domain
3. Add RESEND_API_KEY to secrets
