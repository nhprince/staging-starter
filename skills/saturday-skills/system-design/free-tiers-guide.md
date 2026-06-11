# Free Tiers Guide SKILL

## When to Use This Skill
Use when planning infrastructure to maximize free tier usage.

## Complete Free Service Map

### HOSTING
| Service | Free Tier | Notes |
|---------|-----------|-------|
| Cloudflare Pages | Unlimited bandwidth, unlimited requests | Best for static sites |
| Cloudflare Workers | 100k req/day | Edge compute |
| GitHub Pages | Static only | Simple static hosting |
| Vercel | 100GB bandwidth/month | Hobby tier |

### DATABASES
| Service | Free Tier | Notes |
|---------|-----------|-------|
| Cloudflare D1 | 5GB, 5M reads/day | SQLite at edge |
| Supabase | 500MB Postgres, 50k MAU | Best for SQL apps |
| Neon | 0.5GB Postgres, 190 compute hrs | Serverless Postgres |
| PlanetScale | 5GB MySQL | Hobby tier |
| MongoDB Atlas | 512MB | NoSQL |
| Turso | 9GB SQLite, 1B rows read/mo | Edge SQLite |

### CACHE / QUEUE
| Service | Free Tier | Notes |
|---------|-----------|-------|
| Upstash Redis | 10k commands/day | Serverless Redis |
| Cloudflare KV | 100k reads/day | Edge key-value |

### STORAGE
| Service | Free Tier | Notes |
|---------|-----------|-------|
| Cloudflare R2 | 10GB, free egress | S3-compatible |
| Supabase Storage | 1GB | Integrated with auth |
| Backblaze B2 | 10GB | S3-compatible |

### AUTH
| Service | Free Tier | Notes |
|---------|-----------|-------|
| Clerk | 10k MAU | Beautiful UI components |
| Auth.js | Self-hosted, unlimited | Open source |
| Supabase Auth | 50k MAU | Integrated with DB |
| Lucia | Self-hosted, unlimited | TypeScript-first |

### EMAIL
| Service | Free Tier | Notes |
|---------|-----------|-------|
| Resend | 3k emails/month, 100/day | Best DX |
| Brevo | 300 emails/day | Generous |

### PAYMENTS
| Service | Cost | Notes |
|---------|------|-------|
| Stripe | Free to set up (2.9% + 30¢/txn) | Industry standard |

### AI MODELS (via OpenRouter free tier)
| Model | Strength |
|-------|----------|
| google/gemini-2.5-flash | Fast, good quality |
| deepseek/deepseek-r2 | Excellent coding |
| moonshotai/kimi-k2 | Strong reasoning |
| deepseek/deepseek-chat-v3-0324 | Great for complex tasks |
| google/gemini-2.0-flash-001 | Fast, reliable |

### CI/CD
| Service | Free Tier | Notes |
|---------|-----------|-------|
| GitHub Actions | 2000 min/month | 7GB RAM runners |
| Cloudflare Pages CI | Built-in | Auto-deploy from git |

### DOMAINS
| Source | What |
|--------|------|
| GitHub Student Pack | 1 free .me domain (Namecheap) |
| Cloudflare | Free .workers.dev subdomain |
| Freenom | Free .tk, .ml (unreliable) |

## Cost Optimization Rules
1. **Always start with free tiers** — Only pay when you exceed limits
2. **Use Cloudflare for everything possible** — Pages, Workers, R2, KV, D1
3. **Don't self-host databases** — Supabase free tier > self-hosted on 842MB VPS
4. **Don't self-host Redis** — Upstash free tier is sufficient for MVP
5. **Use GitHub Actions for heavy compute** — 2000 min/month free
6. **Monitor usage** — Set up alerts before hitting limits
