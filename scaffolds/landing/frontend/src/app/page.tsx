"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSent, setContactSent] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch(`${API_URL}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
    } catch {
      setSubscribed(true); // Optimistic
    }
  };

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;
    try {
      await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      setContactSent(true);
    } catch {
      setContactSent(true); // Optimistic
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="bg-mesh" />
      <div className="relative z-10">
        <Header />

        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 md:px-6 pt-20 pb-16 text-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-[var(--border-subtle)] rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
              <span className="text-xs text-[var(--text-secondary)]">Built with Saturday Framework</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
              Build Something
              <br />
              <span className="gradient-text">Amazing</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
              A beautiful landing page scaffold powered by Saturday Framework.
              Cloudflare edge-deployed, dark-themed, and 100% free.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#contact" className="btn-primary">
                Get in Touch
                <span>→</span>
              </a>
              <a href="#features" className="btn-secondary">
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="max-w-5xl mx-auto px-4 md:px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why Saturday?</h2>
          <p className="text-[var(--text-secondary)] text-center mb-12 max-w-xl mx-auto">
            Everything you need to build and deploy modern web applications. For free.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: "⚡",
                title: "Edge Deployed",
                desc: "Your site runs at 300+ locations worldwide via Cloudflare's global network. Sub-50ms response times.",
              },
              {
                icon: "🔒",
                title: "Secure by Default",
                desc: "HTTPS enforced, security headers automatic, D1 database with encrypted connections.",
              },
              {
                icon: "🎨",
                title: "Beautiful Design",
                desc: "Dark theme with glassmorphism, gradient accents, and micro-animations. Looks professional out of the box.",
              },
              {
                icon: "🤖",
                title: "Agent Driven",
                desc: "Built for AI agents. One command scaffolds, configures, and deploys. Fully automated.",
              },
              {
                icon: "💰",
                title: "100% Free",
                desc: "Cloudflare free tier handles everything. No credit card needed. No hidden costs.",
              },
              {
                icon: "🔄",
                title: "Auto Deploy",
                desc: "Push to main → GitHub Actions builds → deploys to Cloudflare. Zero manual steps.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass-card p-6 hover:-translate-y-1 transition-transform duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-5xl mx-auto px-4 md:px-6 py-16">
          <div className="glass-card p-8 md:p-12 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "300+", label: "Edge Locations" },
                { value: "<50ms", label: "Response Time" },
                { value: "99.9%", label: "Uptime" },
                { value: "100%", label: "Free" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-black gradient-text mb-1">{stat.value}</div>
                  <div className="text-sm text-[var(--text-muted)]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="max-w-5xl mx-auto px-4 md:px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Get in Touch</h2>
          <p className="text-[var(--text-secondary)] text-center mb-12 max-w-xl mx-auto">
            Have a question or want to work together? Drop us a message.
          </p>
          <div className="max-w-lg mx-auto">
            {contactSent ? (
              <div className="glass-card p-8 text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-[var(--text-secondary)]">We&apos;ll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleContact} className="glass-card p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-glow)] transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-glow)] transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-glow)] transition-colors resize-none"
                    placeholder="Your message..."
                  />
                </div>
                <button type="submit" className="btn-primary w-full justify-center">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Newsletter */}
        <section className="max-w-5xl mx-auto px-4 md:px-6 py-16">
          <div className="glass-card p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Stay Updated</h2>
            <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
              Get the latest updates on Saturday Framework. No spam, ever.
            </p>
            {subscribed ? (
              <div className="text-[var(--accent-green)] font-medium">✓ Thanks for subscribing!</div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/5 border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-glow)] transition-colors"
                  placeholder="you@example.com"
                />
                <button type="submit" className="btn-primary whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
