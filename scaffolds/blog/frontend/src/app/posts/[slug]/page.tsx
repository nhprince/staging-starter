import { PostContent } from "@/components/PostContent";
import Link from "next/link";

interface PostPageProps {
  params: { slug: string };
}

async function getPost(slug: string) {
  // In static export, this would use generateStaticParams
  // For dynamic rendering, fetch from API
  return null;
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    return (
      <div className="min-h-screen relative">
        <div className="bg-mesh" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 py-20 text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
          <p className="text-[var(--text-secondary)] mb-6">
            The post you&apos;re looking for doesn&apos;t exist or hasn&apos;t been published yet.
          </p>
          <Link href="/" className="btn-primary inline-block">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="bg-mesh" />
      <div className="relative z-10">
        <header className="header-glow sticky top-0 z-20 backdrop-blur-xl bg-[rgba(10,10,15,0.8)] border-b border-[var(--border-subtle)]">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-[var(--gradient-main)] flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-500/20">✦</div>
              <span className="text-lg font-bold tracking-tight">Blog</span>
            </Link>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <PostContent
            title={post.title}
            content={post.content}
            publishedAt={post.published_at}
            tags={post.tags}
            categories={post.categories}
          />
        </main>
      </div>
    </div>
  );
}
