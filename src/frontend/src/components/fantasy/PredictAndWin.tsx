import ContestsList from "@/components/fantasy/ContestsList";
import MyContestsList from "@/components/fantasy/MyContestsList";
import MyPredictionsList from "@/components/fantasy/MyPredictionsList";
import { cn } from "@/lib/utils";
import { useState } from "react";

type SubTab = "All Contests" | "My Contests" | "My Predictions";
const SUB_TABS: SubTab[] = ["All Contests", "My Contests", "My Predictions"];

interface PredictAndWinProps {
  matchId: number;
  matchStatus: "upcoming" | "live" | "result";
  onLoginRequest?: () => void;
  isTestMatch: boolean;
}

export default function PredictAndWin({
  matchId,
  matchStatus,
  onLoginRequest,
  isTestMatch,
}: PredictAndWinProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("All Contests");

  return (
    <div className="flex flex-col">
      {/* Sub-tab bar */}
      <div
        data-no-swipe="true"
        className="sticky z-20 bg-background border-b border-border overflow-x-auto scrollbar-hide"
        style={{ top: "96px" }}
      >
        <div className="flex min-w-max">
          {SUB_TABS.map((tab) => {
            const isActive = tab === activeSubTab;
            const ocidMap: Record<SubTab, string> = {
              "All Contests": "predictwin.allcontests.tab",
              "My Contests": "predictwin.mycontests.tab",
              "My Predictions": "predictwin.mypredictions.tab",
            };
            return (
              <button
                key={tab}
                type="button"
                data-ocid={ocidMap[tab]}
                onClick={() => setActiveSubTab(tab)}
                className={cn(
                  "flex-shrink-0 flex items-center justify-center px-5 py-3 text-sm font-semibold transition-all duration-200 relative whitespace-nowrap",
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

      {/* Sub-tab content */}
      <div>
        {activeSubTab === "All Contests" &&
          (isTestMatch ? (
            <ContestsList
              matchId={matchId}
              matchStatus={matchStatus}
              onLoginRequest={onLoginRequest}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-6 gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-3xl">
                🏆
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-foreground">
                  Contests coming soon
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Join exciting prediction contests and win prizes
                </p>
              </div>
            </div>
          ))}

        {activeSubTab === "My Contests" &&
          (isTestMatch ? (
            <MyContestsList matchId={matchId} matchStatus={matchStatus} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-6 gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-3xl">
                🏆
              </div>
              <p className="text-base font-semibold text-foreground text-center">
                No contests joined yet
              </p>
            </div>
          ))}

        {activeSubTab === "My Predictions" &&
          (isTestMatch ? (
            <MyPredictionsList matchId={matchId} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-6 gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-3xl">
                🎯
              </div>
              <p className="text-base font-semibold text-foreground text-center">
                No predictions yet
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
