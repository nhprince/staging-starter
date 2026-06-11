# PM2 Memory Limits SKILL

## When to Use This Skill
Use when deploying any Node.js process on the VPS.

## Core Knowledge

### RAM Budget on 842MB VPS
- OS + nginx: ~150MB
- Hermes Agent: ~150MB
- Swap buffer: ~100MB
- Available for other services: ~440MB
- Medusa.js (if running): 350-400MB → uses most of the budget
- If running Medusa: DO NOT run anything else heavy

### Ecosystem Config Template
```javascript
// ecosystem.config.js — ALWAYS use this template
module.exports = {
  apps: [
    {
      name: "medusa-backend",
      script: "node_modules/.bin/medusa",
      args: "start",
      max_memory_restart: "380M",  // Restart if > 380MB
      node_args: "--max-old-space-size=350",
      env: { NODE_ENV: "production" }
    },
    {
      name: "fastapi",
      script: "uvicorn",
      args: "main:app --host 0.0.0.0 --port 8000",
      interpreter: "python3",
      max_memory_restart: "200M",
      env: { NODE_ENV: "production" }
    }
  ]
};
```

### PM2 Commands
```bash
# Start
pm2 start ecosystem.config.js

# Monitor
pm2 monit
pm2 status
pm2 logs

# Restart with zero downtime
pm2 reload all

# Save process list
pm2 save

# Startup on boot
pm2 startup
```

## Common Pitfalls
1. **No memory limits** — Process will OOM and crash the VPS
2. **Too many processes** — Each process needs RAM; budget carefully
3. **Not using swap** — Ensure swap is active for burst capacity

## Verification Checklist
- [ ] `pm2 status` shows all processes as "online"
- [ ] `pm2 monit` shows memory within limits
- [ ] `max_memory_restart` set for every process
- [ ] `NODE_OPTIONS` memory cap set
