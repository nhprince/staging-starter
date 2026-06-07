"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Github, ExternalLink, Mail, MapPin, Calendar } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  image_url?: string;
  project_url?: string;
  github_url?: string;
  tags: string[];
  featured: boolean;
  sort_order: number;
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-white/[0.06]" : "bg-transparent"}`}>
      <div className="max-w-5xl mx-auto px-4 md:px-6 flex items-center justify-between h-16">
        <a href="/" className="text-lg font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--gradient-main)] flex items-center justify-center text-white text-sm font-bold">✦</div>
          Portfolio
        </a>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
        <div className="w-28 h-28 rounded-full bg-[var(--gradient-main)] mx-auto mb-6 flex items-center justify-center text-5xl shadow-lg shadow-indigo-500/20">👨‍💻</div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
          Hi, I&apos;m <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Developer</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto mb-4">Full-Stack Developer · Open Source Enthusiast · AI Explorer</p>
        <p className="text-sm text-gray-500 max-w-lg mx-auto mb-8">Building modern web applications with Python, TypeScript, and Saturday Framework. Based in Dhaka, Bangladesh.</p>
        <div className="flex items-center justify-center gap-4">
          <a href="#projects" className="btn-primary">View Projects <ArrowRight className="w-4 h-4" /></a>
          <a href="#contact" className="btn-secondary">Get in Touch</a>
        </div>
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="max-w-5xl mx-auto px-4 md:px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center text-white">Projects</h2>
      <p className="text-gray-500 text-center mb-12 max-w-lg mx-auto">A selection of projects I&apos;ve built. Each one taught me something new.</p>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(p => (
            <div key={p.id} className="glass-card overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              {p.image_url ? (
                <div className="h-48 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                  <span className="text-4xl">🚀</span>
                </div>
              ) : (
                <div className="h-2 bg-[var(--gradient-main)]" />
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{p.title}</h3>
                  <div className="flex gap-2">
                    {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors"><Github className="w-4 h-4" /></a>}
                    {p.project_url && <a href={p.project_url} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors"><ExternalLink className="w-4 h-4" /></a>}
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{p.description}</p>
                {p.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {p.tags.map(tag => (
                      <span key={tag} className="text-xs bg-white/5 px-2.5 py-0.5 rounded-full text-gray-400">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🚀</div>
          <h3 className="text-lg font-bold mb-2 text-white">No Projects Yet</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">Add projects via the CMS API to showcase your work.</p>
          <div className="glass-card p-6 max-w-lg mx-auto text-left">
            <p className="text-xs font-mono text-gray-500 mb-3">Create a project entry:</p>
            <code className="code-block text-xs block">
              {`curl -X POST ${API_URL || "https://your-worker.dev"}/api/cms/entries \\
  -H "Content-Type: application/json" \\
  -d '{"type_id":"<project-type-id>","slug":"my-project","title":"My Project","data":"{\\"description\\":\\"A cool project\\",\\"tags\\":[\\"react\\",\\"typescript\\"]}","status":"published"}'`}
            </code>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function About() {
  return (
    <section id="about" className="max-w-5xl mx-auto px-4 md:px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center text-white">About Me</h2>
      <p className="text-gray-500 text-center mb-12 max-w-lg mx-auto">A bit about who I am and what I do.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <h3 className="text-lg font-bold text-white mb-4">Skills</h3>
          <div className="space-y-3">
            {[
              { name: "TypeScript / JavaScript", level: 90 },
              { name: "Python / Django", level: 85 },
              { name: "React / Next.js", level: 88 },
              { name: "Node.js / Express", level: 82 },
              { name: "Cloudflare Workers", level: 80 },
              { name: "PostgreSQL / D1", level: 78 },
            ].map(s => (
              <div key={s.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{s.name}</span>
                  <span className="text-gray-500">{s.level}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5">
                  <div className="bg-[var(--gradient-main)] h-1.5 rounded-full transition-all duration-500" style={{ width: `${s.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-8">
          <h3 className="text-lg font-bold text-white mb-4">Experience</h3>
          <div className="space-y-4">
            {[
              { role: "Full-Stack Developer", company: "Self-Employed", period: "2023 — Present", desc: "Building modern web applications with Python, TypeScript, and Cloudflare." },
              { role: "Open Source Contributor", company: "Various", period: "2022 — Present", desc: "Contributing to open-source projects and building developer tools." },
            ].map((exp, i) => (
              <div key={i} className="border-l-2 border-indigo-500/30 pl-4">
                <h4 className="font-semibold text-white text-sm">{exp.role}</h4>
                <p className="text-xs text-indigo-400 mb-1">{exp.company} · {exp.period}</p>
                <p className="text-xs text-gray-500">{exp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch { /* optimistic */ }
    setSent(true);
  };

  return (
    <section id="contact" className="max-w-5xl mx-auto px-4 md:px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center text-white">Get in Touch</h2>
      <p className="text-gray-500 text-center mb-12 max-w-lg mx-auto">Have a question or want to work together? Drop me a message.</p>
      <div className="max-w-lg mx-auto">
        {sent ? (
          <div className="glass-card p-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-2 text-white">Message Sent!</h3>
            <p className="text-gray-500">I&apos;ll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Name</label>
              <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
              <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Message</label>
              <textarea rows={4} required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none" placeholder="Your message..." />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">Send Message</button>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-8 text-center">
      <p className="text-xs text-gray-600">
        Built with <span className="font-semibold text-indigo-400">Saturday Framework</span> · Powered by Cloudflare
      </p>
    </footer>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Fetch projects from CMS
    if (!API_URL) return;
    fetch(`${API_URL}/api/cms/entries?type=project&status=published&limit=20`, { signal: AbortSignal.timeout(5000) })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.entries) {
          setProjects(data.entries.map((e: any) => ({
            ...e,
            tags: e.data?.tags || [],
            description: e.data?.description || e.title,
            image_url: e.data?.image_url,
            project_url: e.data?.project_url,
            github_url: e.data?.github_url,
            featured: e.data?.featured || false,
          })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen relative">
      <div className="bg-mesh" />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Projects projects={projects} />
        <About />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
