---
name: saturday-ui
description: "Browse, search, and install UI components from 21st.dev. Use when building frontend interfaces, creating landing pages, adding UI components, or when the user asks for UI design help."
---

# Saturday UI — 21st.dev Component Integration

Saturday Framework integrates with **21st.dev** — a community-driven React/Tailwind component marketplace with thousands of high-quality, copy-paste components.

## When to Use

- User asks to build a frontend, landing page, or UI
- User wants to add specific UI components (hero, navbar, features, etc.)
- User asks for design inspiration or component recommendations
- Creating a new project and user wants UI components included
- User wants to browse available UI components

## Commands

```bash
# Sync component cache (do this first)
saturday ui sync

# Browse interactively
saturday ui browse

# Search for components
saturday ui search "hero section"
saturday ui search "pricing cards"
saturday ui search "navbar"

# Get component details
saturday ui info hero-gradient

# Install a component
saturday ui add hero-gradient

# List installed components
saturday ui list

# Remove a component
saturday ui remove hero-gradient

# List categories
saturday ui categories
```

## Agent Flags (Always Use)

For non-interactive mode (agent automation):
```bash
saturday ui sync --yes
saturday ui add hero-gradient --yes
saturday ui search "hero" --json
saturday ui list --json
```

## Component Sources

- **`--source curated`** (default): Hand-picked, high-quality components tested with Saturday
- **`--source all`**: Full 21st.dev library — thousands of community components

```bash
# Search only curated components
saturday ui search "hero" --source curated

# Search full 21st.dev library
saturday ui search "hero" --source all
```

## Curated Components

The following curated components are included out of the box:

| Component | Slug | Tags | Description |
|---|---|---|---|
| Hero Gradient | `hero-gradient` | hero, landing, gradient, cta | Stunning gradient hero with CTA buttons |
| Hero Minimal | `hero-minimal` | hero, landing, minimal, typography | Clean minimal hero with dark mode |
| Features Grid | `features-grid` | features, grid, icons, hover | Responsive features grid with animations |
| Navbar Glass | `navbar-glass` | navbar, glassmorphism, mobile | Glassmorphism navbar with blur effect |
| Footer Modern | `footer-modern` | footer, links, social, newsletter | Modern footer with multi-column layout |
| Testimonials | `testimonials-carousel` | testimonials, carousel, ratings | Animated testimonials carousel |
| Pricing Cards | `pricing-cards` | pricing, cards, toggle, saas | Pricing cards with monthly/yearly toggle |
| CTA Bold | `cta-bold` | cta, gradient, animated | Bold call-to-action section |
| Auth Forms | `auth-forms` | auth, forms, login, register | Login/register forms with validation |

## Scaffold Integration

When creating new projects, recommend UI components based on project type:

- **landing**: hero-gradient, features-grid, testimonials-carousel, cta-bold, footer-modern
- **saas**: hero-minimal, features-grid, pricing-cards, auth-forms, navbar-glass
- **portfolio**: hero-minimal, navbar-glass, footer-modern, cta-bold
- **blog**: navbar-glass, footer-modern, auth-forms
- **ecommerce**: hero-gradient, features-grid, pricing-cards, auth-forms, navbar-glass, footer-modern

## Workflow

### For New Projects
1. Create project: `saturday new landing my-app`
2. Sync UI cache: `cd my-app && saturday ui sync`
3. Install recommended components: `saturday ui add hero-gradient --yes`
4. Components are installed to `src/components/ui/`

### For Existing Projects
1. Navigate to project directory
2. Search for needed components: `saturday ui search "navbar"`
3. Review component info: `saturday ui info navbar-glass`
4. Install: `saturday ui add navbar-glass --yes`

### For Agent-Driven UI Building
1. Understand the project type and design requirements
2. Search for relevant components: `saturday ui search <query> --json`
3. Evaluate components based on tags, dependencies, downloads
4. Install best-fit components: `saturday ui add <slug> --yes`
5. Components are ready to import: `import HeroGradient from "@/components/ui/hero-gradient"`

## Component Structure

Each installed component includes:
- `src/components/ui/<slug>.tsx` — Component code
- `src/components/ui/<slug>.meta.json` — Full metadata (author, tags, deps, etc.)
- `src/components/ui/<slug>.css` — Optional global CSS
- `src/components/ui/<slug>.tailwind.config.js` — Optional Tailwind config extension

## MCP Server

21st.dev provides an MCP server for agent-native component browsing:

```bash
# MCP config is at ~/.saturday/mcp-config.json
# Server: @21st-dev/magic
# Start: npx @21st-dev/magic
```

The MCP server allows direct component search and installation from AI agents without CLI.

## Design Philosophy

Saturday is **design-agnostic**. Components from 21st.dev can be:
- Used as-is for rapid prototyping
- Modified to match any design system
- Combined to create unique layouts
- Used as reference/inspiration for custom builds

No auto-adaptation is applied — the agent has full freedom to use components as building blocks for any design style.

## Offline Cache

Component metadata is cached locally at `~/.saturday/ui-cache/components.json`. Run `saturday ui sync` to refresh. The cache includes:
- Component names, descriptions, tags
- Author information
- Download counts
- Dependency information
- Code/demo/preview URLs
