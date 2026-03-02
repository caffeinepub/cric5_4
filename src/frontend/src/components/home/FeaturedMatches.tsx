import { matches } from "@/data/matches";
import type { Match, MatchStatus } from "@/data/matches";
import { cn } from "@/lib/utils";
import { CalendarClock } from "lucide-react";

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-live-pulse flex-shrink-0" />
      LIVE
    </span>
  );
}

function StatusText({ status, text }: { status: MatchStatus; text: string }) {
  if (status === "live") {
    return <span className="text-xs font-semibold text-primary">{text}</span>;
  }
  if (status === "upcoming") {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <CalendarClock className="w-3 h-3 flex-shrink-0" />
        {text}
      </span>
    );
  }
  return <span className="text-xs text-muted-foreground italic">{text}</span>;
}

function TeamRow({ team }: { team: Match["team1"] }) {
  const hasScore = !!team.score;

  return (
    <div className="flex items-center justify-between py-1">
      {/* Left: flag + code */}
      <div className="flex items-center gap-2">
        <span className="text-lg leading-none">{team.flag}</span>
        <span
          className={cn(
            "text-sm font-bold tracking-wide",
            team.isBatting ? "text-primary" : "text-card-foreground",
          )}
        >
          {team.code}
        </span>
      </div>

      {/* Right: score or yet to bat */}
      {hasScore ? (
        <span
          className={cn(
            "text-sm font-bold tabular-nums",
            team.isBatting ? "text-primary" : "text-card-foreground",
          )}
        >
          {team.score}
          {team.overs && (
            <span className="text-xs font-normal text-muted-foreground ml-1">
              ({team.overs} ov)
            </span>
          )}
        </span>
      ) : (
        <span className="text-xs text-muted-foreground italic">Yet to bat</span>
      )}
    </div>
  );
}

function MatchCard({ match }: { match: Match }) {
  return (
    <div
      className={cn(
        "min-w-[300px] md:min-w-0 bg-card rounded-lg flex flex-col overflow-hidden",
        "border border-border/60",
      )}
    >
      <div className="px-3 pt-3 pb-0 flex flex-col gap-0">
        {/* Top row: tournament name + live badge */}
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <span className="text-[12px] font-bold text-card-foreground leading-snug flex-1">
            {match.tournament}
          </span>
          {match.status === "live" && <LiveBadge />}
        </div>

        {/* Subtitle: match stage */}
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2.5">
          {match.stage}
        </p>

        {/* Teams section - no divider, clean spacing */}
        <div className="flex flex-col gap-1.5">
          <TeamRow team={match.team1} />
          <TeamRow team={match.team2} />
        </div>

        {/* Status row */}
        <div className="mt-2.5 mb-2.5">
          <StatusText status={match.status} text={match.statusText} />
        </div>
      </div>

      {/* Card footer */}
      <div className="border-t border-border">
        <div className="flex items-center">
          <button
            type="button"
            className="flex-1 py-2 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors text-center"
          >
            Schedule
          </button>
          <div className="w-px h-4 bg-border" />
          <button
            type="button"
            className="flex-1 py-2 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors text-center"
          >
            Points Table
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedMatches() {
  return (
    <section className="mt-8">
      {/* Section header: title left-aligned, View All on the right */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-primary inline-block" />
          Featured Matches
        </h2>
        <button
          type="button"
          className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View All
        </button>
      </div>

      {/* Mobile: horizontal snap scroll */}
      <div className="md:hidden flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>

      {/* Desktop: grid */}
      <div className="hidden md:grid grid-cols-3 gap-4">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
}
