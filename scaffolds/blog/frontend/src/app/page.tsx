"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, User, Tag, Search } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface Post {
  id: string; slug: string; title: string; excerpt: string;
  cover_image?: string; status: string; published_at: string;
  author_id?: string; tags?: { id: string; name: string; slug: string }[];
}

async function fetchPosts(): Promise<Post[]> {
  if (!API_URL) return [];
  try {
    const res = await fetch(`${API_URL}/api/cms/entries?type=post&status=published&limit=50`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const data = await res.json();
    return data.entries ?? [];
  } catch { return []; }
}

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

  const links = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
    { label: "Tags", href: "/tags" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`} style={{ background: scrolled ? undefined : "transparent" }}>
        <div className="container-fluid">
          <div className="flex items-center justify-between h-14 md:h-16">
            <Link href="/" className="flex items-center gap-2 no-underline">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[var(--gradient-main)] flex items-center justify-center text-white text-xs md:text-sm font-bold">✦</div>
              <span className="text-base md:text-lg font-bold text-white">Blog</span>
            </Link>

            <div className="nav-links">
              {links.map(l => (<Link key={l.label} href={l.href}>{l.label}</Link>))}
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
            {links.map(l => (<Link key={l.label} href={l.href} onClick={() => setDrawerOpen(false)}>{l.label}</Link>))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── POST CARD ───────────────────────────────────────────────────

function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/post/${post.slug}`} className="group block no-underline">
      <article className="glass-card overflow-hidden hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
        <div className="h-40 md:h-48 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
          <span className="text-3xl md:text-4xl">📝</span>
        </div>
        <div className="p-4 md:p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-gray-500 mb-2 md:mb-3">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            {post.author_id && <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author_id}</span>}
          </div>
          <h2 className="text-base md:text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">{post.title}</h2>
          <p className="text-xs md:text-sm text-gray-500 leading-relaxed mb-3 md:mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-1.5 md:gap-2 flex-wrap mt-auto">
              {post.tags.slice(0, 3).map(tag => (
                <span key={tag.id} className="text-[9px] md:text-xs bg-white/5 px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full text-gray-400 flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5 md:w-3 md:h-3" />{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { fetchPosts().then(setPosts); }, []);

  const filtered = searchQuery
    ? posts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()))
    : posts;

  return (
    <div className="min-h-screen relative">
      <div className="bg-mesh" />
      <div className="relative z-10">
        <Navbar />

        {/* Hero */}
        <section className="container-fluid pt-20 md:pt-28 pb-8 md:pb-12 text-center">
          <div className="animate-fade-in-up">
            <h1 className="heading-xl mb-3 md:mb-4">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Saturday Blog</span>
            </h1>
          </div>
          <div className="animate-fade-in-up stagger-1">
            <p className="text-body max-w-2xl mx-auto mb-6 md:mb-8">
              A complete blog scaffold with CMS, comments, and edge deployment. Built with Saturday Framework.
            </p>
          </div>
          <div className="animate-fade-in-up stagger-2">
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors" />
            </div>
          </div>
        </section>

        {/* Posts */}
        <main className="container-fluid pb-12 md:pb-16">
          {filtered.length > 0 ? (
            <>
              {/* Desktop Grid */}
              <div className="desktop-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {filtered.map(post => <PostCard key={post.id} post={post} />)}
              </div>

              {/* Mobile Scroll */}
              <div className="mobile-scroll scroll-row md:hidden">
                {filtered.map(post => (
                  <div key={post.id} className="flex-shrink-0" style={{ width: "78vw", maxWidth: "22rem" }}>
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 md:py-20">
              <div className="text-5xl md:text-6xl mb-3 md:mb-4">📝</div>
              <h2 className="text-lg md:text-xl font-bold mb-2 text-white">No Posts Yet</h2>
              <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6 max-w-md mx-auto">
                {searchQuery ? "No posts match your search." : "Create your first post via the CMS API or seed the database."}
              </p>
              {!searchQuery && (
                <div className="glass-card p-4 md:p-6 max-w-lg mx-auto text-left">
                  <p className="text-[10px] md:text-xs font-mono text-gray-500 mb-2 md:mb-3">Quick start — create a content type:</p>
                  <code className="code-block text-[9px] md:text-xs block mb-2 md:mb-3 overflow-x-auto">
                    {`curl -X POST ${API_URL || "https://your-worker.dev"}/api/cms/types \\\n  -H "Content-Type: application/json" \\\n  -d '{"name":"Post","slug":"post"}'`}
                  </code>
                  <p className="text-[10px] md:text-xs font-mono text-gray-500 mb-2 md:mb-3">Then create an entry:</p>
                  <code className="code-block text-[9px] md:text-xs block overflow-x-auto">
                    {`curl -X POST ${API_URL || "https://your-worker.dev"}/api/cms/entries \\\n  -H "Content-Type: application/json" \\\n  -d '{"type_id":"<id>","slug":"hello","title":"Hello World","status":"published"}'`}
                  </code>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/[0.06] py-6 md:py-8 text-center">
          <p className="text-[10px] md:text-xs text-gray-600">
            Built with <span className="font-semibold text-indigo-400">Saturday Framework</span> · Powered by Cloudflare
          </p>
        </footer>
      </div>
    </div>
  );
}
