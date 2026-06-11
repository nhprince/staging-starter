# SATURDAY MASTER PLAN — NH Prince Prodhan
> Created: June 11, 2026
> Authorized by: NH Prince Prodhan
> Repo: nhprince/saturday

---

## 🎯 VISION

Build a **world-class portfolio ecosystem** for NH Prince Prodhan — a 17-year-old self-taught full-stack developer from Dhaka, Bangladesh. The portfolio should reflect his creative/artistic personality, showcase his 10+ real projects, and serve as both a freelance client magnet and a recruiter magnet.

**Key Principle:** Dark Cinematic / Editorial Brutalist aesthetic. NOT generic. NOT brittanychiang.com. Artistic, creative, bold.

---

## 🎨 DESIGN SYSTEM (Finalized from Feedback)

### Theme: Dark Cinematic / Editorial Brutalist Crossover

**Color Palette:**
```
--color-bg:          #0A0A0A (absolute black)
--color-bg-2:        #111111 (deep charcoal)
--color-surface:     #1A1A1A (card background)
--color-border:      #222222 (subtle borders)
--color-text:        #FFFFFF (stark white)
--color-text-muted:  #888888 (metadata)
--color-accent:      #E50914 (crimson/red accent)
--color-accent-glow: rgba(229, 9, 20, 0.15) (radial glow)
```

**Typography:**
```
Display:  Syne (ultra-bold, condensed, massive — fills viewport width)
Body:     Geist or DM Sans (clean, modern)
Mono:     JetBrains Mono (tiny 10-12px, uppercase, letter-spacing 0.2-0.3em)

--text-xs:   clamp(0.625rem, 0.8vw, 0.75rem)   /* 10-12px */
--text-sm:   clamp(0.75rem, 1vw, 0.875rem)
--text-base: clamp(0.875rem, 1.2vw, 1rem)
--text-lg:   clamp(1rem, 1.5vw, 1.25rem)
--text-xl:   clamp(1.25rem, 2vw, 1.75rem)
--text-2xl:  clamp(1.5rem, 3vw, 2.5rem)
--text-3xl:  clamp(2rem, 4vw, 3.5rem)
--text-hero: clamp(3rem, 8vw, 10rem)  /* Massive display */
```

**Hero Section — "Z-Index Sandwich" 3D Layered Viewport:**
```
Layer 1 (z-index: 1): Background ambient crimson radial gradient glow
Layer 2 (z-index: 2): Massive display typography (name/title), fills viewport width
Layer 3 (z-index: 3): Transparent cutout portrait/project asset, overlaps text for depth
Layer 4 (z-index: 4): Fixed nav, floating UI pills, buttons, micro-metadata
```

**Motion Engine:**
```
- GSAP (GreenSock) for all scroll-driven animations
- Lenis Scroll for inertial smooth scroll
- Mouse-tracking parallax: Layer 1+2 move opposite to mouse, Layer 3 moves with mouse
- ScrollTrigger: Layer 2 and 3 move at different vertical speeds (data-speed modifiers)
- Text reveal masking: split-type + clip-path polygon animation on page load
- Framer Motion for component-level animations (Next.js integration)
- Only animate: opacity, transform (GPU-accelerated)
- Respect prefers-reduced-motion
```

**Responsive Strategy:**
```
All subdomains under nhprince.dpdns.org (free)
nhprince.me is paid — can expire, don't depend on it
Mobile-first, rem-based, clamp() for all font sizes
Breakpoints: 375, 640, 768, 1024, 1280, 1536, 1920, 2560, 3840px
Max container: max-w-[1600px] mx-auto
```

---

## 📋 COMPLETE PROJECT LIST

### Live Projects (to feature in portfolio):

| # | Project | Live URL | Repo | Type | Status |
|---|---------|----------|------|------|--------|
| 1 | **Lenden POS** | lenden.nhprince.dpdns.org | Lenden-POS | Full-stack SaaS | Needs Cloudflare migration |
| 2 | **MINIMALIST Gaming** | minimalist.stuckstudio.com | Minimalist-Gaming | Design tool | ✅ Live |
| 3 | **Stuck Studio** | stuckstudio.com | stuck-studio | Agency site | ✅ Live |
| 4 | **The Witches BD** | the-witches-bd.nhprince.dpdns.org (new) | The-Witches-BD | E-commerce | Needs Cloudflare deploy |
| 5 | **MH CreationX** | mhcreationx.top | MH-CreationX | Studio mgmt | ✅ Live |
| 6 | **GSSC Library** | gssclibrary.nhprince.dpdns.org (new) | GSSC-Library (private) | PHP backend | Needs VPS deploy |
| 7 | **GSSC Forum** | N/A (chat app, VPS can't handle) | GSSC-College-Forum | PHP chat | GitHub link only |
| 8 | **Saturday** | saturday-62d.pages.dev | saturday | AI framework | ✅ Live |
| 9 | **AI Landing** | ai-landing.nurulhprince18.workers.dev | ai-landing | AI art | ✅ Live |

---

## 🗂️ PHASE BREAKDOWN

### PHASE 0: PLAN & RESEARCH (Current)
- [x] Analyze all live projects
- [x] Analyze all GitHub repos
- [x] Clone Lenden-POS, GSSC-Library, The-Witches-BD
- [x] Define design system from feedback
- [x] Write this plan document
- [ ] Push plan to GitHub repo

### PHASE 1: GSSC-Library — VPS Deploy + Auto-Pipeline
**Goal:** Deploy PHP backend on VPS, auto-deploy from GitHub, subdomain: gssclibrary.nhprince.dpdns.org

Steps:
1. Analyze GSSC-Library repo structure
2. Set up Nginx config for subdomain
3. Configure PHP + MySQL on VPS
4. Set up GitHub Actions webhook for auto-deploy
5. Make production-ready (edit PHP configs, remove dev artifacts)
6. Test all API endpoints
7. **TEST:** Automated — curl all endpoints, verify responses

### PHASE 2: The-Witches-BD — Cloudflare Pages Deploy
**Goal:** Deploy e-commerce site on Cloudflare Pages, subdomain: the-witches-bd.nhprince.dpdns.org

Steps:
1. Analyze The-Witches-BD repo (Next.js app)
2. Check for Firebase dependencies — replace with Supabase if needed
3. Configure for Cloudflare Pages (static export or Pages Functions)
4. Set up Cloudflare Pages project
5. Configure custom subdomain
6. Deploy and test
7. **TEST:** Automated — verify build, check all pages render

### PHASE 3: Lenden POS — Cloudflare Migration (BIGGEST WORK)
**Goal:** Migrate from cPanel (MySQL + Express) to Cloudflare (Supabase + Workers + Pages)

Steps:
1. Create Supabase project
2. Migrate MySQL schema → PostgreSQL
3. Rewrite Express API routes as Cloudflare Workers (Hono framework)
4. Replace Multer uploads → Cloudflare R2 presigned URLs
5. Replace Nodemailer → Cloudflare Email Routing (or Resend fallback)
6. Replace node-cron → Cloudflare Cron Triggers
7. Replace custom JWT auth → Supabase Auth
8. Update client VITE_API_URL to Workers endpoint
9. Deploy client as Cloudflare Pages static site
10. **TEST:** Automated — full API test suite, auth flow, CRUD operations

### PHASE 4: Portfolio v2 — Design System + Scaffold
**Goal:** Create nhprince/portfolio-v2 with the dark cinematic design system

Steps:
1. Create GitHub repo nhprince/portfolio-v2
2. Scaffold Next.js 14 + TypeScript + Tailwind v3
3. Install GSAP + Lenis + Framer Motion + Split-Type
4. Implement design system (colors, typography, spacing)
5. Build Hero section (Z-index sandwich, 3D layers, parallax)
6. Build all sections (About, Projects, Skills, Experience, Services, Blog, Contact)
7. Set up Keystatic CMS
8. **TEST:** Manual — visual review at all breakpoints, animation smoothness

### PHASE 5: Blog Content
**Goal:** Write 3 seed blog posts in Prince's voice

Posts:
1. "How I Built a Working POS System at 16"
2. "What No-One Tells You About Glassmorphism"
3. "Building Saturday: The AI Agent That Ships My Projects"

**TEST:** Manual — read through, check formatting, MDX renders correctly

### PHASE 6: Demo Chatbot
**Goal:** Create a demo chatbot with responsive layout, OpenRouter free model, fallback to Cloudflare Workers AI

Steps:
1. Create simple chat UI (responsive, dark theme matching portfolio)
2. Integrate OpenRouter API (free model)
3. Add Cloudflare Workers AI fallback
4. Deploy as Cloudflare Worker or Pages Function
5. **TEST:** Automated — send messages, verify responses, test fallback

### PHASE 7: Keystatic CMS Setup
**Goal:** Content management for portfolio (blog, projects, about, skills)

Steps:
1. Install @keystatic/core + @keystatic/next
2. Define schema (blog, projects, about, skills, experience, services, site config)
3. Set up GitHub OAuth for admin auth
4. Configure Cloudflare R2 for image uploads
5. Create admin panel at /keystatic
6. **TEST:** Manual — create/edit content, verify auto-deploy

### PHASE 8: Domain Binding + Final Verification
**Goal:** Bind all subdomains, final end-to-end testing

Steps:
1. Bind gssclibrary.nhprince.dpdns.org
2. Bind the-witches-bd.nhprince.dpdns.org
3. Bind lenden.nhprince.dpdns.org
4. Bind portfolio.nhprince.dpdns.org (or nhprince.me if active)
5. Full end-to-end testing of all sites
6. **TEST:** Automated + Manual — all sites live, all forms work, all links valid

---

## 🏗️ INFRASTRUCTURE

### Subdomain Map (all under nhprince.dpdns.org):
```
gssclibrary.nhprince.dpdns.org  → VPS (PHP + MySQL)
the-witches-bd.nhprince.dpdns.org → Cloudflare Pages
lenden.nhprince.dpdns.org       → Cloudflare Workers + Pages + Supabase
portfolio.nhprince.dpdns.org    → Cloudflare Pages (or nhprince.me)
chatbot.nhprince.dpdns.org      → Cloudflare Workers
```

### Email:
```
contact@nhprince.me → Cloudflare Email Routing (configured)
Fallback: Resend account (if CF routing doesn't work)
```

### Secrets Management:
```
All secrets in GitHub Secrets + Cloudflare Environment Variables
Never commit .env files
```

---

## ✅ TESTING STRATEGY

### Automated Tests (Backend/API):
- curl all API endpoints, verify HTTP status + JSON schema
- Auth flow: register → login → access protected route → logout
- CRUD: create → read → update → delete for each resource
- Form validation: submit invalid data, verify error responses
- Rate limiting: send 100+ requests, verify 429 response

### Manual Tests (Design/UX):
- Visual review at 375px, 768px, 1024px, 1280px, 1920px, 2560px, 3840px
- Animation smoothness (60fps target)
- Mouse parallax effect on desktop
- Scroll-driven reveals
- Text reveal masking on page load
- prefers-reduced-motion fallback
- Cross-browser: Chrome, Firefox, Safari

---

## 📌 RULES

1. No builds on VPS — all pnpm/npm builds on GitHub Actions
2. All subdomains under nhprince.dpdns.org (free)
3. Don't touch nhprince/portfolio-prince (old repo)
4. Don't break existing functionality when migrating Lenden
5. Each phase must pass tests before proceeding
6. Use sub-agents in parallel for faster development
7. Push all code to GitHub — everything is versioned
8. No placeholder text — real content only
