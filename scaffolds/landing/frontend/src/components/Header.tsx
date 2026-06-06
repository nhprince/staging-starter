"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[rgba(10,10,15,0.8)] border-b border-[var(--border-subtle)]">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-[var(--gradient-main)] flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-white text-sm font-bold">✦</span>
          </div>
          <span className="text-lg font-bold tracking-tight">Saturday</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#features" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Features</a>
          <a href="#contact" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Contact</a>
          <a href="#contact" className="btn-primary text-sm !py-2 !px-4">Get Started</a>
        </nav>
      </div>
    </header>
  );
}
