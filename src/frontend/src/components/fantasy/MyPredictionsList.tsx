import JoinContestModal from "@/components/fantasy/JoinContestModal";
import PredictionForm from "@/components/fantasy/PredictionForm";
import { useAuth } from "@/context/AuthContext";
import { useFantasy } from "@/context/FantasyContext";
import type { Prediction } from "@/context/FantasyContext";
import { getContestsByMatchId } from "@/data/fantasy";
import type { Contest } from "@/data/fantasy";
import { cn } from "@/lib/utils";
import { Plus, Target } from "lucide-react";
import { useState } from "react";

interface MyPredictionsListProps {
  matchId: number;
}

const QUESTION_LABELS: Record<string, string> = {
  q1: "Match Winner",
  q2: "IND Top Scorer",
  q3: "IND Top Bowler",
  q4: "AUS Top Bowler",
  q5: "Most Valuable Player",
};

function getOptionLabel(
  questionId: string,
  optionId: string,
  contests: Contest[],
): string {
  const contest = contests[0];
  if (!contest) return optionId;
  const question = contest.questions.find((q) => q.id === questionId);
  if (!question) return optionId;
  const option = question.options.find((o) => o.id === optionId);
  return option?.label ?? optionId;
}

function PredictionCard({
  prediction,
  contests,
  joinedContests,
  onJoin,
}: {
  prediction: Prediction;
  contests: Contest[];
  joinedContests: Array<{ contestId: string; predictionId: string }>;
  onJoin: (contest: Contest) => void;
}) {
  const myJoins = joinedContests.filter(
    (jc) => jc.predictionId === prediction.id,
  );
  const joinedContestIds = new Set(myJoins.map((jc) => jc.contestId));

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Team name header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2.5 border-b border-border/50">
        <p className="text-sm font-bold text-foreground">
          {prediction.teamName}
        </p>
        <span className="text-[10px] text-muted-foreground">
          {new Date(prediction.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Answers */}
      <div className="px-4 py-3 flex flex-col gap-1.5">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">
          Your Picks
        </p>
        {Object.entries(prediction.answers).map(([qId, optId]) => (
          <div key={qId} className="flex items-center gap-2 justify-between">
            <span className="text-xs text-muted-foreground flex-shrink-0 w-28">
              {QUESTION_LABELS[qId] ?? qId}
            </span>
            <span className="text-xs font-semibold text-foreground text-right">
              {getOptionLabel(qId, optId, contests)}
            </span>
          </div>
        ))}
      </div>

      {/* Contests joined with this prediction */}
      {myJoins.length > 0 && (
        <div className="px-4 pb-3 border-t border-border/50 pt-2.5">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
            Contests Joined
          </p>
          <div className="flex flex-wrap gap-1.5">
            {myJoins.map((jc) => {
              const contest = contests.find((c) => c.id === jc.contestId);
              return (
                <span
                  key={jc.contestId}
                  className="text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5"
                >
                  {contest?.name ?? jc.contestId}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Join more contests */}
      {contests.length > joinedContestIds.size && (
        <div className="px-4 pb-3">
          <p className="text-[10px] text-muted-foreground mb-1.5">
            Not joined all contests yet:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {contests
              .filter((c) => !joinedContestIds.has(c.id))
              .map((contest) => (
                <button
                  key={contest.id}
                  type="button"
                  onClick={() => onJoin(contest)}
                  className="text-[10px] font-semibold text-blue-500 bg-blue-500/10 border border-blue-500/20 rounded-full px-2 py-0.5 hover:bg-blue-500/20 transition-colors"
                >
                  + {contest.name}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyPredictionsList({ matchId }: MyPredictionsListProps) {
  const { isLoggedIn, username, teamBaseName } = useAuth();
  const { getUserPredictions, getUserJoinedContests, createPrediction } =
    useFantasy();

  const [showForm, setShowForm] = useState(false);
  const [joinContest, setJoinContest] = useState<Contest | null>(null);
  const [formError, setFormError] = useState("");

  const contests = getContestsByMatchId(matchId);
  const userPredictions = isLoggedIn
    ? getUserPredictions(matchId, username)
    : [];
  const userJoins = isLoggedIn ? getUserJoinedContests(matchId, username) : [];

  const maxReached = userPredictions.length >= 20;

  const handleFormSubmit = (answers: Record<string, string>) => {
    if (!isLoggedIn) return;
    const result = createPrediction(matchId, answers, teamBaseName, username);
    if ("error" in result) {
      setFormError(result.error);
      return;
    }
    setShowForm(false);
    setFormError("");
  };

  if (!isLoggedIn) {
    return (
      <div
        data-ocid="mypredictions.list"
        className="flex flex-col items-center justify-center py-20 px-6 gap-4"
      >
        <Target className="w-12 h-12 text-muted-foreground" />
        <p className="text-base font-semibold text-foreground text-center">
          Login to see your predictions
        </p>
        <p className="text-sm text-muted-foreground text-center">
          Sign in to create and manage your match predictions
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        data-ocid="mypredictions.list"
        className="px-3 py-4 flex flex-col gap-3"
      >
        {/* Header with add button */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-foreground">My Predictions</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {userPredictions.length}/20 created
            </p>
          </div>
          {!showForm && (
            <button
              type="button"
              data-ocid="mypredictions.add.button"
              onClick={() => {
                if (!maxReached) setShowForm(true);
              }}
              disabled={maxReached}
              className={cn(
                "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all",
                maxReached
                  ? "text-muted-foreground bg-muted/50 cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:opacity-90",
              )}
            >
              <Plus className="w-3.5 h-3.5" />
              {maxReached ? "Max Reached" : "Add Prediction"}
            </button>
          )}
        </div>

        {/* Form error */}
        {formError && (
          <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {formError}
          </p>
        )}

        {/* Inline prediction form */}
        {showForm && (
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm font-bold text-foreground mb-4">
              Create Prediction — {teamBaseName}
              {userPredictions.length + 1}
            </p>
            {contests[0] && (
              <PredictionForm
                questions={contests[0].questions}
                existingAnswers={userPredictions.map((p) => p.answers)}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setFormError("");
                }}
                submitLabel="Save Prediction"
              />
            )}
          </div>
        )}

        {/* Empty state */}
        {userPredictions.length === 0 && !showForm && (
          <div
            data-ocid="mypredictions.list.empty_state"
            className="flex flex-col items-center justify-center py-16 px-4 gap-3"
          >
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-2xl">
              🎯
            </div>
            <p className="text-sm font-semibold text-foreground text-center">
              No predictions yet
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Join a contest to get started, or create a prediction first
            </p>
          </div>
        )}

        {/* Prediction cards */}
        {userPredictions.map((pred, i) => (
          <div key={pred.id} data-ocid={`mypredictions.item.${i + 1}`}>
            <PredictionCard
              prediction={pred}
              contests={contests}
              joinedContests={userJoins}
              onJoin={(contest) => setJoinContest(contest)}
            />
          </div>
        ))}
      </div>

      {/* Join contest modal */}
      {joinContest && (
        <JoinContestModal
          contest={joinContest}
          matchId={matchId}
          onClose={() => setJoinContest(null)}
        />
      )}
    </>
  );
}
