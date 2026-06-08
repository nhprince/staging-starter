"use client";

import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════
   SATURDAY LANDING — PREMIUM RESPONSIVE
   Mobile-first, fluid, dual-layout, touch-optimized
   ═══════════════════════════════════════════════════════════════ */

// ─── DATA ────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
  { label: "Blog", href: "#blog" },
];

const FEATURES = [
  { icon: "⚡", title: "Edge Deployed", desc: "Your site runs at 300+ locations worldwide via Cloudflare's global network." },
  { icon: "🤖", title: "AI Agent Driven", desc: "Built for AI agents. One command scaffolds, configures, and deploys." },
  { icon: "🎨", title: "21st.dev Components", desc: "Browse and install thousands of React/Tailwind components." },
  { icon: "🔒", title: "Secure by Default", desc: "HTTPS enforced, security headers automatic, encrypted connections." },
  { icon: "💰", title: "100% Free", desc: "Cloudflare free tier handles everything. No credit card needed." },
  { icon: "🔄", title: "Auto Deploy", desc: "Push to main → GitHub Actions builds → deploys to Cloudflare." },
];

const STATS = [
  { value: "300+", label: "Edge Locations" },
  { value: "<50ms", label: "Response Time" },
  { value: "99.9%", label: "Uptime" },
  { value: "100%", label: "Free" },
];

const TESTIMONIALS = [
  { name: "Sarah Johnson", role: "CTO", company: "TechCorp", content: "Saturday completely transformed how we build products. The developer experience is unmatched." },
  { name: "Michael Chen", role: "Lead Developer", content: "I've tried every framework out there. This one just works. Clean, fast, and incredibly intuitive." },
  { name: "Emily Rodriguez", role: "Product Manager", company: "DesignStudio", content: "Our team shipped 3x faster after switching. The component library alone saved us months." },
];

const PLANS = [
  { name: "Starter", desc: "Perfect for side projects.", price: { monthly: 0, yearly: 0 }, features: ["Up to 3 projects", "Cloudflare free tier", "Community support", "Basic analytics", "1GB storage"], cta: "Start Free" },
  { name: "Pro", desc: "For serious developers.", price: { monthly: 19, yearly: 190 }, features: ["Unlimited projects", "Priority deployment", "Email support", "Advanced analytics", "10GB storage", "Custom domains"], highlighted: true, cta: "Start Pro Trial" },
  { name: "Enterprise", desc: "For organizations.", price: { monthly: 49, yearly: 490 }, features: ["Everything in Pro", "Dedicated support", "SLA guarantee", "Unlimited storage", "SSO & SAML", "Audit logs"], cta: "Contact Sales" },
];

const FOOTER_COLS = [
  { title: "Product", links: [{ l: "Features", h: "#features" }, { l: "Pricing", h: "#pricing" }, { l: "Docs", h: "#" }] },
  { title: "Resources", links: [{ l: "GitHub", h: "https://github.com/nhprince/saturday" }, { l: "Components", h: "#" }, { l: "Templates", h: "#" }] },
  { title: "Legal", links: [{ l: "Privacy", h: "#" }, { l: "Terms", h: "#" }, { l: "License", h: "#" }] },
];

// ─── NAVBAR ──────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <div className="container-fluid">
          <div className="navbar-inner">
            <a href="/" className="flex items-center gap-2 no-underline">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[var(--gradient-main)] flex items-center justify-center text-white text-xs md:text-sm font-bold flex-shrink-0">✦</div>
              <span className="text-base md:text-xl font-bold text-white tracking-tight">Saturday</span>
            </a>

            <div className="nav-links">
              {NAV_LINKS.map(l => (
                <a key={l.label} href={l.href}>{l.label}</a>
              ))}
            </div>

            <div className="nav-actions">
              <a href="#get-started" className="btn-primary text-xs md:text-sm">Get Started</a>
            </div>

            <button onClick={() => setDrawerOpen(true)} className="nav-mobile-btn p-2 text-gray-400 hover:text-white" aria-label="Open menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${drawerOpen ? "open" : ""}`} role="dialog" aria-modal="true">
        <div className="mobile-drawer-backdrop" onClick={() => setDrawerOpen(false)} />
        <div className="mobile-drawer-panel">
          <div className="p-5 pt-14">
            <button onClick={() => setDrawerOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white" aria-label="Close menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} onClick={() => setDrawerOpen(false)}>{l.label}</a>
            ))}
            <a href="#get-started" onClick={() => setDrawerOpen(false)} className="btn-primary w-full mt-6">Get Started</a>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── HERO ────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="hero-section">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-cyan-900/20" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-60 md:w-96 h-60 md:h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-52 md:w-80 h-52 md:h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
      <div className="relative z-10 container-fluid text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 md:px-4 md:py-2 mb-6 md:mb-8 animate-fade-in-up">
          <span className="text-sm md:text-base">✨</span>
          <span className="text-xs md:text-sm text-gray-300">100% Free · AI-Powered · Open Source</span>
        </div>
        <h1 className="heading-hero mb-4 md:mb-6 animate-fade-in-up stagger-1">
          <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">Build Web</span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Without Limits</span>
        </h1>
        <p className="heading-sub max-w-2xl mx-auto mb-8 md:mb-10 animate-fade-in-up stagger-2">
          The open-source framework for AI-driven web development. Scaffold, build, and deploy — all for free on Cloudflare's global edge.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 animate-fade-in-up stagger-3">
          <a href="#get-started" className="btn-primary w-full sm:w-auto">
            Start Building <span className="ml-1">→</span>
          </a>
          <a href="https://github.com/nhprince/saturday" target="_blank" rel="noreferrer" className="btn-secondary w-full sm:w-auto">
            📦 GitHub
          </a>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
    </section>
  );
}

// ─── FEATURES ────────────────────────────────────────────────────

function Features() {
  return (
    <section id="features" className="section-padding">
      <div className="container-section">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="heading-section mb-3 md:mb-4 text-white text-center-mobile">Everything You Need</h2>
          <p className="heading-sub max-w-2xl mx-auto text-center-mobile">A complete toolkit for modern web development. No compromises.</p>
        </div>

        {/* Desktop Grid */}
        <div className="desktop-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="group p-5 md:p-6 lg:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1 hover:z-20" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-2xl md:text-3xl mb-3 md:mb-4">{f.icon}</div>
              <h3 className="text-base md:text-lg font-semibold mb-2 text-white">{f.title}</h3>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Mobile Scroll */}
        <div className="mobile-scroll scroll-row md:hidden">
          {FEATURES.map((f, i) => (
            <div key={i} className="group p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex-shrink-0" style={{ width: "72vw", maxWidth: "20rem" }}>
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-base font-semibold mb-2 text-white">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── STATS ───────────────────────────────────────────────────────

function Stats() {
  return (
    <section className="section-padding">
      <div className="container-section">
        <div className="glass-card p-6 md:p-8 lg:p-12 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {STATS.map((s, i) => (
              <div key={i}>
                <div className="text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-1">{s.value}</div>
                <div className="text-xs md:text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ────────────────────────────────────────────────

function Testimonials() {
  return (
    <section className="section-padding">
      <div className="container-section">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="heading-section mb-3 md:mb-4 text-white text-center-mobile">Loved by Developers</h2>
          <p className="heading-sub max-w-2xl mx-auto text-center-mobile">See what others are building with Saturday.</p>
        </div>

        {/* Desktop Grid */}
        <div className="desktop-grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="p-5 md:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="text-xl md:text-2xl text-indigo-500/30 mb-3 md:mb-4">❝</div>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-4 md:mb-6 italic">&ldquo;{t.content}&rdquo;</p>
              <div className="flex items-center gap-1 mb-2 md:mb-3">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className={`text-xs md:text-sm ${j < 5 ? "text-yellow-400" : "text-gray-700"}`}>★</span>
                ))}
              </div>
              <p className="font-semibold text-white text-sm">{t.name}</p>
              <p className="text-xs text-gray-500">{t.role}{t.company ? ` at ${t.company}` : ""}</p>
            </div>
          ))}
        </div>

        {/* Mobile Scroll */}
        <div className="mobile-scroll scroll-row md:hidden">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex-shrink-0" style={{ width: "78vw", maxWidth: "22rem" }}>
              <div className="text-xl mb-3">❝</div>
              <p className="text-sm text-gray-300 leading-relaxed mb-4 italic">&ldquo;{t.content}&rdquo;</p>
              <p className="font-semibold text-white text-sm">{t.name}</p>
              <p className="text-xs text-gray-500">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PRICING ─────────────────────────────────────────────────────

function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="section-padding">
      <div className="container-section">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="heading-section mb-3 md:mb-4 text-white text-center-mobile">Simple, Transparent Pricing</h2>
          <p className="heading-sub max-w-2xl mx-auto mb-6 md:mb-8 text-center-mobile">No hidden fees. Start free, scale when you're ready.</p>
          <div className="inline-flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-full">
            <button onClick={() => setYearly(false)} className={`px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-medium rounded-full transition-all ${!yearly ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}>Monthly</button>
            <button onClick={() => setYearly(true)} className={`px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-medium rounded-full transition-all ${yearly ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}>
              Yearly <span className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full font-semibold ml-1">-17%</span>
            </button>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="desktop-grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`relative p-5 md:p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${plan.highlighted ? "bg-gradient-to-b from-indigo-500/10 to-purple-500/5 border-indigo-500/30 shadow-lg shadow-indigo-500/10" : "bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12]"}`}>
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 md:px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] md:text-xs font-semibold rounded-full">⚡ Most Popular</div>
              )}
              <h3 className="text-lg md:text-xl font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6">{plan.desc}</p>
              <div className="mb-5 md:mb-8">
                <span className="text-3xl md:text-4xl font-black text-white">${yearly ? plan.price.yearly : plan.price.monthly}</span>
                <span className="text-gray-500 text-xs md:text-sm">{plan.price.monthly > 0 ? (yearly ? "/year" : "/month") : " forever"}</span>
              </div>
              <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 md:gap-3 text-xs md:text-sm text-gray-400">
                    <span className="text-indigo-400 mt-0.5 flex-shrink-0">✓</span>{f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2.5 md:py-3 rounded-xl font-semibold text-xs md:text-sm transition-all duration-300 hover:-translate-y-0.5 ${plan.highlighted ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:shadow-indigo-500/25" : "bg-white/5 border border-white/10 text-white hover:bg-white/10"}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Mobile Scroll */}
        <div className="mobile-scroll scroll-row md:hidden">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`relative p-5 rounded-2xl border flex-shrink-0 ${plan.highlighted ? "bg-gradient-to-b from-indigo-500/10 to-purple-500/5 border-indigo-500/30" : "bg-white/[0.03] border-white/[0.06]"}`} style={{ width: "78vw", maxWidth: "22rem" }}>
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-semibold rounded-full">⚡ Most Popular</div>
              )}
              <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-xs text-gray-500 mb-4">{plan.desc}</p>
              <div className="mb-5">
                <span className="text-3xl font-black text-white">${yearly ? plan.price.yearly : plan.price.monthly}</span>
                <span className="text-gray-500 text-xs">{plan.price.monthly > 0 ? (yearly ? "/year" : "/month") : " forever"}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-gray-400">
                    <span className="text-indigo-400 mt-0.5 flex-shrink-0">✓</span>{f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2.5 rounded-xl font-semibold text-xs ${plan.highlighted ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" : "bg-white/5 border border-white/10 text-white"}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────

function CTA() {
  return (
    <section id="get-started" className="section-padding">
      <div className="container-section">
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-cyan-600/10" />
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-60 md:w-96 h-60 md:h-96 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-52 md:w-80 h-52 md:h-80 bg-purple-500/10 rounded-full blur-3xl" />
          </div>
          <div className="absolute inset-0 border border-white/[0.08] rounded-2xl md:rounded-3xl" />
          <div className="relative z-10 px-5 py-10 md:px-16 md:py-20 lg:py-24 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/10 border border-white/10 rounded-full mb-6 md:mb-8">
              <span className="text-sm md:text-base">⚡</span>
              <span className="text-xs md:text-sm text-gray-300">100% Free Forever</span>
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 md:mb-6 text-white leading-tight">Ready to Build Something Amazing?</h2>
            <p className="text-sm md:text-lg text-gray-400 max-w-2xl mx-auto mb-6 md:mb-10 leading-relaxed">Join thousands of developers building the future. Start for free, no credit card required.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
              <a href="https://github.com/nhprince/saturday" target="_blank" rel="noreferrer" className="btn-primary w-full sm:w-auto">
                Get Started Free <span className="ml-1">→</span>
              </a>
              <a href="https://github.com/nhprince/saturday" className="btn-secondary w-full sm:w-auto no-underline">
                View Documentation <span className="ml-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-white/[0.01]">
      <div className="container-section">
        <div className="footer-grid py-8 md:py-16">
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3 flex items-center gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[var(--gradient-main)] flex items-center justify-center text-white text-xs md:text-sm font-bold">✦</div>
              Saturday
            </h3>
            <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6 max-w-xs leading-relaxed">Build something amazing. 100% free, fully automated, AI-powered.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter your email" className="flex-1 min-w-0 px-3 py-2 md:px-4 md:py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs md:text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors" />
              <button className="btn-primary text-xs md:text-sm flex-shrink-0">Subscribe</button>
            </div>
          </div>
          {FOOTER_COLS.map(col => (
            <div key={col.title}>
              <h4 className="text-[10px] md:text-sm font-semibold text-white mb-3 md:mb-4 uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-2 md:space-y-3">
                {col.links.map(link => (
                  <li key={link.l}><a href={link.h} className="text-xs md:text-sm text-gray-500 hover:text-white transition-colors no-underline">{link.l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="py-6 md:py-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          <p className="text-[10px] md:text-sm text-gray-600">© {new Date().getFullYear()} Saturday Framework. All rights reserved.</p>
          <div className="flex items-center gap-3 md:gap-4">
            {["GitHub", "Twitter", "LinkedIn"].map(name => (
              <a key={name} href="#" className="text-[10px] md:text-xs text-gray-600 hover:text-white transition-colors no-underline">{name}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <div className="bg-mesh" />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <Stats />
        <Testimonials />
        <Pricing />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
