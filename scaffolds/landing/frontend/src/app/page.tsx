"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-white/[0.06]" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between h-16 md:h-20">
        <a href="/" className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--gradient-main)] flex items-center justify-center text-white text-sm font-bold">✦</div>
          Saturday
        </a>
        <div className="hidden md:flex items-center gap-8">
          {["Features", "Pricing", "Docs", "Blog"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-gray-400 hover:text-white transition-colors">{l}</a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <a href="#get-started" className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all">Get Started</a>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-400 hover:text-white text-xl">
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-[var(--bg-primary)]/95 backdrop-blur-xl border-t border-white/[0.06] p-6 space-y-4">
          {["Features", "Pricing", "Docs", "Blog"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="block text-gray-300 hover:text-white">{l}</a>
          ))}
          <a href="#get-started" onClick={() => setMobileOpen(false)} className="block mt-4 px-6 py-2.5 text-center text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">Get Started</a>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-cyan-900/20" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
          <span className="text-indigo-400">✨</span>
          <span className="text-sm text-gray-300">100% Free · AI-Powered · Open Source</span>
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[1.1]">
          <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">Build Web</span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Without Limits</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          The open-source framework for AI-driven web development. Scaffold, build, and deploy — all for free on Cloudflare&apos;s global edge.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#get-started" className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_100%] text-white font-semibold rounded-xl transition-all duration-300 hover:bg-[position:100%_0] hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5">
            Start Building <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a href="https://github.com/nhprince/saturday" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/5 border border-white/10 text-white font-semibold rounded-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5">
            📦 GitHub
          </a>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: "⚡", title: "Edge Deployed", desc: "Your site runs at 300+ locations worldwide via Cloudflare's global network. Sub-50ms response times." },
  { icon: "🤖", title: "AI Agent Driven", desc: "Built for AI agents. One command scaffolds, configures, and deploys. Fully automated with Hermes." },
  { icon: "🎨", title: "21st.dev Components", desc: "Browse and install thousands of React/Tailwind components. Curated registry + full library." },
  { icon: "🔒", title: "Secure by Default", desc: "HTTPS enforced, security headers automatic, D1 database with encrypted connections." },
  { icon: "💰", title: "100% Free", desc: "Cloudflare free tier handles everything. No credit card needed. No hidden costs." },
  { icon: "🔄", title: "Auto Deploy", desc: "Push to main → GitHub Actions builds → deploys to Cloudflare. Zero manual steps." },
];

function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-4 md:px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Everything You Need</h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">A complete toolkit for modern web development. No compromises.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((f, i) => (
          <div key={i} className="group p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl mb-4">{f.icon}</div>
            <h3 className="text-lg font-semibold mb-2 text-white">{f.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function Stats() {
  return (
    <section className="max-w-5xl mx-auto px-4 md:px-6 py-16">
      <div className="glass-card p-8 md:p-12 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "300+", label: "Edge Locations" },
            { value: "<50ms", label: "Response Time" },
            { value: "99.9%", label: "Uptime" },
            { value: "100%", label: "Free" },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  { name: "Sarah Johnson", role: "CTO", company: "TechCorp", content: "Saturday completely transformed how we build products. The developer experience is unmatched.", rating: 5 },
  { name: "Michael Chen", role: "Lead Developer", content: "I've tried every framework out there. This one just works. Clean, fast, and incredibly intuitive.", rating: 5 },
  { name: "Emily Rodriguez", role: "Product Manager", company: "DesignStudio", content: "Our team shipped 3x faster after switching. The component library alone saved us months.", rating: 5 },
];

function Testimonials() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Loved by Developers</h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">See what others are building with Saturday.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="text-2xl text-indigo-500/30 mb-4">❝</div>
            <p className="text-gray-300 leading-relaxed mb-6 italic">&ldquo;{t.content}&rdquo;</p>
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <span key={j} className={`text-sm ${j < t.rating ? "text-yellow-400" : "text-gray-700"}`}>★</span>
              ))}
            </div>
            <p className="font-semibold text-white text-sm">{t.name}</p>
            <p className="text-xs text-gray-500">{t.role}{t.company ? ` at ${t.company}` : ""}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function Pricing() {
  const [yearly, setYearly] = useState(false);
  const plans = [
    { name: "Starter", desc: "Perfect for side projects.", price: { monthly: 0, yearly: 0 }, features: ["Up to 3 projects", "Cloudflare free tier", "Community support", "Basic analytics", "1GB storage"], cta: "Start Free" },
    { name: "Pro", desc: "For serious developers.", price: { monthly: 19, yearly: 190 }, features: ["Unlimited projects", "Priority deployment", "Email support", "Advanced analytics", "10GB storage", "Custom domains", "Team collaboration"], highlighted: true, cta: "Start Pro Trial" },
    { name: "Enterprise", desc: "For organizations.", price: { monthly: 49, yearly: 490 }, features: ["Everything in Pro", "Dedicated support", "SLA guarantee", "Unlimited storage", "SSO & SAML", "Audit logs", "Custom integrations"], cta: "Contact Sales" },
  ];

  return (
    <section id="pricing" className="max-w-6xl mx-auto px-4 md:px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Simple, Transparent Pricing</h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">No hidden fees. Start free, scale when you&apos;re ready.</p>
        <div className="inline-flex items-center gap-3 p-1 bg-white/5 border border-white/10 rounded-full">
          <button onClick={() => setYearly(false)} className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${!yearly ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}>Monthly</button>
          <button onClick={() => setYearly(true)} className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${yearly ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}>
            Yearly <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full font-semibold ml-1">-17%</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className={`relative p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${plan.highlighted ? "bg-gradient-to-b from-indigo-500/10 to-purple-500/5 border-indigo-500/30 shadow-lg shadow-indigo-500/10" : "bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12]"}`}>
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-semibold rounded-full">⚡ Most Popular</div>
            )}
            <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
            <p className="text-sm text-gray-500 mb-6">{plan.desc}</p>
            <div className="mb-8">
              <span className="text-4xl font-black text-white">${yearly ? plan.price.yearly : plan.price.monthly}</span>
              <span className="text-gray-500 text-sm">{plan.price.monthly > 0 ? (yearly ? "/year" : "/month") : " forever"}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-3 text-sm text-gray-400">
                  <span className="text-indigo-400 mt-0.5">✓</span>{f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 ${plan.highlighted ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:shadow-indigo-500/25" : "bg-white/5 border border-white/10 text-white hover:bg-white/10"}`}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTA() {
  return (
    <section id="get-started" className="max-w-6xl mx-auto px-4 md:px-6 py-20">
      <div className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-cyan-600/10" />
        <div className="absolute inset-0"><div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" /><div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" /></div>
        <div className="absolute inset-0 border border-white/[0.08] rounded-3xl" />
        <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/10 rounded-full mb-8">
            <span>⚡</span>
            <span className="text-sm text-gray-300">100% Free Forever</span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 text-white leading-tight">Ready to Build Something Amazing?</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">Join thousands of developers building the future. Start for free, no credit card required.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://github.com/nhprince/saturday" target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-white/10 hover:-translate-y-1">
              Get Started Free <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a href="https://github.com/nhprince/saturday" className="inline-flex items-center gap-2 px-8 py-4 text-gray-300 font-medium transition-all duration-300 hover:text-white">
              View Documentation <span className="ml-1">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-white/[0.01]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--gradient-main)] flex items-center justify-center text-white text-sm font-bold">✦</div>
              Saturday
            </h3>
            <p className="text-gray-500 mb-6 max-w-xs leading-relaxed">Build something amazing. 100% free, fully automated, AI-powered.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors" />
              <button className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all whitespace-nowrap">Subscribe</button>
            </div>
          </div>
          {[
            { title: "Product", links: [{ l: "Features", h: "#features" }, { l: "Pricing", h: "#pricing" }, { l: "Docs", h: "#" }] },
            { title: "Resources", links: [{ l: "GitHub", h: "https://github.com/nhprince/saturday" }, { l: "Components", h: "#" }, { l: "Templates", h: "#" }] },
            { title: "Legal", links: [{ l: "Privacy", h: "#" }, { l: "Terms", h: "#" }, { l: "License", h: "#" }] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link.l}><a href={link.h} className="text-sm text-gray-500 hover:text-white transition-colors">{link.l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} Saturday Framework. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {["GitHub", "Twitter", "LinkedIn"].map(name => (
              <a key={name} href="#" className="text-xs text-gray-600 hover:text-white transition-colors">{name}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

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
