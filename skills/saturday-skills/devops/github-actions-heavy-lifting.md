# GitHub Actions Heavy Lifting SKILL

## When to Use This Skill
Use when any task requires >200MB RAM. Offload to GitHub Actions.

## Core Knowledge

### Trigger Patterns
1. **On push to main** → Build + Deploy (standard)
2. **On webhook from VPS** → Heavy compute jobs
3. **On schedule** → Nightly tasks
4. **Manual dispatch** → One-off jobs

### Trigger from VPS (No RAM Cost)
```bash
# Trigger a workflow
gh workflow run deploy.yml --repo nhprince/myproject

# Trigger with inputs
gh workflow run build.yml \
  --repo nhprince/myproject \
  -f environment=production
```

### Trigger from Cloudflare Workers
```typescript
await fetch(`https://api.github.com/repos/nhprince/${repo}/actions/workflows/deploy.yml/dispatches`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${env.GH_TOKEN}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ ref: "main" })
});
```

### Universal Deploy Template
```yaml
# .github/workflows/build-and-deploy.yml
name: Build and Deploy
on:
  push: { branches: [main] }
  workflow_dispatch:

jobs:
  build-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: cd frontend && pnpm install --frozen-lockfile
      - run: cd frontend && pnpm build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          workingDirectory: frontend
          command: pages deploy out --project-name=${{ vars.PROJECT_NAME }}

  deploy-backend-vps:
    needs: build-frontend
    runs-on: ubuntu-latest
    if: vars.HAS_VPS_BACKEND == "true"
    steps:
      - uses: actions/checkout@v4
      - uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd ~/projects/${{ vars.PROJECT_NAME }}/backend
            git pull origin main
            NODE_OPTIONS="--max-old-space-size=512" pnpm install --frozen-lockfile
            pm2 restart ${{ vars.PROJECT_NAME }} || pm2 start ecosystem.config.js
```

### Heavy Task Template
```yaml
# .github/workflows/heavy-task.yml
name: Heavy Task
on:
  workflow_dispatch:
    inputs:
      task:
        description: "Task to run"
        required: true
        type: choice
        options: [install-deps, run-tests, lint-all, generate-types, build-medusa]
      project:
        description: "Project name"
        required: true

jobs:
  run-task:
    runs-on: ubuntu-latest  # 7GB RAM — do anything here
    steps:
      - uses: actions/checkout@v4
        with:
          repository: nhprince/${{ inputs.project }}
          token: ${{ secrets.GH_PAT }}
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - run: pnpm install
      - name: Run requested task
        run: |
          case "${{ inputs.task }}" in
            install-deps) echo "Dependencies installed" ;;
            run-tests) pnpm test ;;
            lint-all) pnpm lint ;;
            generate-types) pnpm run generate ;;
            build-medusa) cd backend && pnpm build ;;
          esac
```

## Common Pitfalls
1. **Running builds on VPS** — Always use GitHub Actions
2. **Not caching dependencies** — Use `cache: pnpm` in setup-node
3. **Missing secrets** — Add CF_API_TOKEN, CF_ACCOUNT_ID to repo secrets
4. **No memory limits** — Even in GH Actions, set NODE_OPTIONS

## Verification Checklist
- [ ] Workflow triggers on push to main
- [ ] Build completes without OOM
- [ ] Deployment to Cloudflare Pages successful
- [ ] VPS backend deployment via SSH working
- [ ] Heavy task workflow triggerable from VPS
