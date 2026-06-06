import Link from "next/link";

interface PostContentProps {
  title: string;
  content: string;
  publishedAt: string;
  tags?: { name: string; slug: string }[];
  categories?: { name: string; slug: string }[];
}

export function PostContent({ title, content, publishedAt, tags, categories }: PostContentProps) {
  const date = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

  // Simple markdown-like rendering (bold, italic, code, headings, paragraphs)
  const renderContent = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];

    lines.forEach((line, i) => {
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${i}`} className="code-block my-4">
              <code>{codeLines.join("\n")}</code>
            </pre>
          );
          codeLines = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        return;
      }

      if (line.startsWith("# ")) {
        elements.push(<h1 key={i} className="text-3xl font-black mt-8 mb-4">{line.slice(2)}</h1>);
      } else if (line.startsWith("## ")) {
        elements.push(<h2 key={i} className="text-2xl font-bold mt-6 mb-3">{line.slice(3)}</h2>);
      } else if (line.startsWith("### ")) {
        elements.push(<h3 key={i} className="text-xl font-bold mt-4 mb-2">{line.slice(4)}</h3>);
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(
          <li key={i} className="text-[var(--text-secondary)] ml-4 mb-1 list-disc">
            {renderInline(line.slice(2))}
          </li>
        );
      } else if (line.trim() === "") {
        elements.push(<br key={i} />);
      } else {
        elements.push(
          <p key={i} className="text-[var(--text-secondary)] mb-3 leading-relaxed">
            {renderInline(line)}
          </p>
        );
      }
    });

    return elements;
  };

  const renderInline = (text: string): React.ReactNode => {
    // Bold
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="text-[var(--text-primary)] font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={i} className="bg-white/5 px-1.5 py-0.5 rounded text-[var(--accent-indigo)] text-sm font-mono">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">{title}</h1>
        <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
          {date && <time>{date}</time>}
          {categories && categories.length > 0 && (
            <div className="flex gap-2">
              {categories.map((cat) => (
                <span key={cat.slug} className="bg-[var(--accent-indigo)]/10 text-[var(--accent-indigo)] px-2 py-0.5 rounded-full text-xs">
                  {cat.name}
                </span>
              ))}
            </div>
          )}
        </div>
        {tags && tags.length > 0 && (
          <div className="flex gap-2 mt-3">
            {tags.map((tag) => (
              <span key={tag.slug} className="text-xs text-[var(--text-muted)]">#{tag.name}</span>
            ))}
          </div>
        )}
      </header>
      <div className="prose-content">{renderContent(content)}</div>
      <footer className="mt-12 pt-6 border-t border-[var(--border-subtle)]">
        <Link href="/" className="text-sm text-[var(--accent-indigo)] hover:underline">
          ← Back to all posts
        </Link>
      </footer>
    </article>
  );
}
