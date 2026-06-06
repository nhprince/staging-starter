# Skills Directory — Saturday Framework Skills

This directory contains all skills for the **Saturday** framework.
Skills are organized by category and can be used by Saturday to build projects.

> **Companion Guide:** For setting up the AI agent (Saturday) on a VPS, see the [AI VPS Setup Guide](https://github.com/nhprince/server-setup-guide).

## Structure

```
skills/
├── framework/           # Framework-level skills (for Saturday)
│   ├── scaffold-project.md
│   ├── configure-cloudflare.md
│   ├── configure-vps.md
│   ├── add-auth.md
│   └── add-database.md
├── project-types/       # Project-type build skills
│   ├── build-blog.md
│   ├── build-saas.md
│   ├── build-portfolio.md
│   ├── build-api.md
│   ├── build-ecommerce.md
│   └── build-landing.md
├── frontends/           # Frontend framework skills
│   ├── astro.md
│   ├── sveltekit.md
│   └── static-html.md
├── backends/            # Backend runtime skills
│   ├── hono-workers.md
│   ├── python-vps.md
│   └── php-vps.md
├── auth/                # Auth provider skills
│   ├── clerk.md
│   ├── authjs.md
│   └── lucia.md
├── databases/           # Database adapter skills
│   ├── d1.md
│   ├── postgres-vps.md
│   ├── supabase.md
│   └── planetscale.md
├── modules/             # Feature module skills
│   ├── cms.md
│   ├── stripe-payments.md
│   ├── email.md
│   ├── file-upload.md
│   └── analytics.md
├── deploy/              # Deployment skills
│   ├── cloudflare-pages.md
│   ├── cloudflare-workers.md
│   └── vps-ssh.md
└── testing/             # Testing skills
    ├── playwright-e2e.md
    └── vitest-unit.md
```

## Usage

When Prince says "build me a blog", Saturday:
1. Reads `skills/project-types/build-blog.md`
2. Follows the workflow: scaffold → configure → build → deploy → verify
3. Uses framework skills (scaffold-project, configure-cloudflare, etc.) as needed
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
