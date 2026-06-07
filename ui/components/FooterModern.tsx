"use client";

import { Github, Twitter, Linkedin, Mail } from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface FooterModernProps {
  brand?: string;
  tagline?: string;
  columns?: FooterColumn[];
  socials?: { icon: "github" | "twitter" | "linkedin" | "email"; href: string }[];
  newsletter?: boolean;
}

const defaultColumns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Docs", href: "#docs" },
      { label: "Changelog", href: "#changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Blog", href: "#blog" },
      { label: "Careers", href: "#careers" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#privacy" },
      { label: "Terms", href: "#terms" },
      { label: "License", href: "#license" },
    ],
  },
];

const iconMap = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  email: Mail,
};

export function FooterModern({
  brand = "Saturday",
  tagline = "Build something amazing. 100% free, fully automated.",
  columns = defaultColumns,
  socials = [
    { icon: "github", href: "#" },
    { icon: "twitter", href: "#" },
    { icon: "linkedin", href: "#" },
  ],
  newsletter = true,
}: FooterModernProps) {
  return (
    <footer className="border-t border-white/[0.06] bg-white/[0.01]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-3">{brand}</h3>
            <p className="text-gray-500 mb-6 max-w-xs leading-relaxed">{tagline}</p>
            {newsletter && (
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
                <button className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            )}
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-gray-500 hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} {brand}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socials.map((social) => {
              const Icon = iconMap[social.icon];
              return (
                <a
                  key={social.href}
                  href={social.href}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
