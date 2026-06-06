# Skills Directory — Saturday Framework Skills

This directory contains all skills for the **Saturday** framework.
Skills are organized by category and can be used by Saturday to build projects.

> **Companion Guide:** For setting up the AI agent (Saturday) on a VPS, see the [AI VPS Setup Guide](https://github.com/nhprince/server-setup-guide).

## Structure

```
skills/
├── devops/                          # DevOps skills
│   ├── scaffold-project.md          # One-command project generator
│   ├── cloudflare-deployment.md     # CF Pages + Workers deploy
│   ├── configure-cloudflare.md      # KV, D1, R2, Pages, Workers setup
│   ├── configure-vps.md             # PM2, Nginx, PostgreSQL, Python, PHP
│   └── cloudflare-deployment-references/  # Reference docs
├── project-types/                   # Project-type build skills
│   ├── build-blog.md                # MDX blog with admin, RSS, SEO
│   ├── build-saas.md                # SaaS with Clerk + Stripe + dashboard
│   ├── build-portfolio.md           # Developer portfolio
│   ├── build-api.md                 # REST API with rate limiting
│   ├── build-ecommerce.md           # Store with cart + Stripe
│   └── build-landing.md             # Marketing site with lead capture
├── frontends/                       # Frontend framework skills
│   ├── astro-scaffold.md            # Astro scaffold
│   └── sveltekit-scaffold.md        # SvelteKit scaffold
├── auth/                            # Auth skills
│   └── add-auth.md                  # Auth integration
├── databases/                       # Database skills
│   └── add-database.md              # Database setup
├── modules/                         # Feature module skills
│   ├── stripe-payments.md           # Stripe integration
│   ├── email-service.md             # Transactional email
│   └── file-upload.md               # R2 file uploads
└── testing/                         # Testing skills
    └── playwright-e2e.md            # E2E tests with Playwright
```

## Usage

When Prince says "build me a blog", Saturday:
1. Reads `skills/project-types/build-blog.md`
2. Follows the workflow: scaffold → configure → build → deploy → verify
3. Uses devops skills (scaffold-project, cloudflare-deployment, etc.) as needed
4. Uses module skills (add-auth, add-database) for specific features

## Skill Format

Each skill follows the Hermes Agent SKILL.md format:
- YAML frontmatter (name, description, version, author, license)
- Overview
- When to Use
- Step-by-step workflow
- Common Pitfalls
- Verification Checklist
- Agent Tip 🤖
