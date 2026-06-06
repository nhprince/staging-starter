"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface Project {
  id: string; title: string; slug: string; description: string;
  content: string; image_url: string; project_url: string; github_url: string;
  tags: string; featured: boolean; sort_order: number;
}

interface Experience {
  id: string; company: string; role: string; description: string;
  start_date: string; end_date: string; current: boolean;
}

interface Skill {
  id: string; name: string; category: string; level: number;
}

export default function Home() {
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
    } catch { /* optimistic */ }
    setSent(true);
  };

  // Sample data (in production, fetch from API)
  const projects: Project[] = [];
  const experience: Experience[] = [];
  const skills: Skill[] = [];

  return (
    <div className="min-h-screen relative">
      <div className="bg-mesh" />
      <div className="relative z-10">

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 md:px-6 pt-24 pb-20 text-center">
          <div className="animate-fade-in-up">
            <div className="w-24 h-24 rounded-full bg-[var(--gradient-main)] mx-auto mb-6 flex items-center justify-center text-4xl">
              👨‍💻
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              Hi, I&apos;m <span className="gradient-text">Developer</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto mb-8">
              Full-Stack Developer | Python | Cybersecurity
              <br />
              Building modern web applications with Saturday Framework.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a href="#projects" className="btn-primary">View Projects</a>
              <a href="#contact" className="btn-primary" style={{ background: "rgba(255,255,255,0.05)" }}>Contact Me</a>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="max-w-4xl mx-auto px-4 md:px-6 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {projects.map((p) => (
                <div key={p.id} className="glass-card p-6">
                  <h3 className="text-lg font-bold mb-2">{p.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-3">{p.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {JSON.parse(p.tags || "[]").map((tag: string) => (
                      <span key={tag} className="text-xs bg-white/5 px-2 py-0.5 rounded-full text-[var(--text-muted)]">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🚀</div>
              <p className="text-[var(--text-secondary)]">Projects will appear here. Add them via the API.</p>
            </div>
          )}
        </section>

        {/* Experience */}
        <section id="experience" className="max-w-4xl mx-auto px-4 md:px-6 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Experience</h2>
          {experience.length > 0 ? (
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="glass-card p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold">{exp.role}</h3>
                    <span className="text-xs text-[var(--text-muted)]">{exp.start_date} — {exp.current ? "Present" : exp.end_date}</span>
                  </div>
                  <p className="text-sm text-[var(--accent-indigo)] mb-1">{exp.company}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{exp.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">💼</div>
              <p className="text-[var(--text-secondary)]">Experience will appear here.</p>
            </div>
          )}
        </section>

        {/* Skills */}
        <section id="skills" className="max-w-4xl mx-auto px-4 md:px-6 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Skills</h2>
          {skills.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {skills.map((s) => (
                <div key={s.id} className="glass-card p-4 text-center">
                  <div className="text-lg font-bold mb-1">{s.name}</div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 mb-1">
                    <div className="bg-[var(--gradient-main)] h-1.5 rounded-full" style={{ width: `${s.level}%` }} />
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">{s.category}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">⚡</div>
              <p className="text-[var(--text-secondary)]">Skills will appear here.</p>
            </div>
          )}
        </section>

        {/* Contact */}
        <section id="contact" className="max-w-4xl mx-auto px-4 md:px-6 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Get in Touch</h2>
          <div className="max-w-lg mx-auto">
            {sent ? (
              <div className="glass-card p-8 text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-[var(--text-secondary)]">I&apos;ll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Name</label>
                  <input type="text" required value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-glow)] transition-colors"
                    placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Email</label>
                  <input type="email" required value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-glow)] transition-colors"
                    placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Message</label>
                  <textarea rows={4} required value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-glow)] transition-colors resize-none"
                    placeholder="Your message..." />
                </div>
                <button type="submit" className="btn-primary w-full justify-center">Send Message</button>
              </form>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[var(--border-subtle)] py-8 text-center">
          <p className="text-xs text-[var(--text-muted)]">
            Built with <span className="font-semibold text-[var(--accent-indigo)]">Saturday Framework</span> · Powered by Cloudflare
          </p>
        </footer>
      </div>
    </div>
  );
}
