import NewsCard from "@/components/news/NewsCard";
import { articles } from "@/data/news";

export default function NewsListingPage() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

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
    </div>
  );
}
