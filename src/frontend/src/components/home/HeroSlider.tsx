import { slides } from "@/data/slider";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Touch/swipe state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const MIN_SWIPE = 50;

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3500);
  }, []);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [startAutoPlay, stopAutoPlay]);

  const goTo = useCallback(
    (index: number) => {
      setCurrent(index);
      startAutoPlay();
    },
    [startAutoPlay],
  );

  const goPrev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  const goNext = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) >= MIN_SWIPE) {
      if (delta > 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-muted shadow-card group">
      {/* Slides track */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="relative min-w-full h-64 sm:h-80 md:h-[420px] flex-shrink-0"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading={slide.id === 1 ? "eager" : "lazy"}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <span className="inline-block text-[10px] font-bold tracking-widest uppercase bg-primary text-primary-foreground px-2 py-0.5 rounded mb-2">
                {slide.label}
              </span>
              <h2 className="text-white text-base sm:text-lg md:text-xl font-bold leading-tight drop-shadow">
                {slide.title}
              </h2>
              <p className="text-white/75 text-sm mt-1 drop-shadow">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Prev arrow */}
      <button
        type="button"
        onClick={goPrev}
        aria-label="Previous slide"
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 z-10",
          "w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white",
          "flex items-center justify-center transition-all duration-200",
          "opacity-0 group-hover:opacity-100 focus:opacity-100",
        )}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Next arrow */}
      <button
        type="button"
        onClick={goNext}
        aria-label="Next slide"
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 z-10",
          "w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white",
          "flex items-center justify-center transition-all duration-200",
          "opacity-0 group-hover:opacity-100 focus:opacity-100",
        )}
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "rounded-full transition-all duration-300",
              i === current
                ? "w-5 h-2 bg-primary"
                : "w-2 h-2 bg-white/40 hover:bg-white/70",
            )}
          />
        ))}
      </div>
    </div>
  );
}
