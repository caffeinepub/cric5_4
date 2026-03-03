import LoginModal from "@/components/auth/LoginModal";
import PredictAndWin from "@/components/fantasy/PredictAndWin";
import { useFantasy } from "@/context/FantasyContext";
import {
  type BallEntry,
  type CommentaryEntry,
  type MatchDetail,
  getMatchDetail,
} from "@/data/matchDetails";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Clock, CloudRain, MessageSquare } from "lucide-react";
import { useRef, useState } from "react";

// ── Tab configurations ─────────────────────────────────────────────────────────
const LIVE_TABS = [
  "Info",
  "Live",
  "Scorecard",
  "Predict & Win",
  "News",
  "Stats",
];
const UPCOMING_TABS = ["Info", "Summary", "Predict & Win", "News", "Stats"];
const COMPLETED_TABS = [
  "Info",
  "Summary",
  "Scorecard",
  "Predict & Win",
  "Winners",
  "News",
  "Stats",
];

function getTabsForStatus(status: MatchDetail["status"]): string[] {
  if (status === "live") return LIVE_TABS;
  if (status === "upcoming") return UPCOMING_TABS;
  return COMPLETED_TABS;
}

function getDefaultTab(status: MatchDetail["status"]): string {
  if (status === "live") return "Live";
  if (status === "upcoming") return "Predict & Win";
  return "Summary";
}

// ── Ball indicator ─────────────────────────────────────────────────────────────
function BallCircle({ ball }: { ball: BallEntry }) {
  const base =
    "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0";
  const styles: Record<string, string> = {
    four: "bg-blue-500 text-white",
    six: "bg-yellow-500 text-white",
    wicket: "bg-red-500 text-white",
    wide: "bg-orange-400 text-white",
    noball: "bg-purple-500 text-white",
    normal:
      ball.value === "0"
        ? "bg-muted text-muted-foreground"
        : "bg-muted/60 text-foreground",
  };
  return (
    <div className={cn(base, styles[ball.type] ?? styles.normal)}>
      {ball.value}
    </div>
  );
}

// ── Live stat bar ──────────────────────────────────────────────────────────────
function LiveStatBar({
  crr,
  rrr,
  last5,
}: { crr: string; rrr: string; last5: string }) {
  return (
    <div className="mx-3 mb-3 rounded-lg overflow-hidden border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20">
      <div className="flex items-center divide-x divide-red-200 dark:divide-red-900/40">
        {/* LIVE badge */}
        <div className="flex items-center gap-1.5 px-3 py-3 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-live-pulse" />
          <span className="text-xs font-bold text-red-500 tracking-wider">
            LIVE
          </span>
        </div>

        {/* CRR */}
        <div className="flex-1 flex flex-col items-center py-2 px-2">
          <span className="text-[10px] text-muted-foreground font-medium mb-0.5">
            CRR
          </span>
          <span className="text-sm font-bold text-foreground">{crr}</span>
        </div>

        {/* RRR */}
        <div className="flex-1 flex flex-col items-center py-2 px-2">
          <span className="text-[10px] text-muted-foreground font-medium mb-0.5">
            RRR
          </span>
          <span className="text-sm font-bold text-red-500">{rrr}</span>
        </div>

        {/* Last 5 */}
        <div className="flex-1 flex flex-col items-center py-2 px-2">
          <span className="text-[10px] text-muted-foreground font-medium mb-0.5">
            Last 5
          </span>
          <span className="text-sm font-bold text-foreground">{last5}</span>
        </div>
      </div>
    </div>
  );
}

// ── Recent Balls card (single horizontal scrolling line) ──────────────────────
function RecentBallsCard({ match }: { match: MatchDetail }) {
  if (!match.liveStats) return null;
  const { recentBalls } = match.liveStats;

  return (
    <div className="mx-3 mb-3 rounded-lg border border-border bg-card px-3 pt-2.5 pb-3">
      <p className="text-[10px] font-bold tracking-widest text-muted-foreground mb-2.5 uppercase">
        Recent Balls
      </p>
      <div
        className="flex items-center gap-2 overflow-x-auto scrollbar-hide"
        data-no-swipe="true"
      >
        {recentBalls.map((overGroup, gi) => (
          <div
            key={overGroup.over}
            className={cn(
              "flex items-center gap-1.5 flex-shrink-0",
              gi > 0 && "pl-2 border-l border-border",
            )}
          >
            <span className="text-[10px] text-muted-foreground flex-shrink-0 mr-0.5">
              {overGroup.over}
            </span>
            {overGroup.balls.map((ball, bi) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static sequence
              <BallCircle key={bi} ball={ball} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Current Batters card ───────────────────────────────────────────────────────
function CurrentBattersCard({ match }: { match: MatchDetail }) {
  if (!match.liveStats) return null;
  const activeBatters = match.liveStats.batting.filter(
    (b) => b.status === "batting",
  );
  if (activeBatters.length === 0) return null;

  return (
    <div className="mx-3 mb-3 rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-3 pt-2.5 pb-2 border-b border-border">
        <span className="text-base">{match.team1.flag}</span>
        <span className="text-xs font-bold tracking-wide text-foreground uppercase">
          Current Batters
        </span>
      </div>
      <div className="flex items-center px-3 py-1.5">
        <span className="flex-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
          Batter
        </span>
        {["R", "B", "4s", "6s", "SR"].map((h) => (
          <span
            key={h}
            className="w-8 text-center text-[10px] font-medium text-muted-foreground uppercase tracking-wide flex-shrink-0"
          >
            {h}
          </span>
        ))}
      </div>
      {activeBatters.map((batter, i) => {
        const statVals = [
          batter.r,
          batter.b,
          batter.fours,
          batter.sixes,
          batter.sr,
        ];
        const statKeys = ["r", "b", "4s", "6s", "sr"] as const;
        return (
          <div
            key={batter.name}
            className={cn(
              "flex items-center px-3 py-2",
              i % 2 === 0 ? "bg-transparent" : "bg-muted/20",
            )}
          >
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-xs font-bold text-foreground truncate flex items-center gap-1.5">
                {batter.name}
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
              </p>
            </div>
            {statVals.map((val, vi) => (
              <span
                key={statKeys[vi]}
                className={cn(
                  "w-8 text-center text-xs flex-shrink-0",
                  vi === 0 ? "font-bold text-red-500" : "text-muted-foreground",
                )}
              >
                {val}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ── Current Bowler card ────────────────────────────────────────────────────────
function CurrentBowlerCard({ match }: { match: MatchDetail }) {
  if (!match.liveStats?.currentBowler) return null;
  const bowler = match.liveStats.currentBowler;

  return (
    <div className="mx-3 mb-3 rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-3 pt-2.5 pb-2 border-b border-border">
        <span className="text-base">{match.team2.flag}</span>
        <span className="text-xs font-bold tracking-wide text-foreground uppercase">
          Current Bowler
        </span>
      </div>
      <div className="flex items-center px-3 py-1.5">
        <span className="flex-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
          Bowler
        </span>
        {["O", "M", "R", "W", "ECON"].map((h) => (
          <span
            key={h}
            className="w-9 text-center text-[10px] font-medium text-muted-foreground uppercase tracking-wide flex-shrink-0"
          >
            {h}
          </span>
        ))}
      </div>
      <div className="flex items-center px-3 py-2.5">
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-xs font-bold text-foreground truncate flex items-center gap-1.5">
            {bowler.name}
            <span className="text-[10px] text-red-500 font-semibold">
              ★ bowling
            </span>
          </p>
        </div>
        {[bowler.o, bowler.m, bowler.r, bowler.w, bowler.econ].map(
          (val, vi) => (
            <span
              key={vi.toString()}
              className={cn(
                "w-9 text-center text-xs flex-shrink-0",
                vi === 3 && Number(val) > 0
                  ? "font-bold text-red-500"
                  : "text-muted-foreground",
              )}
            >
              {val}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

// ── Commentary card ────────────────────────────────────────────────────────────
function CommentaryCard({ match }: { match: MatchDetail }) {
  if (!match.liveStats?.commentary || match.liveStats.commentary.length === 0)
    return null;
  const { commentary } = match.liveStats;

  const highlightColor: Record<
    NonNullable<CommentaryEntry["highlight"]>,
    string
  > = {
    wicket: "border-red-500 bg-red-500/5",
    four: "border-blue-500 bg-blue-500/5",
    six: "border-yellow-500 bg-yellow-500/5",
    wide: "border-orange-400 bg-orange-400/5",
    noball: "border-purple-500 bg-purple-500/5",
  };

  const highlightBadge: Record<
    NonNullable<CommentaryEntry["highlight"]>,
    string
  > = {
    wicket: "bg-red-500 text-white",
    four: "bg-blue-500 text-white",
    six: "bg-yellow-500 text-black",
    wide: "bg-orange-400 text-white",
    noball: "bg-purple-500 text-white",
  };

  return (
    <div className="mx-3 mb-3 rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-3 pt-2.5 pb-2 border-b border-border">
        <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-bold tracking-wide text-foreground uppercase">
          Commentary
        </span>
      </div>
      <div className="divide-y divide-border">
        {commentary.map((entry, i) => (
          <div
            key={i.toString()}
            className={cn(
              "px-3 py-2.5 flex items-start gap-2.5",
              entry.highlight ? highlightColor[entry.highlight] : "",
            )}
          >
            <span className="text-[10px] text-muted-foreground font-mono w-8 flex-shrink-0 pt-0.5">
              {entry.over}
            </span>
            {entry.highlight && (
              <span
                className={cn(
                  "text-[9px] font-black px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 uppercase tracking-wider",
                  highlightBadge[entry.highlight],
                )}
              >
                {entry.highlight === "noball"
                  ? "NB"
                  : entry.highlight.toUpperCase()}
              </span>
            )}
            <p className="text-xs text-foreground leading-relaxed flex-1">
              {entry.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Batting table card ─────────────────────────────────────────────────────────
function BattingCard({ match }: { match: MatchDetail }) {
  if (!match.liveStats) return null;
  const { batting } = match.liveStats;
  const { team1 } = match;

  return (
    <div className="mx-3 mb-3 rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 pt-3 pb-2 border-b border-border">
        <span className="text-base">{team1.flag}</span>
        <span className="text-xs font-bold tracking-wide text-foreground uppercase">
          {team1.code} Batting
        </span>
      </div>

      {/* Column headers */}
      <div className="flex items-center px-3 py-1.5">
        <span className="flex-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
          Batter
        </span>
        {["R", "B", "4s", "6s", "SR"].map((h) => (
          <span
            key={h}
            className="w-8 text-center text-[10px] font-medium text-muted-foreground uppercase tracking-wide flex-shrink-0"
          >
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      {batting.map((batter, i) => {
        const isBatting = batter.status === "batting";
        const statKeys = ["r", "b", "4s", "6s", "sr"] as const;
        const statVals = [
          batter.r,
          batter.b,
          batter.fours,
          batter.sixes,
          batter.sr,
        ];
        return (
          <div
            key={batter.name}
            className={cn(
              "flex items-start px-3 py-2",
              i % 2 === 0 ? "bg-transparent" : "bg-muted/20",
            )}
          >
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-xs font-semibold text-foreground truncate">
                {batter.name}
              </p>
              <p
                className={cn(
                  "text-[10px] mt-0.5 truncate",
                  isBatting
                    ? "text-green-500 font-medium"
                    : "text-muted-foreground",
                )}
              >
                {batter.status}
              </p>
            </div>
            {statVals.map((val, vi) => (
              <span
                key={statKeys[vi]}
                className={cn(
                  "w-8 text-center text-xs flex-shrink-0",
                  vi === 0
                    ? "font-bold text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {val}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ── Bowling table card ─────────────────────────────────────────────────────────
function BowlingCard({ match }: { match: MatchDetail }) {
  if (!match.liveStats) return null;
  const { bowling } = match.liveStats;
  const { team2 } = match;

  return (
    <div className="mx-3 mb-3 rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-3 pt-3 pb-2 border-b border-border">
        <span className="text-base">{team2.flag}</span>
        <span className="text-xs font-bold tracking-wide text-foreground uppercase">
          {team2.code} Bowling
        </span>
      </div>

      <div className="flex items-center px-3 py-1.5">
        <span className="flex-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
          Bowler
        </span>
        {["O", "M", "R", "W", "ECON"].map((h) => (
          <span
            key={h}
            className="w-9 text-center text-[10px] font-medium text-muted-foreground uppercase tracking-wide flex-shrink-0"
          >
            {h}
          </span>
        ))}
      </div>

      {bowling.map((bowler, i) => {
        const bKeys = ["o", "m", "r", "w", "econ"] as const;
        const bVals = [bowler.o, bowler.m, bowler.r, bowler.w, bowler.econ];
        return (
          <div
            key={bowler.name}
            className={cn(
              "flex items-center px-3 py-2",
              i % 2 === 0 ? "bg-transparent" : "bg-muted/20",
            )}
          >
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-xs font-semibold text-foreground truncate">
                {bowler.name}
                {bowler.isBowling && (
                  <span className="text-primary ml-1">*</span>
                )}
              </p>
            </div>
            {bVals.map((val, vi) => (
              <span
                key={bKeys[vi]}
                className={cn(
                  "w-9 text-center text-xs flex-shrink-0",
                  vi === 3 && Number(val) > 0
                    ? "font-bold text-red-500"
                    : "text-muted-foreground",
                )}
              >
                {val}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ── Partnership + Last Wicket card ─────────────────────────────────────────────
function PartnershipCard({ match }: { match: MatchDetail }) {
  if (!match.liveStats) return null;
  const { partnership, lastWicket } = match.liveStats;

  return (
    <div className="mx-3 mb-3 rounded-lg border border-border bg-card overflow-hidden">
      {/* Partnership */}
      <div className="px-3 py-3">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">
          Current Partnership
        </p>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">
            {partnership.batters}
          </p>
          <div className="flex items-baseline gap-1 flex-shrink-0">
            <span className="text-base font-bold text-foreground">
              {partnership.runs}
            </span>
            <span className="text-xs text-muted-foreground">
              ({partnership.balls} balls · {partnership.overs} ov)
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border mx-3" />

      {/* Last wicket */}
      <div className="px-3 py-3">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">
          Last Wicket
        </p>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {lastWicket.player}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lastWicket.dismissal}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-bold text-foreground">
              {lastWicket.score}
            </p>
            <p className="text-xs text-muted-foreground">
              Ov {lastWicket.over}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab content renderers ──────────────────────────────────────────────────────

function InfoContent({ match }: { match: MatchDetail }) {
  const rows = [
    { label: "Venue", value: match.info.venue },
    { label: "City", value: match.info.city },
    { label: "Date & Time", value: match.info.date },
    { label: "Format", value: match.info.format },
    { label: "Toss", value: match.info.toss },
    { label: "Umpires", value: match.info.umpires },
    { label: "Match Referee", value: match.info.matchReferee },
  ];

  return (
    <div className="mx-3 my-3 rounded-lg border border-border bg-card overflow-hidden">
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={cn(
            "flex items-start gap-3 px-4 py-3",
            i > 0 && "border-t border-border",
          )}
        >
          <span className="text-xs text-muted-foreground w-24 flex-shrink-0 pt-0.5 font-medium">
            {row.label}
          </span>
          <span className="text-xs text-foreground font-semibold flex-1">
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function LiveContent({ match }: { match: MatchDetail }) {
  if (!match.liveStats) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground text-sm">Live data not available</p>
      </div>
    );
  }
  return (
    <div className="pt-3">
      <LiveStatBar
        crr={match.liveStats.crr}
        rrr={match.liveStats.rrr}
        last5={match.liveStats.last5}
      />
      <RecentBallsCard match={match} />
      <CurrentBattersCard match={match} />
      <CurrentBowlerCard match={match} />
      <BattingCard match={match} />
      <BowlingCard match={match} />
      <PartnershipCard match={match} />
      <CommentaryCard match={match} />
    </div>
  );
}

function ScorecardContent({ match }: { match: MatchDetail }) {
  if (!match.scorecard) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground text-sm">Scorecard not available</p>
      </div>
    );
  }

  return (
    <div className="pt-3">
      {match.scorecard.innings.map((inning, idx) => (
        <div key={inning.team} className="mb-4">
          {/* Innings header */}
          <div className="flex items-center gap-2 px-3 mb-2">
            <span className="text-base">{inning.flag}</span>
            <div>
              <p className="text-xs font-bold text-foreground">
                {idx + 1 === 1 ? "1st" : "2nd"} Innings &mdash; {inning.team}
              </p>
              <p className="text-xs text-muted-foreground">
                {inning.total} ({inning.overs} ov)
              </p>
            </div>
          </div>

          {/* Batting table */}
          <div className="mx-3 mb-3 rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center px-3 py-2 border-b border-border">
              <span className="flex-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                Batter
              </span>
              {["R", "B", "4s", "6s", "SR"].map((h) => (
                <span
                  key={h}
                  className="w-8 text-center text-[10px] font-bold text-muted-foreground uppercase flex-shrink-0"
                >
                  {h}
                </span>
              ))}
            </div>
            {inning.batters.map((b, i) => {
              const bsKeys = ["r", "b", "4s", "6s", "sr"] as const;
              const bsVals = [b.r, b.b, b.fours, b.sixes, b.sr];
              return (
                <div
                  key={b.name}
                  className={cn(
                    "flex items-start px-3 py-2",
                    i % 2 === 0 ? "bg-transparent" : "bg-muted/20",
                  )}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {b.name}
                    </p>
                    <p
                      className={cn(
                        "text-[10px] mt-0.5 truncate",
                        b.dismissal === "batting" || b.dismissal === "not out"
                          ? "text-green-500"
                          : "text-muted-foreground",
                      )}
                    >
                      {b.dismissal}
                    </p>
                  </div>
                  {bsVals.map((val, vi) => (
                    <span
                      key={bsKeys[vi]}
                      className={cn(
                        "w-8 text-center text-xs flex-shrink-0",
                        vi === 0
                          ? "font-bold text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {val}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Bowling table */}
          <div className="mx-3 mb-3 rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center px-3 py-2 border-b border-border">
              <span className="flex-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                Bowler
              </span>
              {["O", "M", "R", "W", "ECON"].map((h) => (
                <span
                  key={h}
                  className="w-9 text-center text-[10px] font-bold text-muted-foreground uppercase flex-shrink-0"
                >
                  {h}
                </span>
              ))}
            </div>
            {inning.bowlers.map((b, i) => {
              const blKeys = ["o", "m", "r", "w", "econ"] as const;
              const blVals = [b.o, b.m, b.r, b.w, b.econ];
              return (
                <div
                  key={b.name}
                  className={cn(
                    "flex items-center px-3 py-2",
                    i % 2 === 0 ? "bg-transparent" : "bg-muted/20",
                  )}
                >
                  <p className="flex-1 text-xs font-semibold text-foreground truncate pr-2">
                    {b.name}
                  </p>
                  {blVals.map((val, vi) => (
                    <span
                      key={blKeys[vi]}
                      className={cn(
                        "w-9 text-center text-xs flex-shrink-0",
                        vi === 3 && Number(val) > 0
                          ? "font-bold text-red-500"
                          : "text-muted-foreground",
                      )}
                    >
                      {val}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function SummaryContent({ match }: { match: MatchDetail }) {
  if (!match.summary) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground text-sm">Summary not available</p>
      </div>
    );
  }

  return (
    <div className="pt-3">
      {/* Highlights */}
      <div className="mx-3 mb-3 rounded-lg border border-border bg-card p-4">
        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3">
          Match Highlights
        </p>
        <ul className="space-y-2">
          {match.summary.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
              <span className="text-sm text-foreground leading-snug">{h}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Top Performers */}
      <div className="px-3 mb-2">
        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-2">
          Top Performers
        </p>
      </div>
      {match.summary.topPerformers.map((p) => (
        <div
          key={p.name}
          className="mx-3 mb-2 rounded-lg border border-border bg-card px-4 py-3 flex items-start justify-between gap-3"
        >
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground truncate">
              {p.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{p.team}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs font-semibold text-primary">{p.stat}</p>
            <p className="text-xs text-foreground mt-0.5">{p.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function WinnersContent({ match }: { match: MatchDetail }) {
  if (!match.winners || match.winners.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground text-sm">
          No winners data available
        </p>
      </div>
    );
  }

  return (
    <div className="pt-3">
      <div className="mx-3 mb-3 rounded-lg border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center px-4 py-3 border-b border-border">
          <span className="w-8 text-[10px] font-bold text-muted-foreground uppercase flex-shrink-0">
            #
          </span>
          <span className="flex-1 text-[10px] font-bold text-muted-foreground uppercase">
            Player
          </span>
          <span className="w-14 text-center text-[10px] font-bold text-muted-foreground uppercase flex-shrink-0">
            Points
          </span>
          <span className="w-16 text-right text-[10px] font-bold text-muted-foreground uppercase flex-shrink-0">
            Prize
          </span>
        </div>

        {match.winners.map((winner, i) => (
          <div
            key={winner.name}
            className={cn(
              "flex items-center px-4 py-3",
              i > 0 && "border-t border-border",
              i < 3 && "bg-yellow-50/50 dark:bg-yellow-900/10",
            )}
          >
            <div className="w-8 flex-shrink-0">
              {i === 0 ? (
                <span className="text-base">🥇</span>
              ) : i === 1 ? (
                <span className="text-base">🥈</span>
              ) : i === 2 ? (
                <span className="text-base">🥉</span>
              ) : (
                <span className="text-sm font-semibold text-muted-foreground">
                  {winner.rank}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {winner.name}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                {winner.team}
              </p>
            </div>
            <span className="w-14 text-center text-xs font-bold text-foreground flex-shrink-0">
              {winner.points}
            </span>
            <span className="w-16 text-right text-xs font-semibold text-green-600 dark:text-green-400 flex-shrink-0">
              {winner.prize}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsContent({ match }: { match: MatchDetail }) {
  return (
    <div className="pt-3">
      {match.news.map((article) => (
        <div
          key={article.id}
          className="mx-3 mb-2 rounded-lg border border-border bg-card flex overflow-hidden cursor-pointer hover:bg-muted/20 transition-colors"
        >
          {/* Thumbnail */}
          <div className="w-20 h-20 flex-shrink-0 bg-muted flex items-center justify-center">
            <span className="text-2xl">🏏</span>
          </div>
          {/* Content */}
          <div className="flex-1 min-w-0 px-3 py-2.5">
            <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">
              {article.title}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>
            <p className="text-[10px] text-muted-foreground/70 mt-1.5">
              {article.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatsContent({ match }: { match: MatchDetail }) {
  if (!match.stats) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground text-sm">Stats not available</p>
      </div>
    );
  }

  const { stats, team1, team2 } = match;

  return (
    <div className="pt-3">
      {/* Run Rate */}
      <div className="mx-3 mb-3 rounded-lg border border-border bg-card p-4">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-3">
          Run Rate
        </p>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">{team1.code}</p>
            <p className="text-xl font-bold text-foreground">
              {stats.runRate.team1}
            </p>
          </div>
          <p className="text-xs text-muted-foreground font-medium">CRR</p>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">{team2.code}</p>
            <p className="text-xl font-bold text-foreground">
              {stats.runRate.team2}
            </p>
          </div>
        </div>
      </div>

      {/* Boundaries */}
      <div className="mx-3 mb-3 rounded-lg border border-border bg-card p-4">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-3">
          Boundaries
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{team1.code}</p>
            <div className="flex gap-4">
              <div>
                <p className="text-[10px] text-muted-foreground">4s</p>
                <p className="text-base font-bold text-blue-500">
                  {stats.boundaries.team1fours}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">6s</p>
                <p className="text-base font-bold text-yellow-500">
                  {stats.boundaries.team1sixes}
                </p>
              </div>
            </div>
          </div>
          {stats.boundaries.team2fours !== undefined && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">{team2.code}</p>
              <div className="flex gap-4">
                <div>
                  <p className="text-[10px] text-muted-foreground">4s</p>
                  <p className="text-base font-bold text-blue-500">
                    {stats.boundaries.team2fours}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">6s</p>
                  <p className="text-base font-bold text-yellow-500">
                    {stats.boundaries.team2sixes}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Extras */}
      <div className="mx-3 mb-3 rounded-lg border border-border bg-card p-4">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-3">
          Extras
        </p>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">{team1.code}</p>
            <p className="text-xs font-semibold text-foreground">
              {stats.extras.team1}
            </p>
          </div>
          {stats.extras.team2 && (
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">
                {team2.code}
              </p>
              <p className="text-xs font-semibold text-foreground">
                {stats.extras.team2}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Highest Partnership */}
      <div className="mx-3 mb-3 rounded-lg border border-border bg-card p-4">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">
          Highest Partnership
        </p>
        <p className="text-sm font-semibold text-foreground">
          {stats.highestPartnership}
        </p>
      </div>
    </div>
  );
}

// ── Compact Score Block ────────────────────────────────────────────────────────
function CompactScoreBlock({ match }: { match: MatchDetail }) {
  const { team1, team2, status, statusText, currentBall, matchStatusType } =
    match;
  const isLive = status === "live";
  const isUpcoming = status === "upcoming";
  const isResult = status === "result";
  const isRain = matchStatusType === "rain";
  const isFinishedOrResult = isResult || matchStatusType === "finished";

  // Ball circle color logic
  const ballColorMap: Record<BallEntry["type"], string> = {
    four: "bg-blue-500 text-white",
    six: "bg-yellow-500 text-black",
    wicket: "bg-red-500 text-white",
    wide: "bg-orange-400 text-white",
    noball: "bg-purple-500 text-white",
    normal: "bg-muted text-muted-foreground",
  };

  // Status bar content
  function renderStatusBar() {
    if (isRain) {
      return (
        <div className="flex items-center gap-1.5">
          <CloudRain className="w-3 h-3 text-blue-400 flex-shrink-0" />
          <span className="text-[11px] font-semibold text-blue-400 tracking-wide">
            Match Delayed — Rain
          </span>
        </div>
      );
    }
    if (isFinishedOrResult) {
      return (
        <p className="text-[11px] font-semibold text-green-500">{statusText}</p>
      );
    }
    if (isUpcoming) {
      return (
        <p className="text-[11px] text-muted-foreground w-full text-center">
          {match.info.date}
        </p>
      );
    }
    // Live: show batting team's projection and chase info
    if (isLive) {
      // Team currently batting
      const battingTeam = team1.isBatting
        ? team1
        : team2.isBatting
          ? team2
          : null;
      const chasingTeam = team1.isBatting ? team2 : team1;
      return (
        <div className="flex items-center justify-between w-full gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-live-pulse flex-shrink-0" />
            <span className="text-[11px] font-semibold text-red-500 tracking-wide">
              LIVE
            </span>
          </div>
          {battingTeam && match.liveStats?.crr && (
            <span className="text-[11px] text-muted-foreground">
              {battingTeam.code} batting ·{" "}
              <span className="font-semibold text-foreground">
                CRR {match.liveStats.crr}
              </span>
            </span>
          )}
          {match.chaseBanner && (
            <span className="text-[11px] font-semibold text-orange-500">
              {chasingTeam.code}: {match.chaseBanner.text}
            </span>
          )}
        </div>
      );
    }
    return null;
  }

  return (
    <div className="bg-background border-b border-border px-4 pt-3 pb-0">
      {/* Main row: teams + scores on left, current ball on right */}
      <div className="flex items-center justify-between gap-4 pb-2.5">
        {/* LEFT: teams + scores stacked vertically */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {/* Team 1 */}
          <div className="flex items-center gap-2">
            <span className="text-base flex-shrink-0">{team1.flag}</span>
            <span className="text-sm font-bold text-foreground w-10 flex-shrink-0">
              {team1.code}
            </span>
            {isUpcoming ? (
              <span className="text-xs text-blue-500 font-medium">
                {statusText}
              </span>
            ) : team1.score ? (
              <span
                className={cn(
                  "text-sm font-bold",
                  isLive && team1.isBatting
                    ? "text-red-500"
                    : "text-foreground",
                )}
              >
                {team1.score}
                {team1.overs && (
                  <span className="text-[10px] font-normal text-muted-foreground ml-1">
                    ({team1.overs})
                  </span>
                )}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground italic">
                Yet to bat
              </span>
            )}
          </div>

          {/* Team 2 */}
          <div className="flex items-center gap-2">
            <span className="text-base flex-shrink-0">{team2.flag}</span>
            <span className="text-sm font-bold text-foreground w-10 flex-shrink-0">
              {team2.code}
            </span>
            {isUpcoming ? null : team2.score ? (
              <span
                className={cn(
                  "text-sm font-bold",
                  isLive && team2.isBatting
                    ? "text-red-500"
                    : "text-foreground",
                )}
              >
                {team2.score}
                {team2.overs && (
                  <span className="text-[10px] font-normal text-muted-foreground ml-1">
                    ({team2.overs})
                  </span>
                )}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground italic">
                Yet to bat
              </span>
            )}
          </div>
        </div>

        {/* RIGHT: current ball (live), clock icon (upcoming), result badge (completed) */}
        <div className="flex-shrink-0 flex items-center justify-center">
          {isRain ? (
            <div className="w-11 h-11 rounded-full bg-blue-500/10 flex items-center justify-center">
              <CloudRain className="w-5 h-5 text-blue-400" />
            </div>
          ) : isLive && currentBall ? (
            <div
              className={cn(
                "w-11 h-11 rounded-full flex items-center justify-center text-base font-black",
                ballColorMap[currentBall.type] ?? ballColorMap.normal,
              )}
            >
              {currentBall.value}
            </div>
          ) : isLive ? (
            <div className="w-11 h-11 rounded-full border-2 border-red-500 flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-live-pulse" />
            </div>
          ) : isUpcoming ? (
            <div className="w-11 h-11 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
          ) : isResult ? (
            <div className="w-11 h-11 rounded-full bg-green-500/10 flex items-center justify-center">
              <span className="text-xs font-bold text-green-500 text-center leading-tight">
                FIN
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Status bar */}
      <div className="border-t border-border py-2 flex items-center justify-between">
        {renderStatusBar()}
      </div>
    </div>
  );
}

// ── Tab bar ─────────────────────────────────────────────────────────────────────
function DetailTabBar({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const ocidMap: Record<string, string> = {
    Info: "match.detail.info.tab",
    Live: "match.detail.live.tab",
    Scorecard: "match.detail.scorecard.tab",
    Summary: "match.detail.summary.tab",
    "Predict & Win": "match.detail.predictwin.tab",
    Winners: "match.detail.winners.tab",
    News: "match.detail.news.tab",
    Stats: "match.detail.stats.tab",
  };

  return (
    <div
      className="sticky z-30 bg-background border-b border-border overflow-x-auto scrollbar-hide"
      style={{ top: "56px" }}
    >
      <div className="flex min-w-max">
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              type="button"
              data-ocid={ocidMap[tab] ?? "match.detail.info.tab"}
              onClick={() => onTabChange(tab)}
              className={cn(
                "flex-shrink-0 flex items-center justify-center px-4 py-3 text-sm font-semibold transition-all duration-200 relative whitespace-nowrap",
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
    </div>
  );
}

// ── Sliding tab content ────────────────────────────────────────────────────────
function SlidingContent({
  tabs,
  activeTab,
  match,
  onTouchStart,
  onTouchEnd,
  onTouchMove,
  onLoginRequest,
}: {
  tabs: string[];
  activeTab: string;
  match: MatchDetail;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onLoginRequest?: () => void;
}) {
  const { completeMatch, matchCompleted } = useFantasy();
  const activeIndex = tabs.indexOf(activeTab);
  const translateX = -activeIndex * 100;

  const isTestMatch = match.id === 999;
  const effectiveMatchStatus: "upcoming" | "live" | "result" = matchCompleted
    ? "result"
    : match.status === "live"
      ? "live"
      : match.status === "result"
        ? "result"
        : "upcoming";

  function renderTabContent(tab: string) {
    switch (tab) {
      case "Info":
        return <InfoContent match={match} />;
      case "Live":
        return <LiveContent match={match} />;
      case "Scorecard":
        return <ScorecardContent match={match} />;
      case "Summary":
        return <SummaryContent match={match} />;
      case "Predict & Win":
        return (
          <PredictAndWin
            matchId={isTestMatch ? 999 : match.id}
            matchStatus={effectiveMatchStatus}
            onLoginRequest={onLoginRequest}
            isTestMatch={isTestMatch}
          />
        );
      case "Winners":
        return <WinnersContent match={match} />;
      case "News":
        return <NewsContent match={match} />;
      case "Stats":
        return <StatsContent match={match} />;
      default:
        return (
          <div className="flex items-center justify-center py-16">
            <p className="text-muted-foreground text-sm">Coming soon</p>
          </div>
        );
    }
  }

  return (
    <div
      className="overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchMove={onTouchMove}
    >
      <div
        className="flex"
        style={{
          transform: `translateX(${translateX}%)`,
          transition: "transform 250ms cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab}
            className="w-full flex-shrink-0"
            style={{ minWidth: "100%" }}
          >
            {renderTabContent(tab)}
            {/* Dev Tools for match 999 */}
            {isTestMatch && !matchCompleted && (
              <div className="mx-3 my-4 p-3 border border-dashed border-muted-foreground/30 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-2">Dev Tools</p>
                <button
                  type="button"
                  onClick={completeMatch}
                  className="text-xs bg-muted px-3 py-1.5 rounded text-muted-foreground hover:bg-muted/80 transition-colors"
                >
                  Dev: Complete Match &amp; Distribute Points
                </button>
              </div>
            )}
            {isTestMatch && matchCompleted && (
              <div className="mx-3 my-4 p-3 border border-dashed border-green-500/30 rounded-lg text-center">
                <p className="text-xs text-green-500">
                  ✓ Match completed — leaderboard distributed
                </p>
              </div>
            )}
            {/* Footer */}
            <footer className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground pb-4 px-3">
              <p>
                © {new Date().getFullYear()}{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                    typeof window !== "undefined"
                      ? window.location.hostname
                      : "",
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Built with ♥ using caffeine.ai
                </a>
              </p>
            </footer>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function MatchDetailPage() {
  const params = useParams({ from: "/matches/$id" });
  const navigate = useNavigate();
  const matchId = Number(params.id);
  const match = getMatchDetail(matchId);
  const [loginOpen, setLoginOpen] = useState(false);

  const tabs = match ? getTabsForStatus(match.status) : LIVE_TABS;
  const defaultTab = match ? getDefaultTab(match.status) : "Info";
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Swipe support
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const swipeBlocked = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    const scrollableParent = target.closest('[data-no-swipe="true"]');
    if (scrollableParent) {
      swipeBlocked.current = true;
      return;
    }
    swipeBlocked.current = false;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (
      swipeBlocked.current ||
      touchStartX.current === null ||
      touchStartY.current === null
    )
      return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) {
      swipeBlocked.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (
      swipeBlocked.current ||
      touchStartX.current === null ||
      touchStartY.current === null
    ) {
      swipeBlocked.current = false;
      touchStartX.current = null;
      touchStartY.current = null;
      return;
    }
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx) * 0.5) {
      touchStartX.current = null;
      touchStartY.current = null;
      return;
    }
    const currentIndex = tabs.indexOf(activeTab);
    if (dx < 0 && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    } else if (dx > 0 && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
    touchStartX.current = null;
    touchStartY.current = null;
    swipeBlocked.current = false;
  };

  if (!match) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6">
        <p className="text-2xl">🏏</p>
        <p className="text-foreground font-semibold">Match not found</p>
        <button
          type="button"
          onClick={() => navigate({ to: "/matches" })}
          className="text-primary text-sm font-medium hover:opacity-80 transition-opacity"
        >
          Back to Matches
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="pb-24 min-h-screen">
        <DetailTabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <CompactScoreBlock match={match} />
        <SlidingContent
          tabs={tabs}
          activeTab={activeTab}
          match={match}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          onLoginRequest={() => setLoginOpen(true)}
        />
      </div>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
