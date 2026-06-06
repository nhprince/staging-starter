"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] py-8">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-[var(--gradient-main)] flex items-center justify-center">
              <span className="text-white text-xs font-bold">✦</span>
            </div>
            <span className="text-sm text-[var(--text-muted)]">
              Built with <span className="font-semibold text-[var(--accent-indigo)]">Saturday Framework</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <span>Powered by Cloudflare</span>
            <span>·</span>
            <span>100% Free</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
