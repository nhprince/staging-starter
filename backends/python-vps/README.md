# Python VPS Backend Blueprint

FastAPI + uvicorn + PM2 on VPS with Nginx reverse proxy.

## Usage
```bash
cp -r backends/python-vps/* ~/projects/<name>/backend/
```

## What's Included
- `app/main.py` — FastAPI app with CORS, health check
- `app/models/` — SQLAlchemy models
- `app/routes/` — API route modules
- `app/middleware/` — Auth, logging middleware
- `requirements.txt` — Python dependencies
- `pm2.config.js` — PM2 process config
- `nginx.conf` — Nginx reverse proxy config
- `schema.sql` — PostgreSQL schema

## Stack
- **Runtime:** Python 3.11 + FastAPI
- **Server:** uvicorn + gunicorn
- **Process:** PM2
- **Proxy:** Nginx
- **Database:** PostgreSQL
