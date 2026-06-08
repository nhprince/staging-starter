"use client";

import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════
   ECOMMERCE STORE — PREMIUM RESPONSIVE
   ═══════════════════════════════════════════════════════════════ */

const NAV_LINKS = [
  { label: "Shop", href: "#shop" },
  { label: "Categories", href: "#categories" },
  { label: "Deals", href: "#deals" },
  { label: "About", href: "#about" },
];

const PRODUCTS = [
  { id: "1", name: "Premium Headphones", price: "$299", category: "Electronics", badge: "NEW" },
  { id: "2", name: "Leather Backpack", price: "$189", category: "Accessories", badge: "HOT" },
  { id: "3", name: "Smart Watch Pro", price: "$449", category: "Electronics", badge: "" },
  { id: "4", name: "Running Shoes", price: "$159", category: "Sports", badge: "SALE" },
  { id: "5", name: "Minimalist Desk Lamp", price: "$89", category: "Home", badge: "" },
  { id: "6", name: "Ceramic Mug Set", price: "$45", category: "Home", badge: "NEW" },
  { id: "7", name: "Wireless Charger", price: "$59", category: "Electronics", badge: "" },
  { id: "8", name: "Yoga Mat Premium", price: "$79", category: "Sports", badge: "HOT" },
];

const CATEGORIES = [
  { name: "Electronics", count: 124, icon: "🎧" },
  { name: "Accessories", count: 89, icon: "👜" },
  { name: "Sports", count: 67, icon: "⚽" },
  { name: "Home", count: 156, icon: "🏠" },
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
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[var(--gradient-main)] flex items-center justify-center text-white text-xs md:text-sm font-bold">🛍</div>
              <span className="text-base md:text-lg font-bold text-white">Store</span>
            </a>

            <div className="nav-links">
              {NAV_LINKS.map(l => (<a key={l.label} href={l.href}>{l.label}</a>))}
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <button className="p-2 text-[var(--text-secondary)] hover:text-white transition-colors" aria-label="Search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </button>
              <button className="p-2 text-[var(--text-secondary)] hover:text-white transition-colors relative" aria-label="Cart">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--accent-indigo)] text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
              </button>
              <button onClick={() => setDrawerOpen(true)} className="nav-mobile-btn p-2 text-[var(--text-secondary)] hover:text-white" aria-label="Menu">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
            </div>
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
          </div>
        </div>
      </div>
    </>
  );
}

// ─── HERO ────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-[60vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden pt-14 md:pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-cyan-900/10" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-48 md:w-80 h-48 md:h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-40 md:w-64 h-40 md:h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
      <div className="relative z-10 container-fluid text-center">
        <div className="animate-fade-in-up">
          <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-[var(--accent-indigo)] font-semibold mb-3 md:mb-4">New Collection 2026</p>
        </div>
        <div className="animate-fade-in-up stagger-1">
          <h1 className="heading-xl mb-3 md:mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Premium</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Products</span>
          </h1>
        </div>
        <div className="animate-fade-in-up stagger-2">
          <p className="text-body max-w-lg mx-auto mb-6 md:mb-10">Curated collection of premium products. Free shipping on orders over $100.</p>
        </div>
        <div className="animate-fade-in-up stagger-3">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#shop" className="btn-primary w-full sm:w-auto">Shop Now</a>
            <a href="#categories" className="btn-primary w-full sm:w-auto" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}>Browse Categories</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CATEGORIES ──────────────────────────────────────────────────

function Categories() {
  return (
    <section id="categories" className="section-padding">
      <div className="container-fluid">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="heading-lg mb-2 md:mb-3 text-white">Shop by Category</h2>
          <p className="text-body max-w-md mx-auto">Find exactly what you're looking for.</p>
        </div>

        <div className="desktop-grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {CATEGORIES.map((cat, i) => (
            <div key={i} className="glass-card p-4 md:p-6 text-center cursor-pointer group">
              <div className="text-3xl md:text-4xl mb-2 md:mb-3">{cat.icon}</div>
              <h3 className="font-semibold text-sm md:text-base text-white mb-1">{cat.name}</h3>
              <p className="text-[10px] md:text-xs text-[var(--text-muted)]">{cat.count} products</p>
            </div>
          ))}
        </div>

        <div className="mobile-scroll scroll-row md:hidden">
          {CATEGORIES.map((cat, i) => (
            <div key={i} className="glass-card p-4 text-center flex-shrink-0" style={{ width: "42vw", maxWidth: "11rem" }}>
              <div className="text-2xl mb-2">{cat.icon}</div>
              <h3 className="font-semibold text-xs text-white mb-1">{cat.name}</h3>
              <p className="text-[10px] text-[var(--text-muted)]">{cat.count} products</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PRODUCTS ────────────────────────────────────────────────────

function Products() {
  return (
    <section id="shop" className="section-padding bg-[var(--bg-secondary)]">
      <div className="container-fluid">
        <div className="flex items-end justify-between mb-6 md:mb-12">
          <div>
            <h2 className="heading-lg mb-1 md:mb-2 text-white">Featured Products</h2>
            <p className="text-body text-xs md:text-base">Handpicked for quality and design.</p>
          </div>
          <a href="#" className="text-[var(--accent-indigo)] text-xs md:text-sm font-semibold flex items-center gap-1 no-underline">
            View All <span>→</span>
          </a>
        </div>

        {/* Desktop Grid */}
        <div className="desktop-grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {PRODUCTS.map((p, i) => (
            <div key={p.id} className="glass-card overflow-hidden group cursor-pointer" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="aspect-square bg-[var(--bg-card)] relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl md:text-5xl opacity-20 group-hover:opacity-40 transition-opacity group-hover:scale-110 transform duration-500">📦</div>
                </div>
                {p.badge && (
                  <span className={`absolute top-2 left-2 md:top-3 md:left-3 px-2 py-0.5 text-[9px] md:text-[10px] font-bold uppercase rounded ${p.badge === "HOT" ? "bg-red-500 text-white" : p.badge === "NEW" ? "bg-[var(--accent-indigo)] text-white" : "bg-green-500 text-white"}`}>
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="p-3 md:p-4">
                <p className="text-[10px] md:text-xs text-[var(--text-muted)] mb-1">{p.category}</p>
                <h3 className="font-semibold text-sm md:text-base text-white mb-1 md:mb-2 truncate">{p.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm md:text-base text-white">{p.price}</span>
                  <button className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[var(--gradient-main)] flex items-center justify-center text-white text-sm md:text-base" aria-label="Add to cart">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Scroll */}
        <div className="mobile-scroll scroll-row md:hidden">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="glass-card overflow-hidden flex-shrink-0" style={{ width: "46vw", maxWidth: "14rem" }}>
              <div className="aspect-square bg-[var(--bg-card)] relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-3xl opacity-20">📦</div>
                </div>
                {p.badge && (
                  <span className={`absolute top-2 left-2 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded ${p.badge === "HOT" ? "bg-red-500 text-white" : p.badge === "NEW" ? "bg-[var(--accent-indigo)] text-white" : "bg-green-500 text-white"}`}>{p.badge}</span>
                )}
              </div>
              <div className="p-3">
                <p className="text-[10px] text-[var(--text-muted)] mb-0.5">{p.category}</p>
                <h3 className="font-semibold text-xs text-white mb-1 truncate">{p.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{p.price}</span>
                  <button className="w-6 h-6 rounded-full bg-[var(--gradient-main)] flex items-center justify-center text-white text-xs">+</button>
                </div>
              </div>
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
    <section className="section-padding">
      <div className="container-fluid">
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 to-purple-600/20" />
          <div className="relative z-10 px-5 py-10 md:px-16 md:py-20 text-center">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-6">Get 20% Off Your First Order</h2>
            <p className="text-sm md:text-base text-gray-400 max-w-lg mx-auto mb-6 md:mb-8">Sign up for our newsletter and receive exclusive deals.</p>
            <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email" className="w-full px-4 py-2.5 md:py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--accent-indigo)]" />
              <button className="btn-primary w-full sm:w-auto flex-shrink-0">Subscribe</button>
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
    <footer className="border-t border-[var(--border-subtle)] py-8 md:py-12">
      <div className="container-fluid">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          <div className="col-span-2 md:col-span-1">
            <span className="text-lg font-bold text-white">Store</span>
            <p className="text-xs text-[var(--text-muted)] mt-2 max-w-xs">Premium products, curated for quality. Free shipping worldwide.</p>
          </div>
          {[
            { title: "Shop", links: ["All Products", "Categories", "Deals", "New Arrivals"] },
            { title: "Support", links: ["Contact", "FAQ", "Shipping", "Returns"] },
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
          <p className="text-[10px] md:text-xs text-[var(--text-muted)]">© {new Date().getFullYear()} Store. All rights reserved.</p>
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
        <Categories />
        <Products />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
