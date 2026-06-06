# Framework Deployment Workflow

When deploying a scaffolded project from the Staging Starter framework, use these workflow templates.

## Cloudflare Pages + Workers (Default)

```yaml
name: Deploy to Cloudflare
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "pnpm"

      - name: Install frontend deps
        run: cd frontend && pnpm install --no-frozen-lockfile
      - name: Build frontend
        run: cd frontend && pnpm build
      - name: Deploy Frontend to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          workingDirectory: frontend
          command: pages deploy out --project-name=${{ github.event.repository.name }}

      - name: Install backend deps
        run: cd backend && pnpm install --no-frozen-lockfile
      - name: Deploy Backend to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          workingDirectory: backend
          command: deploy
```

## VPS SSH Deploy (Fallback)

```yaml
name: Deploy to VPS
on:
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to VPS via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd ~/projects/${{ github.event.repository.name }}
            git pull origin main
            pnpm install
            cd frontend && pnpm build && cd ..
            cd backend && pnpm install && cd ..
            pm2 restart ${{ github.event.repository.name }} 2>/dev/null || echo "No PM2 process"
            echo "✅ Deployed to server"
```

## Required Secrets

| Secret | Value |
|--------|-------|
| `CF_API_TOKEN` | Cloudflare API token (Pages + Workers + D1 scope) |
| `CF_ACCOUNT_ID` | From Cloudflare dashboard (e.g. `89f7e2d36d8ec57f55770ee400685f53`) |
| `SERVER_HOST` | VPS IP or domain |
| `SERVER_USER` | SSH username |
| `SERVER_SSH_KEY` | Full private SSH key (including BEGIN/END markers) |
