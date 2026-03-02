import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { Calendar, House, Trophy } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: House },
  { to: "/matches", label: "Matches", icon: Calendar },
  { to: "/win", label: "Win", icon: Trophy },
] as const;

export default function BottomNav() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background">
      <div className="flex items-stretch h-16">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive =
            to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
              <span>{label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
