# Free VPS Options — No Credit Card Needed

## The $0/Month Infrastructure

Every service in the Cloudflare-first stack is free. The only thing that might cost money is the VPS running Hermes Agent — but even that can be free.

---

## Option 1: Azure for Students (Recommended)

**Best for:** Running Hermes Agent 24/7 for free

1. Go to [azure.microsoft.com/en-us/free/students](https://azure.microsoft.com/en-us/free/students)
2. Click **"Start Free"**
3. Sign in with your **school email** (or verify student status via GitHub)
4. **No credit card required**
5. You get **$100 in Azure credits** + free services for 12 months
6. Create a VM: **B1s tier** (1 vCPU, 1GB RAM) — **free for 750 hours/month**
7. That's enough to run Hermes Agent 24/7 for free

### How to Create the Free VM

1. Go to [portal.azure.com](https://portal.azure.com)
2. Click **"Create a resource"** → **"Virtual Machine"**
3. Choose:
   - **Resource group:** Create new (e.g., `hermes-agent`)
   - **Name:** `hermes-vps`
   - **Region:** closest to you
   - **Image:** Ubuntu 24.04 LTS
   - **Size:** **B1s** (1 vCPU, 1GB RAM) — marked as **Free**
   - **Authentication:** SSH public key
4. Click **"Review + Create"** → **"Create"**

---

## Option 2: Oracle Cloud Free Tier

**Best for:** Most powerful free VPS

1. Go to [oracle.com/cloud/free](https://www.oracle.com/cloud/free/)
2. Sign up — **no credit card required**
3. Get **4 ARM-based VMs** (up to 24GB RAM) — **forever free**

---

## Option 3: GitHub Student Developer Pack

1. Apply at [education.github.com/pack](https://education.github.com/pack)
2. Get: **$100 Azure** + **$200 DO** + **$300 Oracle** + **Heroku $13/mo** + **JetBrains IDEs** + **free domain** + more

---

## Best Combo: $0/Month Everything

| Resource | Source | Cost |
|----------|--------|------|
| VPS | Azure for Students / Oracle Cloud | $0 |
| Frontend | Cloudflare Pages | $0 |
| Backend | Cloudflare Workers | $0 |
| Database | Cloudflare D1 | $0 |
| CI/CD | GitHub Actions | $0 |
| AI Models | OpenRouter free tier | $0 |
| Messaging | Telegram + WhatsApp | $0 |
| IDE | JetBrains (Student Pack) | $0 |
| Domain | Namecheap (Student Pack) | $0 |

**Total: $0/month forever**

---

## Non-Student Options

- **Oracle Cloud:** Always-free ARM instances (no student verification)
- **Google Cloud:** $300 credits / 90 days (CC required)
- **AWS:** 12-month free tier (CC required)