import LoginModal from "@/components/auth/LoginModal";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { matchDetails } from "@/data/matchDetails";
import { articles } from "@/data/news";
import { cn } from "@/lib/utils";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Calendar,
  ChevronLeft,
  Home,
  LogOut,
  Menu,
  Moon,
  Newspaper,
  Sun,
  Trophy,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

function isSimplePage(pathname: string): boolean {
  return pathname.startsWith("/news") || isMatchDetailPage(pathname);
}

function isMatchesPage(pathname: string): boolean {
  return pathname === "/matches";
}

function isMatchDetailPage(pathname: string): boolean {
  return /^\/matches\/.+/.test(pathname);
}

function getMatchDetailTitle(pathname: string): string {
  const match = pathname.match(/^\/matches\/(.+)$/);
  if (match) {
    const id = Number(match[1]);
    const detail = matchDetails.find((d) => d.id === id);
    if (detail) return `${detail.team1.code} vs ${detail.team2.code}`;
    return "Match";
  }
  return "Match";
}

function getMatchDetailSubtitle(pathname: string): string | null {
  const match = pathname.match(/^\/matches\/(.+)$/);
  if (match) {
    const id = Number(match[1]);
    const detail = matchDetails.find((d) => d.id === id);
    if (detail) return detail.tournament;
  }
  return null;
}

function getPageTitle(pathname: string): string {
  if (isMatchDetailPage(pathname)) return getMatchDetailTitle(pathname);
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

// ── User Dropdown ─────────────────────────────────────────────────────────────
function UserDropdown({
  username,
  superCoins,
  onLogout,
  onClose,
}: {
  username: string;
  superCoins: number;
  onLogout: () => void;
  onClose: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        className="fixed inset-0 z-[55] cursor-default border-0 p-0"
        onClick={onClose}
        aria-label="Close dropdown"
        tabIndex={0}
      />
      {/* Panel */}
      <div
        data-ocid="header.user.dropdown"
        className="absolute right-0 top-full mt-1 w-52 bg-background border border-border rounded-xl shadow-xl z-[60] overflow-hidden"
      >
        {/* User info */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">
                {username}
              </p>
              <p className="text-xs text-muted-foreground">
                🪙 {superCoins} coins
              </p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          data-ocid="header.logout.button"
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-500/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </>
  );
}

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, username, superCoins, logout } = useAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userBtnRef = useRef<HTMLButtonElement>(null);

  const simple = isSimplePage(pathname);

  if (isMatchesPage(pathname)) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="max-w-[1200px] mx-auto px-4 h-14 flex items-center">
          <h1 className="text-xl font-bold text-foreground">Matches</h1>
        </div>
      </header>
    );
  }

  if (simple) {
    const isMatchDetail = isMatchDetailPage(pathname);
    const backDest = isMatchDetail ? "/matches" : "/";
    const subtitle = isMatchDetail ? getMatchDetailSubtitle(pathname) : null;

    return (
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="max-w-[1200px] mx-auto px-4 h-14 flex items-center relative">
          <button
            type="button"
            data-ocid="match.detail.back_button"
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                navigate({ to: backDest });
              }
            }}
            className="flex items-center gap-1 text-foreground hover:text-primary transition-colors -ml-1 z-10"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center max-w-[55%]">
            <span className="text-sm font-bold tracking-wide truncate text-center text-foreground">
              {getPageTitle(pathname)}
            </span>
            {subtitle && (
              <span className="text-[10px] text-muted-foreground font-medium truncate">
                {subtitle}
              </span>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="max-w-[1200px] mx-auto px-4 h-14 flex items-center justify-between">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-2">
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

            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="text-2xl font-black tracking-tighter text-primary hover:opacity-90 transition-opacity"
            >
              cric<span className="text-foreground">5</span>
            </button>
          </div>

          {/* Right: Theme + Login/User */}
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

            {/* Login or User button */}
            <div className="relative">
              {isLoggedIn ? (
                <button
                  ref={userBtnRef}
                  type="button"
                  data-ocid="header.login.button"
                  onClick={() => setDropdownOpen((o) => !o)}
                  className={cn(
                    "flex items-center gap-1.5 h-9 px-2 rounded-md",
                    "text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
                  )}
                  aria-label="User menu"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <User className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-foreground hidden sm:block">
                    🪙 {superCoins}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  data-ocid="header.login.button"
                  onClick={() => setLoginOpen(true)}
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-md",
                    "text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
                  )}
                  aria-label="Login"
                >
                  <User className="w-4.5 h-4.5" />
                </button>
              )}

              {/* Dropdown */}
              {dropdownOpen && isLoggedIn && (
                <UserDropdown
                  username={username}
                  superCoins={superCoins}
                  onLogout={logout}
                  onClose={() => setDropdownOpen(false)}
                />
              )}
            </div>
          </div>
        </div>
      </header>

      <SidebarDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        pathname={pathname}
      />

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
