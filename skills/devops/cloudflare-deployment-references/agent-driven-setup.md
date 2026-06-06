# Agent-Driven Setup — Just Ask

## Philosophy

This guide shows every manual step so you understand what's happening. But in practice, **you can skip all of it and just ask the agent (Saturday)** to do it for you.

## What to Say Instead of Doing It Manually

| Instead of... | Just say... |
|---------------|-------------|
| Manually editing `~/.hermes/config.yaml` | "Add all free OpenRouter models as fallbacks" |
| Running `curl` to find free models | "Find all free models on OpenRouter" |
| Manually editing `config.yaml` scalars | "Set model default to nemotron-3-super free" |
| Creating Cloudflare KV/D1 resources | "Create a KV namespace and D1 database for my project" |
| Writing `wrangler.toml` manually | "Configure wrangler for my project with D1 and KV" |
| Writing GitHub Actions YAML | "Create a CI/CD pipeline that auto-deploys to Cloudflare" |
| Creating GitHub repo + pushing code | "Create a new GitHub repo called X and push this project" |
| Adding GitHub secrets | "Add CF_API_TOKEN and CF_ACCOUNT_ID as GitHub secrets" |
| Installing Node/pnpm/Bun/PM2 | "Install Node.js, pnpm, Bun, and PM2" |
| Configuring nginx reverse proxy | "Set up nginx reverse proxy for my app on port 3000" |
| Creating project from scratch | "Create a new full-stack project with Next.js frontend and Hono backend" |
| Writing cron scripts | "Set up a daily cron job that refreshes free models" |
| Configuring messaging platforms | "Connect my Telegram bot to Hermes" |
| Writing the whole deploy pipeline | "Set up dual deploy with Cloudflare default and server fallback" |

## The Pattern

1. Describe what you want in plain English
2. The agent figures out the configs, YAML, CLI commands, etc.
3. The agent runs everything and reports back
4. If something fails, the agent fixes it

## Why Both Exist

- **Manual guide:** For understanding, learning, debugging, and when the agent is unavailable
- **Agent-driven:** For speed, convenience, and avoiding typos in complex configs

## The Agent Can Also

- **Debug failures:** "My GitHub Action deploy failed, fix it"
- **Update configs:** "Add 5 more free models to fallbacks"
- **Create resources:** "Create a new Cloudflare Worker for my API"
- **Write code:** "Add a /api/users endpoint to my Hono backend"
- **Fix issues:** "My worker URL shows DNS error, what's wrong?"

The agent has full access to the server, GitHub, Cloudflare, and all tools. Use it.
