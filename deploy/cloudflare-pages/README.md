# Cloudflare Pages Deploy Config

GitHub Actions workflow for deploying to Cloudflare Pages.

## Usage
```bash
cp deploy/cloudflare-pages/workflow.yml ~/projects/<name>/.github/workflows/deploy-pages.yml
```

## Required Secrets
- `CF_API_TOKEN` — Cloudflare API token (Pages edit permission)
- `CF_ACCOUNT_ID` — Cloudflare account ID

## Trigger
- Auto-deploy on push to `main`
- Manual trigger via GitHub Actions → Run workflow
