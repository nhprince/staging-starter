---
name: configure-cloudflare
description: "Set up Cloudflare resources for a project — KV, D1, R2, Pages, Workers. Use when provisioning new project infrastructure or adding CF resources to existing projects."
version: 1.0.0
author: Saturday (for Prince)
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [cloudflare, infrastructure, kv, d1, r2, pages, workers, provisioning]
    related_skills: [cloudflare, wrangler, cloudflare-deployment, scaffold-project]
---

# Configure Cloudflare — Resource Provisioning

## Overview

Provisions and configures all Cloudflare resources for a project: KV namespaces, D1 databases, R2 buckets, Pages projects, and Workers. This is the **infrastructure setup** step after scaffolding.

## When to Use

- Setting up a new project's Cloudflare resources
- Adding KV/D1/R2 to an existing project
- Reconfiguring Cloudflare after project changes
- **Don't use for:** deploying code (use cloudflare-deployment)

## Prerequisites

```bash
export PATH="/home/nhprince/.hermes/node/bin:$PATH"
# Verify auth
wrangler whoami
```

## Resource Setup Workflow

### 1. KV Namespace

```bash
# Create
wrangler kv namespace create <PROJECT>-KV
# Output: { binding = "KV", id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }

# Update wrangler.toml
# [[kv_namespaces]]
# binding = "KV"
# id = "<the-id-from-above>"
```

### 2. D1 Database

```bash
# Create
wrangler d1 create <project>-db
# Output: { binding = "DB", database_name = "...", database_id = "..." }

# Update wrangler.toml
# [[d1_databases]]
# binding = "DB"
# database_name = "<project>-db"
# database_id = "<the-id-from-above>"

# Run migrations
wrangler d1 execute <project>-db --file=./schema.sql
```

### 3. R2 Bucket (for file uploads)

```bash
# Create
wrangler r2 bucket create <project>-assets

# Update wrangler.toml
# [[r2_buckets]]
# binding = "ASSETS"
# bucket_name = "<project>-assets"
```

### 4. Pages Project

```bash
wrangler pages project create <project> --production-branch=main
```

### 5. Worker Routes (for custom domains)

```bash
# In wrangler.toml
# routes = [
#   { pattern = "api.example.com/*", zone_name = "example.com" }
# ]
```

## GitHub Secrets to Set

After creating resources, add to the project's GitHub repo:

```bash
gh secret set CF_API_TOKEN --body "$CF_API_TOKEN" --repo nhprince/<project>
gh secret set CF_ACCOUNT_ID --body "89f7e2d36d8ec57f55770ee400685f53" --repo nhprince/<project>
gh secret set KV_NAMESPACE_ID --body "<kv-id>" --repo nhprince/<project>
gh secret set D1_DATABASE_ID --body "<d1-id>" --repo nhprince/<project>
```

## Common Pitfalls

1. **Not exporting PATH** — wrangler is at `/home/nhprince/.hermes/node/bin/wrangler`
2. **Wrong binding names** — Must match code: `c.env.KV` needs `binding = "KV"`
3. **Forgetting migrations** — D1 tables don't exist until you run schema.sql
4. **Not saving IDs** — Copy the exact ID from wrangler output, no extra spaces

## Verification Checklist

- [ ] KV namespace created, ID in wrangler.toml
- [ ] D1 database created, ID in wrangler.toml
- [ ] R2 bucket created (if needed), binding in wrangler.toml
- [ ] Pages project created
- [ ] GitHub Secrets set (CF_API_TOKEN, CF_ACCOUNT_ID, KV_ID, D1_ID)
- [ ] D1 migrations applied
- [ ] `wrangler dev` works locally

## Agent Tip 🤖

> Always use consistent naming: `<PROJECT>-KV` for KV, `<project>-db` for D1, `<project>-assets` for R2.
> This makes it easy to identify resources in the Cloudflare dashboard.
