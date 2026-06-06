import Link from "next/link";
import { PostCard } from "@/components/PostCard";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  published_at: string;
  author_id: string;
}

async function getPosts(): Promise<Post[]> {
  // In static export mode, this runs at build time
  // For dynamic data, use client-side fetching
  return [];
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen relative">
      <div className="bg-mesh" />
      <div className="relative z-10">
        {/* Header */}
        <header className="header-glow sticky top-0 z-20 backdrop-blur-xl bg-[rgba(10,10,15,0.8)] border-b border-[var(--border-subtle)]">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-[var(--gradient-main)] flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">✦</div>
              <span className="text-lg font-bold tracking-tight">Blog</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
              <Link href="/" className="hover:text-[var(--accent-indigo)] transition-colors">Home</Link>
              <Link href="/categories" className="hover:text-[var(--accent-indigo)] transition-colors">Categories</Link>
              <Link href="/tags" className="hover:text-[var(--accent-indigo)] transition-colors">Tags</Link>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 md:px-6 pt-16 pb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-[var(--accent-indigo)] to-[var(--accent-purple)] bg-clip-text text-transparent">
              Saturday Blog
            </span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            A complete blog scaffold built with the Saturday framework. Cloudflare-powered, dark-themed, and blazing fast.
          </p>
        </section>

        {/* Posts Grid */}
        <main className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-xl font-bold mb-2">No Posts Yet</h2>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Create your first post via the API or seed the database.
              </p>
              <div className="glass-card p-6 max-w-md mx-auto text-left">
                <p className="text-xs font-mono text-[var(--text-muted)] mb-2">Quick start:</p>
                <code className="text-xs text-[var(--accent-indigo)] block">
                  cd scaffolds/blog && npm run seed
                </code>
              </div>
            </div>
          )}
        </main>

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
