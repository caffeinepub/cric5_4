import { articles } from "@/data/news";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";

export default function TopStories() {
  const navigate = useNavigate();
  const [hero, ...rest] = articles.slice(0, 4);

  if (!hero) return null;

  const handleNavigate = (id: number) => {
    navigate({ to: "/news/$id", params: { id: String(id) } });
  };

  return (
    <section className="mt-7">
      <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-primary inline-block" />
        Top Stories
      </h2>

      <div className="space-y-3">
        {/* Hero card */}
        <button
          type="button"
          onClick={() => handleNavigate(hero.id)}
          className="relative w-full rounded-xl overflow-hidden block text-left group"
        >
          <div className="aspect-[16/9] sm:aspect-[21/9]">
            <img
              src={hero.image}
              alt={hero.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            <span
              className={cn(
                "inline-block text-[10px] font-bold uppercase tracking-widest",
                "bg-primary text-primary-foreground px-2 py-0.5 rounded mb-2",
              )}
            >
              {hero.category}
            </span>
            <h3 className="text-white font-bold text-base sm:text-xl leading-tight line-clamp-3">
              {hero.title}
            </h3>
            <p className="text-white/70 text-xs mt-1.5">
              {hero.author} · {hero.date}
            </p>
          </div>
        </button>

        {/* 3 smaller cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {rest.map((article) => (
            <button
              key={article.id}
              type="button"
              onClick={() => handleNavigate(article.id)}
              className="flex sm:flex-col gap-3 bg-card border border-border rounded-xl overflow-hidden text-left hover:border-primary/50 transition-colors group"
            >
              <div className="w-24 sm:w-full aspect-[4/3] sm:aspect-video flex-shrink-0 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex-1 p-3 sm:pt-0 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {article.category}
                </span>
                <h4 className="text-sm font-semibold mt-1 line-clamp-3 leading-snug">
                  {article.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {article.date}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
