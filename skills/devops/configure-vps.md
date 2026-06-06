---
name: configure-vps
description: "Configure VPS backend services — PM2, Nginx, PostgreSQL, Python, PHP. Use when deploying Python/FastAPI, PHP/Laravel, or PostgreSQL projects to the VPS."
version: 1.0.0
author: Saturday (for Prince)
license: MIT
platforms: [linux]
metadata:
  hermes:
    tags: [vps, pm2, nginx, postgresql, python, php, fastapi, laravel, deployment]
    related_skills: [backend-design, fullstack-developer, scaffold-project]
---

# Configure VPS — Backend Services Setup

## Overview

Sets up backend services on the VPS (Azure VM) for projects that can't run on Cloudflare Workers: Python/FastAPI, PHP/Laravel, PostgreSQL, and other server-side stacks.

## When to Use

- Prince needs Python/ML backend
- PHP/Laravel project
- PostgreSQL database (not SQLite/D1)
- Heavy computation that exceeds Workers limits
- **Don't use for:** simple APIs (use Hono Workers instead)

## Server Access

```bash
# Server details from memory
ssh -i ~/.ssh/id_ed25519 <user>@<host>
```

## PM2 Process Manager

```bash
# Install
npm install -g pm2

# Start app
pm2 start app.py --name <project> --interpreter python3
pm2 start "pnpm start" --name <project>

# Auto-start on boot
pm2 startup
pm2 save

# Monitor
pm2 list
pm2 logs <project>
pm2 restart <project>
```

## Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/<project>
server {
    listen 80;
    server_name api.<project>.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/<project> /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## Python/FastAPI Setup

```bash
# Create venv
python3 -m venv /opt/<project>/venv
source /opt/<project>/venv/bin/activate
pip install fastapi uvicorn[standard] gunicorn

# Start with PM2
pm2 start "gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker --bind 127.0.0.1:8000" --name <project>
```

## PostgreSQL Setup

```bash
sudo apt install postgresql postgresql-contrib
sudo -u postgres psql -c "CREATE DATABASE <project>;"
sudo -u postgres psql -c "CREATE USER <user> WITH PASSWORD '<pass>';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE <project> TO <user>;"

# Allow remote (if needed)
# /etc/postgresql/16/main/pg_hba.conf
# host all all 0.0.0.0/0 scram-sha-256
```

## Common Pitfalls

1. **Not using venv** — Always isolate Python deps
2. **PM2 not saving** — Run `pm2 save` after `pm2 startup`
3. **Nginx not testing** — Always `nginx -t` before reload
4. **Forgetting firewall** — `sudo ufw allow 80,443`

## Verification Checklist

- [ ] PM2 process running (`pm2 list`)
- [ ] Nginx config valid (`nginx -t`)
- [ ] App responds on localhost port
- [ ] Nginx proxy works from external
- [ ] SSL configured (certbot)
- [ ] Auto-start on boot enabled

## Agent Tip 🤖

> Always prefer Cloudflare Workers when possible. Use VPS only for:
> - Python/ML workloads
> - PHP/Laravel
> - PostgreSQL with complex queries
> - Long-running background tasks
