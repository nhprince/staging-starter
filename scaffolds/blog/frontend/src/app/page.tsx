"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, User, Tag, MessageCircle, Search } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  cover_image?: string;
  status: string;
  published_at: string;
  created_at: string;
  author_id?: string;
  tags?: { id: string; name: string; slug: string }[];
  categories?: { id: string; name: string; slug: string }[];
}

// ─── API ───────────────────────────────────────────────────────────────────────

async function fetchPosts(): Promise<Post[]> {
  if (!API_URL) return [];
  try {
    const res = await fetch(`${API_URL}/api/cms/entries?type=post&status=published&limit=50`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const data = await res.json();
    return data.entries ?? [];
  } catch {
    return [];
  }
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
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
          <div className="w-8 h-8 rounded-lg bg-[var(--gradient-main)] flex items-center justify-center text-white text-sm font-bold">✦</div>
          Blog
        </Link>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/categories" className="hover:text-white transition-colors">Categories</Link>
          <Link href="/tags" className="hover:text-white transition-colors">Tags</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────

function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/post/${post.slug}`} className="group block">
      <article className="glass-card overflow-hidden hover:-translate-y-1 transition-all duration-300">
        {post.cover_image && (
          <div className="h-48 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
            <span className="text-4xl">📝</span>
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            {post.author_id && <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author_id}</span>}
          </div>
          <h2 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{post.title}</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">{post.excerpt}</p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {post.tags.slice(0, 3).map(tag => (
                <span key={tag.id} className="text-xs bg-white/5 px-2 py-0.5 rounded-full text-gray-400 flex items-center gap-1">
                  <Tag className="w-3 h-3" />{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPosts().then(setPosts);
  }, []);

  const filtered = searchQuery
    ? posts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()))
    : posts;

  return (
    <div className="min-h-screen relative">
      <div className="bg-mesh" />
      <div className="relative z-10">
        <Navbar />

        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 md:px-6 pt-28 pb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Saturday Blog</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            A complete blog scaffold with CMS, comments, and edge deployment. Built with Saturday Framework.
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
        </section>

        {/* Posts */}
        <main className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(post => <PostCard key={post.id} post={post} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-xl font-bold mb-2 text-white">No Posts Yet</h2>
              <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                {searchQuery ? "No posts match your search." : "Create your first post via the CMS API or seed the database."}
              </p>
              {!searchQuery && (
                <div className="glass-card p-6 max-w-lg mx-auto text-left">
                  <p className="text-xs font-mono text-gray-500 mb-3">Quick start — create a content type:</p>
                  <code className="code-block text-xs block mb-3">
                    {`curl -X POST ${API_URL || "https://your-worker.dev"}/api/cms/types \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Post","slug":"post","schema":"{\\"fields\\":[{\\"name\\":\\"title\\",\\"type\\":\\"text\\"}]}"}'`}
                  </code>
                  <p className="text-xs font-mono text-gray-500 mb-3">Then create an entry:</p>
                  <code className="code-block text-xs block">
                    {`curl -X POST ${API_URL || "https://your-worker.dev"}/api/cms/entries \\
  -H "Content-Type: application/json" \\
  -d '{"type_id":"<type-id>","slug":"hello-world","title":"Hello World","data":"{\\"title\\":\\"Hello World\\"}","status":"published"}'`}
                  </code>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/[0.06] py-8 text-center">
          <p className="text-xs text-gray-600">
            Built with <span className="font-semibold text-indigo-400">Saturday Framework</span> · Powered by Cloudflare
          </p>
        </footer>
      </div>
    </div>
  );
}
