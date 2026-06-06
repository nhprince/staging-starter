import Link from "next/link";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  published_at: string;
}

export function PostCard({ post }: { post: Post }) {
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <Link href={`/posts/${post.slug}`} className="group">
      <article className="glass-card overflow-hidden group-hover:border-[var(--border-glow)] transition-all duration-300 group-hover:-translate-y-0.5 h-full flex flex-col">
        {post.cover_image && (
          <div className="h-48 bg-gradient-to-br from-[var(--accent-indigo)]/20 to-[var(--accent-purple)]/20 flex items-center justify-center">
            <span className="text-4xl">🖼️</span>
          </div>
        )}
        <div className="p-5 flex-1 flex flex-col">
          <h2 className="text-lg font-bold mb-2 group-hover:text-[var(--accent-indigo)] transition-colors line-clamp-2">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-3 flex-1">
              {post.excerpt}
            </p>
          )}
          {date && (
            <time className="text-xs text-[var(--text-muted)]">{date}</time>
          )}
        </div>
      </article>
    </Link>
  );
}
