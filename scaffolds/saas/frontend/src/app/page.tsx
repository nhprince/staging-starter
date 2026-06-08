"use client";

import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════
   SAAS PLATFORM — PREMIUM RESPONSIVE
   ═══════════════════════════════════════════════════════════════ */

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
  { label: "Blog", href: "#blog" },
];

const FEATURES = [
  { icon: "📊", title: "Analytics", desc: "Real-time dashboards with actionable insights. Track every metric that matters." },
  { icon: "🔐", title: "Security", desc: "Enterprise-grade security with SSO, 2FA, and audit logs built in." },
  { icon: "⚡", title: "Performance", desc: "Sub-100ms response times globally. Auto-scaling infrastructure." },
  { icon: "🔌", title: "Integrations", desc: "Connect with 200+ tools. REST API, webhooks, and SDKs for every language." },
  { icon: "👥", title: "Team Management", desc: "Role-based access control. Invite unlimited team members." },
  { icon: "📱", title: "Mobile Ready", desc: "Native mobile apps for iOS and Android. Offline support included." },
];

const PLANS = [
  { name: "Starter", desc: "For small teams.", price: { monthly: 0, yearly: 0 }, features: ["Up to 5 users", "Basic analytics", "1GB storage", "Community support"], cta: "Start Free" },
  { name: "Pro", desc: "For growing businesses.", price: { monthly: 29, yearly: 290 }, features: ["Up to 50 users", "Advanced analytics", "50GB storage", "Priority support", "Custom domains", "API access"], highlighted: true, cta: "Start Trial" },
  { name: "Enterprise", desc: "For large organizations.", price: { monthly: 99, yearly: 990 }, features: ["Unlimited users", "Custom analytics", "Unlimited storage", "Dedicated support", "SLA guarantee", "SSO & SAML"], cta: "Contact Sales" },
];

const STATS = [
  { value: "10K+", label: "Active Users" },
  { value: "99.9%", label: "Uptime" },
  { value: "<50ms", label: "Latency" },
  { value: "24/7", label: "Support" },
];

// ─── NAVBAR ──────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`} style={{ background: scrolled ? undefined : "transparent" }}>
        <div className="container-fluid">
          <div className="flex items-center justify-between h-14 md:h-16">
            <a href="#" className="flex items-center gap-2 no-underline">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[var(--gradient-main)] flex items-center justify-center text-white text-xs md:text-sm font-bold">⚡</div>
              <span className="text-base md:text-lg font-bold text-white">SaaS</span>
            </a>

            <div className="nav-links">
              {NAV_LINKS.map(l => (<a key={l.label} href={l.href}>{l.label}</a>))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <a href="#" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors no-underline">Login</a>
              <a href="#" className="btn-primary text-xs">Get Started</a>
            </div>

            <button onClick={() => setDrawerOpen(true)} className="nav-mobile-btn p-2 text-[var(--text-secondary)] hover:text-white" aria-label="Menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-drawer ${drawerOpen ? "open" : ""}`} role="dialog" aria-modal="true">
        <div className="mobile-drawer-backdrop" onClick={() => setDrawerOpen(false)} />
        <div className="mobile-drawer-panel">
          <div className="p-5 pt-14">
            <button onClick={() => setDrawerOpen(false)} className="absolute top-4 right-4 p-2 text-[var(--text-secondary)]" aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            {NAV_LINKS.map(l => (<a key={l.label} href={l.href} onClick={() => setDrawerOpen(false)}>{l.label}</a>))}
            <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] space-y-3">
              <a href="#" className="block text-[var(--text-secondary)] text-sm">Login</a>
              <a href="#" className="btn-primary w-full">Get Started</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── HERO ────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden pt-14 md:pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-cyan-900/10" />
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-48 md:w-72 h-48 md:h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-40 md:w-64 h-40 md:h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
      <div className="relative z-10 container-fluid text-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 md:px-4 md:py-2 mb-4 md:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] md:text-xs text-gray-300">All systems operational</span>
          </div>
        </div>
        <div className="animate-fade-in-up stagger-1">
          <h1 className="heading-xl mb-3 md:mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Build Faster.</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Scale Smarter.</span>
          </h1>
        </div>
        <div className="animate-fade-in-up stagger-2">
          <p className="text-body max-w-xl mx-auto mb-6 md:mb-10">The all-in-one platform for modern teams. Ship products faster with powerful analytics, security, and automation.</p>
        </div>
        <div className="animate-fade-in-up stagger-3">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#" className="btn-primary w-full sm:w-auto">Start Free Trial</a>
            <a href="#features" className="btn-primary w-full sm:w-auto" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}>See Features</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── STATS ───────────────────────────────────────────────────────

function Stats() {
  return (
    <section className="section-padding">
      <div className="container-fluid">
        <div className="glass-card p-5 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-1">{s.value}</div>
                <div className="text-[10px] md:text-xs text-[var(--text-muted)]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FEATURES ────────────────────────────────────────────────────

function Features() {
  return (
    <section id="features" className="section-padding bg-[var(--bg-secondary)]">
      <div className="container-fluid">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="heading-lg mb-2 md:mb-3 text-white">Everything You Need</h2>
          <p className="text-body max-w-lg mx-auto">Powerful features to help you build, deploy, and scale.</p>
        </div>

        <div className="desktop-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="glass-card p-4 md:p-6 group" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="text-2xl md:text-3xl mb-3 md:mb-4">{f.icon}</div>
              <h3 className="font-semibold text-sm md:text-base text-white mb-1.5 md:mb-2">{f.title}</h3>
              <p className="text-body text-xs md:text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mobile-scroll scroll-row md:hidden">
          {FEATURES.map((f, i) => (
            <div key={i} className="glass-card p-4 flex-shrink-0" style={{ width: "72vw", maxWidth: "20rem" }}>
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-sm text-white mb-1.5">{f.title}</h3>
              <p className="text-body text-xs leading-relaxed">{f.desc}</p>
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
      <div className="container-fluid">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="heading-lg mb-2 md:mb-3 text-white">Simple Pricing</h2>
          <p className="text-body max-w-lg mx-auto mb-4 md:mb-6">Start free, scale as you grow. No hidden fees.</p>
          <div className="inline-flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-full">
            <button onClick={() => setYearly(false)} className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-full transition-all ${!yearly ? "bg-white text-black" : "text-gray-400"}`}>Monthly</button>
            <button onClick={() => setYearly(true)} className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-full transition-all ${yearly ? "bg-white text-black" : "text-gray-400"}`}>
              Yearly <span className="text-[9px] md:text-xs px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded-full font-semibold ml-1">-17%</span>
            </button>
          </div>
        </div>

        <div className="desktop-grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6 max-w-4xl mx-auto">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`relative p-5 md:p-6 lg:p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${plan.highlighted ? "bg-gradient-to-b from-indigo-500/10 to-purple-500/5 border-indigo-500/30" : "bg-white/[0.03] border-white/[0.06]"}`}>
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] md:text-xs font-semibold rounded-full">⚡ Most Popular</div>
              )}
              <h3 className="text-base md:text-lg font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-xs text-gray-500 mb-4 md:mb-6">{plan.desc}</p>
              <div className="mb-5 md:mb-8">
                <span className="text-2xl md:text-3xl font-black text-white">${yearly ? plan.price.yearly : plan.price.monthly}</span>
                <span className="text-gray-500 text-xs md:text-sm">{plan.price.monthly > 0 ? (yearly ? "/year" : "/month") : " forever"}</span>
              </div>
              <ul className="space-y-2 mb-6 md:mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs md:text-sm text-gray-400">
                    <span className="text-indigo-400 mt-0.5 flex-shrink-0">✓</span>{f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2.5 md:py-3 rounded-xl font-semibold text-xs md:text-sm transition-all ${plan.highlighted ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" : "bg-white/5 border border-white/10 text-white hover:bg-white/10"}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mobile-scroll scroll-row md:hidden">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`relative p-5 rounded-2xl border flex-shrink-0 ${plan.highlighted ? "bg-gradient-to-b from-indigo-500/10 to-purple-500/5 border-indigo-500/30" : "bg-white/[0.03] border-white/[0.06]"}`} style={{ width: "78vw", maxWidth: "22rem" }}>
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-semibold rounded-full">⚡ Most Popular</div>
              )}
              <h3 className="text-base font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-xs text-gray-500 mb-4">{plan.desc}</p>
              <div className="mb-5">
                <span className="text-2xl font-black text-white">${yearly ? plan.price.yearly : plan.price.monthly}</span>
                <span className="text-gray-500 text-xs">{plan.price.monthly > 0 ? (yearly ? "/year" : "/month") : " forever"}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-gray-400"><span className="text-indigo-400 mt-0.5 flex-shrink-0">✓</span>{f}</li>
                ))}
              </ul>
              <button className={`w-full py-2.5 rounded-xl font-semibold text-xs ${plan.highlighted ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" : "bg-white/5 border border-white/10 text-white"}`}>{plan.cta}</button>
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
    <section className="section-padding bg-[var(--bg-secondary)]">
      <div className="container-fluid">
        <div className="glass-card p-6 md:p-10 lg:p-14 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">Ready to Get Started?</h2>
          <p className="text-sm md:text-base text-gray-400 max-w-lg mx-auto mb-6 md:mb-8">Join thousands of teams already using our platform.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#" className="btn-primary w-full sm:w-auto">Start Free Trial</a>
            <a href="#" className="btn-primary w-full sm:w-auto" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}>Talk to Sales</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] py-8 md:py-12">
      <div className="container-fluid">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          <div className="col-span-2 md:col-span-1">
            <span className="text-lg font-bold text-white">SaaS</span>
            <p className="text-xs text-[var(--text-muted)] mt-2 max-w-xs">The all-in-one platform for modern teams.</p>
          </div>
          {[
            { title: "Product", links: ["Features", "Pricing", "Docs", "Changelog"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-[10px] md:text-xs font-semibold text-white mb-2 md:mb-3 uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-1.5 md:space-y-2">
                {col.links.map(l => (<li key={l}><a href="#" className="text-xs text-[var(--text-muted)] hover:text-white transition-colors no-underline">{l}</a></li>))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--border-subtle)] pt-4 md:pt-6 text-center">
          <p className="text-[10px] md:text-xs text-[var(--text-muted)]">© {new Date().getFullYear()} SaaS Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <div className="bg-mesh" />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Stats />
        <Features />
        <Pricing />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
