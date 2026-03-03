import NewsCard from "@/components/news/NewsCard";
import { articles } from "@/data/news";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export default function SingleArticlePage() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const article = articles.find((a) => String(a.id) === id);

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-4">
        <p className="text-muted-foreground text-lg">Article not found.</p>
        <button
          type="button"
          onClick={() => navigate({ to: "/news" })}
          className="flex items-center gap-2 text-primary hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to News
        </button>
      </div>
    );
  }

  // Pick 3 related articles (different from current)
  const related = articles.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <article className="max-w-3xl mx-auto px-4">
      {/* Category + Title */}
      <div className="mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          {article.category}
        </span>
        <h1 className="text-2xl md:text-4xl font-bold mt-2 leading-tight">
          {article.title}
        </h1>
      </div>

      {/* Featured image */}
      <div className="aspect-video rounded-xl overflow-hidden mb-5">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6 pb-4 border-b border-border">
        <span className="font-medium text-foreground">{article.author}</span>
        <span>·</span>
        <span>{article.date}</span>
        <span>·</span>
        <span>{article.readTime}</span>
      </div>

      {/* Content */}
      <div className="space-y-5 text-sm sm:text-base leading-relaxed text-foreground/90">
        {article.content.split("\n\n").map((para) => (
          <p key={para.slice(0, 40)}>{para}</p>
        ))}
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <div className="mt-10 pt-8 border-t border-border">
          <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-primary inline-block" />
            Related Articles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((rel) => (
              <NewsCard key={rel.id} article={rel} />
            ))}
          </div>
        </div>
      )}

      <footer className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground pb-4">
        <p>
          © {new Date().getFullYear()}{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            Built with ♥ using caffeine.ai
          </a>
        </p>
      </footer>
    </article>
  );
}
