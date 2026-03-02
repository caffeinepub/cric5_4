import { useTheme } from "@/context/ThemeContext";
import { articles } from "@/data/news";
import { cn } from "@/lib/utils";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Calendar,
  ChevronLeft,
  Home,
  Menu,
  Moon,
  Newspaper,
  Sun,
  Trophy,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

function isSimplePage(pathname: string): boolean {
  return pathname.startsWith("/news");
}

function getPageTitle(pathname: string): string {
  if (pathname === "/news") return "News";
  // Extract article id from /news/:id
  const match = pathname.match(/^\/news\/(.+)$/);
  if (match) {
    const article = articles.find((a) => String(a.id) === match[1]);
    if (article) {
      // Truncate long titles
      return article.title.length > 40
        ? `${article.title.slice(0, 38)}…`
        : article.title;
    }
    return "Article";
  }
  return "News";
}

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/matches", label: "Matches", icon: Calendar },
  { to: "/win", label: "Win", icon: Trophy },
  { to: "/news", label: "News", icon: Newspaper },
] as const;

function SidebarDrawer({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const navigate = useNavigate();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNavClick = (to: string) => {
    navigate({ to });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        className={cn(
          "fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          "border-0 p-0 cursor-default",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
      />

      {/* Sidebar panel */}
      <dialog
        open={open}
        className={cn(
          "fixed top-0 left-0 z-[70] h-full w-[280px] bg-background border-r border-border shadow-2xl m-0 p-0 max-h-full max-w-none",
          "transition-transform duration-300 ease-in-out flex flex-col",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Navigation menu"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-border flex-shrink-0">
          <span className="text-xl font-black tracking-tighter text-primary">
            cric<span className="text-foreground">5</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-md",
              "text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive =
              to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <button
                key={to}
                type="button"
                onClick={() => handleNavClick(to)}
                className={cn(
                  "w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors text-left",
                  isActive
                    ? "text-primary bg-primary/8"
                    : "text-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "w-4.5 h-4.5 flex-shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <span>{label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border flex-shrink-0">
          <p className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} cric5. All rights reserved.
          </p>
        </div>
      </dialog>
    </>
  );
}

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  const simple = isSimplePage(pathname);

  if (simple) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="max-w-[1200px] mx-auto px-4 h-14 flex items-center relative">
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                navigate({ to: "/" });
              }
            }}
            className="flex items-center gap-1 text-foreground hover:text-primary transition-colors -ml-1 z-10"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold tracking-wide max-w-[55%] truncate text-center">
            {getPageTitle(pathname)}
          </span>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="max-w-[1200px] mx-auto px-4 h-14 flex items-center justify-between">
          {/* Left: Hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className={cn(
              "flex items-center justify-center w-9 h-9 rounded-md",
              "text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
            )}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Center: Logo */}
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="text-2xl font-black tracking-tighter text-primary hover:opacity-90 transition-opacity"
          >
            cric<span className="text-foreground">5</span>
          </button>

          {/* Right: Theme + Login */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-md",
                "text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
              )}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4.5 h-4.5" />
              ) : (
                <Moon className="w-4.5 h-4.5" />
              )}
            </button>
            <button
              type="button"
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-md",
                "text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
              )}
              aria-label="Login"
            >
              <User className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>

      <SidebarDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        pathname={pathname}
      />
    </>
  );
}
