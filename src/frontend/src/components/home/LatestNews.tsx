import { articles } from "@/data/news";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export default function LatestNews() {
  const navigate = useNavigate();
  const newsItems = articles.slice(4, 11);

  return (
    <section className="mt-7">
      <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-primary inline-block" />
        Latest News
      </h2>

      <div className="space-y-0 bg-card border border-border rounded-xl overflow-hidden">
        {newsItems.map((article, index) => (
          <button
            key={article.id}
            type="button"
            onClick={() =>
              navigate({ to: "/news/$id", params: { id: String(article.id) } })
            }
            className={`
              w-full flex items-start gap-3 p-3 text-left
              hover:bg-muted/30 transition-colors group
              ${index < newsItems.length - 1 ? "border-b border-border" : ""}
            `}
          >
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                {article.category}
              </span>
              <h3 className="text-sm font-semibold mt-0.5 line-clamp-2 leading-snug">
                {article.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {article.author} · {article.readTime}
              </p>
            </div>

            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1 group-hover:text-primary transition-colors" />
          </button>
        ))}
      </div>

      {/* View More */}
      <button
        type="button"
        onClick={() => navigate({ to: "/news" })}
        className="mt-4 w-full py-3 border border-primary/30 rounded-xl text-primary text-sm font-semibold hover:bg-primary/10 transition-colors"
      >
        View More News
      </button>
    </section>
  );
}
