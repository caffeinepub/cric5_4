import type { Article } from "@/data/news";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

interface NewsListItemProps {
  article: Article;
}

export default function NewsListItem({ article }: NewsListItemProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() =>
        navigate({ to: "/news/$id", params: { id: String(article.id) } })
      }
      className="w-full flex items-start gap-3 p-3 text-left hover:bg-muted/30 transition-colors group"
    >
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </div>
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
  );
}
