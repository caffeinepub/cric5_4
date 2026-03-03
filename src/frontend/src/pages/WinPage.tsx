import LoginModal from "@/components/auth/LoginModal";
import { useAuth } from "@/context/AuthContext";
import { useFantasy } from "@/context/FantasyContext";
import { getContestsByMatchId } from "@/data/fantasy";
import { cn } from "@/lib/utils";
import { LogIn, Trophy } from "lucide-react";
import { useState } from "react";

export default function WinPage() {
  const { isLoggedIn, username } = useAuth();
  const { getUserJoinedContests, predictions, matchCompleted } = useFantasy();
  const [loginOpen, setLoginOpen] = useState(false);

  const contests = getContestsByMatchId(999);

  const userJoins = isLoggedIn ? getUserJoinedContests(999, username) : [];

  const recentJoins = userJoins.slice(0, 5);

  return (
    <div className="min-h-screen pb-24">
      {/* Header section */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-foreground">Win</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Predict match outcomes and win prizes
        </p>
      </div>

      {!isLoggedIn ? (
        /* Login CTA */
        <div className="px-4 py-6">
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Join Contests &amp; Win Prizes
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Sign in to participate in fantasy contests, make predictions,
                and compete for exciting prizes including ₹500 Amazon vouchers
                and super coins.
              </p>
            </div>

            {/* Prize highlights */}
            <div className="w-full flex flex-col gap-2">
              {[
                {
                  icon: "🥇",
                  label: "1st Place",
                  prize: "₹500 Amazon Voucher",
                },
                { icon: "🥈", label: "2nd Place", prize: "50 Super Coins" },
                { icon: "🥉", label: "3rd Place", prize: "25 Super Coins" },
              ].map((p) => (
                <div
                  key={p.label}
                  className="flex items-center gap-3 bg-muted/30 rounded-xl px-4 py-2.5"
                >
                  <span className="text-xl flex-shrink-0">{p.icon}</span>
                  <span className="text-sm text-muted-foreground flex-1">
                    {p.label}
                  </span>
                  <span className="text-sm font-bold text-amber-500">
                    {p.prize}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setLoginOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
            >
              <LogIn className="w-4 h-4" />
              Login to Join Contests
            </button>
          </div>

          {/* Available contests */}
          <div className="mt-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
              Active Contests
            </p>
            <div className="flex flex-col gap-3">
              {contests.map((contest) => (
                <div
                  key={contest.id}
                  className="rounded-xl border border-border bg-card px-4 py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {contest.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      IND vs AUS · ICC Champions Trophy Final
                    </p>
                  </div>
                  {contest.entryType === "free" && (
                    <span className="text-[10px] font-bold text-green-500 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5 flex-shrink-0">
                      FREE
                    </span>
                  )}
                  {contest.entryType === "coins" && (
                    <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5 flex-shrink-0">
                      🪙 {contest.coinCost}
                    </span>
                  )}
                  {contest.entryType === "video" && (
                    <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 border border-blue-500/20 rounded-full px-2 py-0.5 flex-shrink-0">
                      WATCH AD
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Logged in: show joined contests summary */
        <div className="px-4 flex flex-col gap-4">
          {/* User summary card */}
          <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🏆</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground">
                Welcome, {username}!
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {userJoins.length === 0
                  ? "You haven't joined any contests yet"
                  : `${userJoins.length} contest${userJoins.length > 1 ? "s" : ""} joined`}
              </p>
            </div>
          </div>

          {/* Available contests */}
          {recentJoins.length === 0 && (
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
                Available Contests
              </p>
              <div className="flex flex-col gap-3">
                {contests.map((contest) => (
                  <div
                    key={contest.id}
                    className="rounded-xl border border-border bg-card px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-foreground truncate flex-1">
                        {contest.name}
                      </p>
                      {contest.entryType === "free" && (
                        <span className="text-[10px] font-bold text-green-500 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5 flex-shrink-0">
                          FREE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      IND vs AUS · ICC Champions Trophy Final
                    </p>
                    <p className="text-xs text-amber-500 font-semibold mt-1">
                      🏆 {contest.prizes[0]?.prize}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-4">
                Go to Matches → IND vs AUS to join contests
              </p>
            </div>
          )}

          {/* Joined contests */}
          {recentJoins.length > 0 && (
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
                My Recent Contests
              </p>
              <div className="flex flex-col gap-2">
                {recentJoins.map((jc, i) => {
                  const contest = contests.find((c) => c.id === jc.contestId);
                  const prediction = predictions.find(
                    (p) => p.id === jc.predictionId,
                  );
                  return (
                    <div
                      key={`${jc.contestId}-${jc.predictionId}`}
                      className={cn(
                        "rounded-xl border border-border bg-card px-4 py-3 flex items-center justify-between gap-3",
                        i === 0 && "border-primary/30",
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {contest?.name ?? jc.contestId}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {prediction?.teamName ?? "—"} · IND vs AUS
                        </p>
                      </div>
                      {matchCompleted ? (
                        <span className="text-[10px] font-bold text-green-500 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5 flex-shrink-0">
                          Completed
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 border border-blue-500/20 rounded-full px-2 py-0.5 flex-shrink-0">
                          In Progress
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground pb-4 px-3">
        <p>
          © {new Date().getFullYear()}{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            Built with ♥ using caffeine.ai
          </a>
        </p>
      </footer>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
