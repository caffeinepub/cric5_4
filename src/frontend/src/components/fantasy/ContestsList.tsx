import ContestCard from "@/components/fantasy/ContestCard";
import ContestDetailModal from "@/components/fantasy/ContestDetailModal";
import JoinContestModal from "@/components/fantasy/JoinContestModal";
import { useAuth } from "@/context/AuthContext";
import type { Contest } from "@/data/fantasy";
import { getContestsByMatchId } from "@/data/fantasy";
import { LogIn } from "lucide-react";
import { useState } from "react";

interface ContestsListProps {
  matchId: number;
  matchStatus: "upcoming" | "live" | "result";
  onLoginRequest?: () => void;
}

export default function ContestsList({
  matchId,
  matchStatus,
  onLoginRequest,
}: ContestsListProps) {
  const { isLoggedIn } = useAuth();
  const contests = getContestsByMatchId(matchId);

  const [joinContest, setJoinContest] = useState<Contest | null>(null);
  const [viewContest, setViewContest] = useState<Contest | null>(null);

  const handleJoin = (contest: Contest) => {
    if (!isLoggedIn && onLoginRequest) {
      onLoginRequest();
      return;
    }
    setJoinContest(contest);
  };

  const handleView = (contest: Contest) => {
    setViewContest(contest);
  };

  return (
    <>
      <div data-ocid="contests.list" className="px-3 py-4 flex flex-col gap-3">
        {/* Login banner */}
        {!isLoggedIn && (
          <div className="flex items-center gap-3 bg-primary/8 border border-primary/20 rounded-xl px-4 py-3">
            <LogIn className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">
                Login to join contests
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Predict match outcomes and win prizes
              </p>
            </div>
            {onLoginRequest && (
              <button
                type="button"
                data-ocid="contests.login.button"
                onClick={onLoginRequest}
                className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Login
              </button>
            )}
          </div>
        )}

        {/* Contest cards */}
        {contests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <p className="text-4xl">🏆</p>
            <p className="text-sm font-semibold text-foreground">
              No contests available
            </p>
          </div>
        ) : (
          contests.map((contest, i) => (
            <ContestCard
              key={contest.id}
              contest={contest}
              index={i + 1}
              matchStatus={matchStatus}
              onJoin={handleJoin}
              onView={handleView}
            />
          ))
        )}
      </div>

      {/* Join modal */}
      {joinContest && (
        <JoinContestModal
          contest={joinContest}
          matchId={matchId}
          onClose={() => setJoinContest(null)}
        />
      )}

      {/* Detail modal */}
      {viewContest && (
        <ContestDetailModal
          contest={viewContest}
          matchStatus={matchStatus}
          onClose={() => setViewContest(null)}
        />
      )}
    </>
  );
}
