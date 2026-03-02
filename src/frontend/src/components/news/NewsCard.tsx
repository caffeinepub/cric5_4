import type { Article } from "@/data/news";
import { useNavigate } from "@tanstack/react-router";

interface NewsCardProps {
  article: Article;
}

export default function NewsCard({ article }: NewsCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() =>
        navigate({ to: "/news/$id", params: { id: String(article.id) } })
      }
      className="w-full text-left bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-card-hover transition-all group"
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
          {article.category}
        </span>
        <h3 className="text-sm font-semibold mt-1.5 line-clamp-2 leading-snug">
          {article.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted-foreground">
            {article.author}
          </span>
          <span className="text-xs text-muted-foreground">{article.date}</span>
        </div>
      </div>
    </button>
  );
}
