import { useAuth } from "@/context/AuthContext";
import { useFantasy } from "@/context/FantasyContext";
import type { Contest } from "@/data/fantasy";
import { cn } from "@/lib/utils";
import { ShieldCheck, Trophy, Users } from "lucide-react";

interface ContestCardProps {
  contest: Contest;
  index: number;
  matchStatus: "upcoming" | "live" | "result";
  onJoin: (contest: Contest) => void;
  onView: (contest: Contest) => void;
}

/** Compute a fake "total prize pool" number from the contest prizes */
function totalPrizePool(contest: Contest): string {
  // For the free contest show a large pool, coins show medium, video show small
  if (contest.entryType === "free") return "₹16,300";
  if (contest.entryType === "coins") return "₹5,500";
  return "₹2,000";
}

/** Top prize label */
function topPrizeLabel(contest: Contest): {
  cash: string;
  product: string | null;
} {
  const top = contest.prizes[0];
  if (!top) return { cash: "—", product: null };
  if (top.prizeType === "voucher")
    return { cash: "₹1,000", product: "LG AI Smart TV" };
  return { cash: top.prize, product: null };
}

/** Winner count */
function winnersCount(contest: Contest): number {
  return contest.prizes.length;
}

export default function ContestCard({
  contest,
  index,
  matchStatus,
  onJoin,
  onView,
}: ContestCardProps) {
  const { isLoggedIn, username } = useAuth();
  const { joinedContests, predictions } = useFantasy();

  const userPredictionIds = new Set(
    predictions.filter((p) => p.id.startsWith(username)).map((p) => p.id),
  );
  const hasJoined = joinedContests.some(
    (jc) =>
      jc.contestId === contest.id && userPredictionIds.has(jc.predictionId),
  );

  const totalJoins = joinedContests.filter(
    (jc) => jc.contestId === contest.id,
  ).length;

  const isUpcoming = matchStatus === "upcoming";
  const pool = totalPrizePool(contest);
  const { cash, product } = topPrizeLabel(contest);
  const winners = winnersCount(contest);

  // Spots info
  const spotsLeft = contest.maxParticipants - totalJoins;
  const spotsTotal = contest.maxParticipants;
  const fillPct = Math.min(100, (totalJoins / spotsTotal) * 100);

  // Entry button label / color
  function entryButton() {
    if (contest.entryType === "free") {
      return {
        label: "Free",
        className: "bg-green-500 text-white hover:bg-green-600",
      };
    }
    if (contest.entryType === "coins") {
      return {
        label: `🪙 ${contest.coinCost}`,
        className: "bg-amber-500 text-white hover:bg-amber-600",
      };
    }
    return {
      label: "Watch Ad",
      className: "bg-blue-500 text-white hover:bg-blue-600",
    };
  }

  const btn = entryButton();

  // Label tag for the card header
  const cardTag =
    contest.entryType === "free"
      ? "Free Contest"
      : contest.entryType === "coins"
        ? "Coins Contest"
        : "Watch & Win";

  return (
    <button
      type="button"
      data-ocid={`contest.card.${index}`}
      onClick={() => onView(contest)}
      className="w-full text-left overflow-hidden rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Gradient header area */}
      <div className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-pink-900/20 px-4 pt-3 pb-4">
        {/* Tag label */}
        <div className="mb-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            {cardTag}
          </span>
        </div>

        {/* Prize pool + join button row */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-black text-foreground tracking-tight">
              {pool}
            </span>
            <span className="text-muted-foreground text-base mt-1">›</span>
          </div>
          {isLoggedIn && isUpcoming ? (
            hasJoined ? (
              <span className="text-xs font-bold text-green-600 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
                Joined ✓
              </span>
            ) : (
              <button
                type="button"
                data-ocid={`contest.join.button.${index}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onJoin(contest);
                }}
                className={cn(
                  "text-sm font-bold px-5 py-2 rounded-lg transition-colors",
                  btn.className,
                )}
              >
                {btn.label}
              </button>
            )
          ) : !isLoggedIn && isUpcoming ? (
            <button
              type="button"
              data-ocid={`contest.join.button.${index}`}
              onClick={(e) => {
                e.stopPropagation();
                onJoin(contest);
              }}
              className={cn(
                "text-sm font-bold px-5 py-2 rounded-lg transition-colors",
                btn.className,
              )}
            >
              {btn.label}
            </button>
          ) : (
            <span className="text-xs font-semibold text-muted-foreground bg-muted/60 rounded-lg px-4 py-2">
              View
            </span>
          )}
        </div>

        {/* 1st prize card */}
        <div className="bg-background dark:bg-card rounded-xl border border-border/60 p-3 flex items-center gap-3 relative overflow-hidden">
          {/* 1ST badge */}
          <div className="absolute top-0 left-0 w-8 h-8 bg-amber-500 flex items-center justify-center rounded-br-xl">
            <span className="text-[9px] font-black text-white leading-none text-center">
              1ST
            </span>
          </div>

          {/* Cash prize */}
          <div className="flex-1 pl-5">
            <p className="text-xl font-black text-foreground">{cash}</p>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
              Cash Prize
            </p>
          </div>

          {/* Plus divider */}
          {product && (
            <>
              <div className="w-px h-10 bg-border flex-shrink-0" />
              <span className="text-muted-foreground font-bold text-base flex-shrink-0">
                +
              </span>
              {/* Product */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="w-14 h-10 bg-muted rounded-lg flex items-center justify-center text-2xl">
                  📺
                </div>
                <p className="text-[9px] font-semibold text-foreground text-center leading-tight max-w-[60px]">
                  {product}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Spots progress bar */}
      <div className="bg-background dark:bg-card px-4 pt-3">
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all"
            style={{ width: `${fillPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] text-muted-foreground font-medium">
            {spotsLeft.toLocaleString()} spots left
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">
            {spotsTotal.toLocaleString()} spots
          </span>
        </div>
      </div>

      {/* Badges row */}
      <div className="bg-background dark:bg-card px-4 py-2.5 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground font-medium">
            Upto 20
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Trophy className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground font-medium">
            {winners} {winners === 1 ? "Winner" : "Winners"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-blue-500" />
          <span className="text-[10px] text-blue-500 font-medium">
            100% Guaranteed
          </span>
        </div>
      </div>

      {/* Golden banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-800/40 px-4 py-2 flex items-center gap-2">
        <span className="text-base">🏆</span>
        <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
          Top {winners} Rank{winners > 1 ? "s" : ""} Win Cash Prizes
        </span>
      </div>
    </button>
  );
}
