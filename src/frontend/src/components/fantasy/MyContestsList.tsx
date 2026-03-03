import ContestDetailModal from "@/components/fantasy/ContestDetailModal";
import { useAuth } from "@/context/AuthContext";
import { useFantasy } from "@/context/FantasyContext";
import type { Contest } from "@/data/fantasy";
import { getContestsByMatchId } from "@/data/fantasy";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";
import { useState } from "react";

interface MyContestsListProps {
  matchId: number;
  matchStatus: "upcoming" | "live" | "result";
}

export default function MyContestsList({
  matchId,
  matchStatus,
}: MyContestsListProps) {
  const { isLoggedIn, username } = useAuth();
  const { getUserJoinedContests, predictions, leaderboard, matchCompleted } =
    useFantasy();

  const [viewContest, setViewContest] = useState<Contest | null>(null);

  const contests = getContestsByMatchId(matchId);
  const userJoins = isLoggedIn ? getUserJoinedContests(matchId, username) : [];

  const isCompleted = matchCompleted || matchStatus === "result";

  if (!isLoggedIn) {
    return (
      <div
        data-ocid="mycontests.list"
        className="flex flex-col items-center justify-center py-20 px-6 gap-4"
      >
        <Trophy className="w-12 h-12 text-muted-foreground" />
        <p className="text-base font-semibold text-foreground text-center">
          Login to see your contests
        </p>
      </div>
    );
  }

  if (userJoins.length === 0) {
    return (
      <div
        data-ocid="mycontests.list"
        className="flex flex-col items-center justify-center py-20 px-6 gap-4"
      >
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-2xl">
          🏆
        </div>
        <p className="text-base font-semibold text-foreground text-center">
          No contests joined yet
        </p>
        <p className="text-xs text-muted-foreground text-center">
          Head to the Contests tab to join and win prizes
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        data-ocid="mycontests.list"
        className="px-3 py-4 flex flex-col gap-3"
      >
        <p className="text-sm font-bold text-foreground">
          My Contests ({userJoins.length})
        </p>

        {userJoins.map((jc, i) => {
          const contest = contests.find((c) => c.id === jc.contestId);
          const prediction = predictions.find((p) => p.id === jc.predictionId);

          // Find leaderboard entry for current user
          const myEntry = leaderboard.find((e) => e.username === username);

          return (
            <button
              key={`${jc.contestId}-${jc.predictionId}`}
              type="button"
              data-ocid={`mycontests.item.${i + 1}`}
              onClick={() => {
                if (contest) setViewContest(contest);
              }}
              className={cn(
                "w-full text-left rounded-xl border border-border bg-card",
                "transition-colors hover:bg-muted/20 overflow-hidden",
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 px-4 pt-3.5 pb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground leading-snug truncate">
                    {contest?.name ?? jc.contestId}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {prediction?.teamName ?? "—"}
                  </p>
                </div>

                {/* Status badge */}
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    myEntry ? (
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-xs font-bold text-foreground">
                          Rank #{myEntry.rank}
                        </span>
                        <span className="text-[10px] font-semibold text-amber-500">
                          {myEntry.points} pts
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )
                  ) : (
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        matchStatus === "live"
                          ? "bg-red-500/15 text-red-500 border border-red-500/30"
                          : "bg-blue-500/15 text-blue-500 border border-blue-500/30",
                      )}
                    >
                      {matchStatus === "live" ? "⚡ In Progress" : "Upcoming"}
                    </span>
                  )}
                </div>
              </div>

              {/* Prize row if completed and won */}
              {isCompleted && myEntry?.prize && (
                <div className="px-4 pb-3 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span className="text-xs font-bold text-amber-500">
                    {myEntry.prize}
                  </span>
                </div>
              )}

              {/* Completed bottom row */}
              {isCompleted && !myEntry?.prize && (
                <div className="px-4 pb-3">
                  <span className="text-xs text-muted-foreground">
                    No prize this time
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Detail modal */}
      {viewContest && (
        <ContestDetailModal
          contest={viewContest}
          matchStatus={isCompleted ? "result" : matchStatus}
          onClose={() => setViewContest(null)}
        />
      )}
    </>
  );
}
