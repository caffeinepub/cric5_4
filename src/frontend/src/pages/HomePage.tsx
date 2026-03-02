import FeaturedMatches from "@/components/home/FeaturedMatches";
import HeroSlider from "@/components/home/HeroSlider";
import LatestNews from "@/components/home/LatestNews";
import TopStories from "@/components/home/TopStories";

export default function HomePage() {
  return (
    <div className="space-y-2">
      <HeroSlider />
      <FeaturedMatches />
      <TopStories />
      <LatestNews />

      {/* Footer */}
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
