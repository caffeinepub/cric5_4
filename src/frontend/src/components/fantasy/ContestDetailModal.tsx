import { useAuth } from "@/context/AuthContext";
import { useFantasy } from "@/context/FantasyContext";
import type { Contest } from "@/data/fantasy";
import { cn } from "@/lib/utils";
import { ShieldCheck, Trophy, Users, X } from "lucide-react";
import { useState } from "react";

interface ContestDetailModalProps {
  contest: Contest;
  matchStatus: "upcoming" | "live" | "result";
  onClose: () => void;
}

function totalPrizePool(contest: Contest): string {
  if (contest.entryType === "free") return "₹16,300";
  if (contest.entryType === "coins") return "₹5,500";
  return "₹2,000";
}

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

// Dummy leaderboard users for visual richness
const DUMMY_USERS = [
  { name: "starfuaxgdqc", team: "T1", avatar: "👤" },
  { name: "voltpi4ubssn", team: "T1", avatar: "👤" },
  { name: "unityiss7zr0", team: "T1", avatar: "👤" },
  { name: "SPORTKING786", team: "T1", avatar: "🧑" },
  { name: "paap12612159", team: "T1", avatar: "👨" },
  { name: "SatrohanRam", team: "T1", avatar: "🙎" },
  { name: "CricMaster99", team: "T1", avatar: "👤" },
  { name: "BlueArmy2024", team: "T1", avatar: "👤" },
];

export default function ContestDetailModal({
  contest,
  matchStatus,
  onClose,
}: ContestDetailModalProps) {
  const { isLoggedIn, username } = useAuth();
  const { joinedContests, predictions, leaderboard, matchCompleted } =
    useFantasy();
  const [activeTab, setActiveTab] = useState<"Leaderboard" | "Winnings">(
    "Leaderboard",
  );

  const userPredictionIds = new Set(
    predictions.filter((p) => p.id.startsWith(username)).map((p) => p.id),
  );
  const myJoins = joinedContests.filter(
    (jc) =>
      jc.contestId === contest.id && userPredictionIds.has(jc.predictionId),
  );
  const hasJoined = myJoins.length > 0;

  const totalJoins = joinedContests.filter(
    (jc) => jc.contestId === contest.id,
  ).length;

  const isCompleted = matchCompleted || matchStatus === "result";
  const pool = totalPrizePool(contest);
  const { cash, product } = topPrizeLabel(contest);
  const winners = contest.prizes.length;

  const spotsLeft = contest.maxParticipants - totalJoins;
  const fillPct = Math.min(100, (totalJoins / contest.maxParticipants) * 100);

  const cardTag =
    contest.entryType === "free"
      ? "Free Contest"
      : contest.entryType === "coins"
        ? "Coins Contest"
        : "Watch & Win";

  // Merge real + dummy for leaderboard display during live/upcoming
  const displayUsers = [
    ...joinedContests
      .filter((jc) => jc.contestId === contest.id)
      .map((jc) => {
        const pred = predictions.find((p) => p.id === jc.predictionId);
        const isMe = userPredictionIds.has(jc.predictionId);
        return {
          name: pred?.teamName ?? "Unknown",
          team: "T1",
          avatar: isMe ? "⭐" : "👤",
          isMe,
          points: null as number | null,
          prize: null as string | null,
        };
      }),
    ...DUMMY_USERS.map((u) => ({
      name: `${u.name} - ${u.team}`,
      team: u.team,
      avatar: u.avatar,
      isMe: false,
      points: null as number | null,
      prize: null as string | null,
    })),
  ];

  // When completed, use real leaderboard data
  const completedLeaderboard = isCompleted
    ? leaderboard.map((entry, _i) => ({
        name: entry.teamName,
        team: "T1",
        avatar: entry.username === username ? "⭐" : "👤",
        isMe: entry.username === username,
        points: entry.points,
        prize: entry.prize ?? null,
        rank: entry.rank,
      }))
    : [];

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: modal backdrop
    <div
      data-ocid="contest.detail.modal"
      className="fixed inset-0 z-[80] bg-black/70 flex items-end sm:items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          "bg-background border border-border w-full sm:max-w-sm",
          "rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto",
        )}
      >
        {/* Back / close button */}
        <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm px-4 pt-3 pb-2 flex items-center gap-2 border-b border-border">
          <button
            type="button"
            data-ocid="contest.detail.close_button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-foreground flex-1 truncate">
            {contest.name}
          </span>
          {hasJoined && isLoggedIn && (
            <span className="text-[10px] font-bold text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full flex-shrink-0">
              Joined ✓
            </span>
          )}
        </div>

        {/* Gradient header */}
        <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-pink-900/20 px-4 pt-3 pb-4">
          {/* Tag */}
          <div className="mb-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {cardTag}
            </span>
          </div>

          {/* Prize pool */}
          <p className="text-2xl font-black text-foreground tracking-tight mb-3">
            {pool}
          </p>

          {/* 1st prize card */}
          <div className="bg-background dark:bg-card rounded-xl border border-border/60 p-3 flex items-center gap-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-8 h-8 bg-amber-500 flex items-center justify-center rounded-br-xl">
              <span className="text-[9px] font-black text-white leading-none text-center">
                1ST
              </span>
            </div>
            <div className="flex-1 pl-5">
              <p className="text-xl font-black text-foreground">{cash}</p>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                Cash Prize
              </p>
            </div>
            {product && (
              <>
                <div className="w-px h-10 bg-border flex-shrink-0" />
                <span className="text-muted-foreground font-bold text-base flex-shrink-0">
                  +
                </span>
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

        {/* Progress bar */}
        <div className="bg-background dark:bg-card px-4 pt-3">
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${fillPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[10px] text-muted-foreground">
              {spotsLeft.toLocaleString()} spots left
            </span>
            <span className="text-[10px] text-muted-foreground">
              {contest.maxParticipants.toLocaleString()} spots
            </span>
          </div>
        </div>

        {/* Badges */}
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
        <div className="bg-amber-50 dark:bg-amber-900/20 border-t border-b border-amber-200 dark:border-amber-800/40 px-4 py-2 flex items-center gap-2">
          <span className="text-base">🏆</span>
          <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
            Top {winners} Rank{winners > 1 ? "s" : ""} Win Cash Prizes
          </span>
        </div>

        {/* Leaderboard / Winnings tab switcher */}
        <div className="flex border-b border-border bg-background">
          {(["Leaderboard", "Winnings"] as const).map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                data-ocid={
                  tab === "Leaderboard"
                    ? "contest.leaderboard.tab"
                    : "contest.winnings.tab"
                }
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-3 text-sm font-semibold transition-all relative",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === "Leaderboard" && (
          <div data-ocid="contest.leaderboard.table">
            {/* Upcoming: locked */}
            {matchStatus === "upcoming" && !matchCompleted && (
              <div className="px-4 py-6 flex flex-col items-center gap-3">
                <p className="text-sm font-semibold text-foreground text-center">
                  {hasJoined
                    ? "Your spot is reserved! 🎯"
                    : "Be the first to join!"}
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  Answers will be revealed when the match begins. Leaderboard
                  updates after the match ends.
                </p>
                {hasJoined && (
                  <div className="w-full flex flex-col gap-2 mt-1">
                    {myJoins.map((jc) => {
                      const pred = predictions.find(
                        (p) => p.id === jc.predictionId,
                      );
                      return (
                        <div
                          key={jc.predictionId}
                          className="flex items-center gap-2 bg-green-500/5 border border-green-500/20 rounded-lg px-3 py-2"
                        >
                          <span className="text-green-500 text-sm">✓</span>
                          <span className="text-xs font-semibold text-foreground">
                            {pred?.teamName ?? "Unknown Team"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Live: show participants without points */}
            {matchStatus === "live" && !matchCompleted && (
              <div>
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/20">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    Teams ({totalJoins + DUMMY_USERS.length})
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    Rank
                  </span>
                </div>
                {displayUsers.slice(0, 12).map((u, i) => (
                  <div
                    key={`${u.name}-${i}`}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 border-b border-border/50",
                      u.isMe && "bg-primary/5",
                    )}
                  >
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-base flex-shrink-0">
                      {u.avatar}
                    </div>
                    <span className="flex-1 text-xs font-semibold text-foreground truncate">
                      {u.name}
                      {u.isMe && (
                        <span className="ml-1.5 text-[10px] text-primary">
                          (You)
                        </span>
                      )}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground flex-shrink-0">
                      #1
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Completed: full ranked leaderboard */}
            {isCompleted && (
              <div>
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/20">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    Teams ({completedLeaderboard.length})
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    Rank
                  </span>
                </div>
                {completedLeaderboard.length > 0 ? (
                  completedLeaderboard.map((entry, i) => {
                    const medal =
                      i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
                    return (
                      <div
                        key={`${entry.name}-${i}`}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 border-b border-border/50",
                          entry.isMe && "bg-primary/5",
                          i < 3 && "bg-amber-50/50 dark:bg-amber-900/10",
                        )}
                      >
                        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-base flex-shrink-0">
                          {entry.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {entry.name}
                            {entry.isMe && (
                              <span className="ml-1.5 text-[10px] text-primary">
                                (You)
                              </span>
                            )}
                          </p>
                          {entry.prize && (
                            <p className="text-[10px] text-green-600 dark:text-green-400 font-semibold mt-0.5">
                              🏆 {entry.prize}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end flex-shrink-0 gap-0.5">
                          <span className="text-xs font-bold text-foreground">
                            {entry.points} pts
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {medal ?? `#${entry.rank}`}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 py-8 text-center">
                    <p className="text-xs text-muted-foreground">
                      Leaderboard not yet available
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "Winnings" && (
          <div data-ocid="contest.winnings.table" className="px-4 py-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
              Prize Distribution
            </p>
            <div className="rounded-xl border border-border overflow-hidden">
              {contest.prizes.map((p, i) => {
                const medal =
                  p.rank === 1
                    ? "🥇"
                    : p.rank === 2
                      ? "🥈"
                      : p.rank === 3
                        ? "🥉"
                        : null;
                return (
                  <div
                    key={p.rank}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3",
                      i > 0 && "border-t border-border/50",
                      i === 0 && "bg-amber-50/60 dark:bg-amber-900/10",
                    )}
                  >
                    <span className="w-6 text-base flex-shrink-0">
                      {medal ?? (
                        <span className="text-xs text-muted-foreground font-semibold">
                          {p.rank}
                        </span>
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-sm flex-1 font-medium",
                        i === 0
                          ? "text-amber-600 dark:text-amber-400 font-bold"
                          : "text-foreground",
                      )}
                    >
                      {p.prize}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Rank #{p.rank}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="pb-6 sm:pb-2" />
      </div>
    </div>
  );
}
