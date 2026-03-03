import LoginModal from "@/components/auth/LoginModal";
import PredictionForm from "@/components/fantasy/PredictionForm";
import VideoAdModal from "@/components/fantasy/VideoAdModal";
import { useAuth } from "@/context/AuthContext";
import { useFantasy } from "@/context/FantasyContext";
import type { Prediction } from "@/context/FantasyContext";
import type { Contest } from "@/data/fantasy";
import { cn } from "@/lib/utils";
import { ChevronRight, Plus, X } from "lucide-react";
import { useState } from "react";

type Step =
  | "login_required"
  | "choose_prediction"
  | "create_prediction"
  | "confirm_free"
  | "confirm_coins"
  | "watch_ad"
  | "success";

interface JoinContestModalProps {
  contest: Contest;
  matchId: number;
  onClose: () => void;
}

export default function JoinContestModal({
  contest,
  matchId,
  onClose,
}: JoinContestModalProps) {
  const { isLoggedIn, username, teamBaseName, superCoins, deductCoins } =
    useAuth();
  const { joinContest, createPrediction, getUserPredictions } = useFantasy();

  const [step, setStep] = useState<Step>(
    isLoggedIn ? "choose_prediction" : "login_required",
  );
  const [selectedPrediction, setSelectedPrediction] =
    useState<Prediction | null>(null);
  const [loginOpen, setLoginOpen] = useState(!isLoggedIn);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const userPredictions = isLoggedIn
    ? getUserPredictions(matchId, username)
    : [];

  const existingAnswersList = userPredictions.map((p) => p.answers);

  const handleLoginClose = () => {
    setLoginOpen(false);
    onClose();
  };

  const handleSelectExisting = (prediction: Prediction) => {
    setSelectedPrediction(prediction);
    proceedToEntryGate(prediction);
  };

  const handleCreateNew = () => {
    setStep("create_prediction");
  };

  const handlePredictionSubmit = (answers: Record<string, string>) => {
    const result = createPrediction(matchId, answers, teamBaseName, username);
    if ("error" in result) {
      setErrorMsg(result.error);
      return;
    }
    setSelectedPrediction(result);
    proceedToEntryGate(result);
  };

  const proceedToEntryGate = (prediction: Prediction) => {
    setSelectedPrediction(prediction);
    if (contest.entryType === "free") {
      setStep("confirm_free");
    } else if (contest.entryType === "coins") {
      setStep("confirm_coins");
    } else {
      setStep("watch_ad");
    }
  };

  const handleConfirmJoin = (prediction: Prediction) => {
    const result = joinContest(contest.id, matchId, prediction.id, username);
    if (result === true) {
      setStep("success");
      setSuccessMsg(
        `You've joined ${contest.name} with ${prediction.teamName}!`,
      );
    } else if (typeof result === "object" && "error" in result) {
      setErrorMsg(result.error);
      setStep("choose_prediction");
    }
  };

  const handleCoinsConfirm = () => {
    if (!selectedPrediction) return;
    if (superCoins < (contest.coinCost ?? 0)) {
      setErrorMsg("Insufficient super coins.");
      setStep("choose_prediction");
      return;
    }
    deductCoins(contest.coinCost ?? 0);
    handleConfirmJoin(selectedPrediction);
  };

  const handleAdComplete = () => {
    if (!selectedPrediction) return;
    handleConfirmJoin(selectedPrediction);
  };

  // If not logged in, show login modal
  if (!isLoggedIn) {
    return <LoginModal open={loginOpen} onClose={handleLoginClose} />;
  }

  if (step === "watch_ad" && selectedPrediction) {
    return (
      <VideoAdModal open onComplete={handleAdComplete} onCancel={onClose} />
    );
  }

  if (step === "success") {
    return (
      <div
        data-ocid="join.modal"
        className="fixed inset-0 z-[80] bg-black/70 flex items-end sm:items-center justify-center"
      >
        <div className="bg-background border border-border w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-6 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-3xl">
            🎉
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-foreground">You're in!</p>
            <p className="text-sm text-muted-foreground mt-1">{successMsg}</p>
          </div>
          <button
            type="button"
            data-ocid="join.confirm.button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: modal backdrop
    <div
      data-ocid="join.modal"
      className="fixed inset-0 z-[80] bg-black/70 flex items-end sm:items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          "bg-background border border-border w-full sm:max-w-sm",
          "rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border sticky top-0 bg-background z-10">
          <div>
            <h2 className="text-base font-bold text-foreground">
              {step === "choose_prediction"
                ? "Choose Prediction"
                : step === "create_prediction"
                  ? "Create Prediction"
                  : step === "confirm_free"
                    ? "Confirm Entry"
                    : step === "confirm_coins"
                      ? "Coins Entry"
                      : "Join Contest"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">
              {contest.name}
            </p>
          </div>
          <button
            type="button"
            data-ocid="join.cancel.button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-5 flex flex-col gap-4">
          {/* Error */}
          {errorMsg && (
            <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {errorMsg}
            </p>
          )}

          {/* STEP: Choose prediction */}
          {step === "choose_prediction" && (
            <div className="flex flex-col gap-3">
              {/* Existing predictions */}
              {userPredictions.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Your Predictions
                  </p>
                  {userPredictions.map((pred, i) => (
                    <button
                      key={pred.id}
                      type="button"
                      data-ocid={`join.existing.prediction.${i + 1}`}
                      onClick={() => handleSelectExisting(pred)}
                      className={cn(
                        "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border bg-card",
                        "hover:border-primary/50 hover:bg-primary/5 transition-all mb-2",
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {pred.teamName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {Object.keys(pred.answers).length} answers saved
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-xs text-primary font-medium">
                          Use this
                        </span>
                        <ChevronRight className="w-4 h-4 text-primary" />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Create new */}
              {userPredictions.length < 20 && (
                <button
                  type="button"
                  data-ocid="join.new_prediction.button"
                  onClick={handleCreateNew}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl",
                    "border-2 border-dashed border-primary/40 text-primary",
                    "hover:border-primary hover:bg-primary/5 transition-all",
                  )}
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    Create New Prediction
                  </span>
                  {userPredictions.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      ({userPredictions.length}/20)
                    </span>
                  )}
                </button>
              )}

              {userPredictions.length === 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  Create your first prediction to join this contest
                </p>
              )}
            </div>
          )}

          {/* STEP: Create prediction */}
          {step === "create_prediction" && (
            <PredictionForm
              questions={contest.questions}
              existingAnswers={existingAnswersList}
              onSubmit={handlePredictionSubmit}
              onCancel={() => setStep("choose_prediction")}
            />
          )}

          {/* STEP: Confirm free entry */}
          {step === "confirm_free" && selectedPrediction && (
            <div className="flex flex-col gap-4">
              <div className="bg-muted/30 rounded-xl p-4 flex flex-col gap-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                  Prediction
                </p>
                <p className="text-sm font-bold text-foreground">
                  {selectedPrediction.teamName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {Object.keys(selectedPrediction.answers).length} answers
                </p>
              </div>
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                <span className="text-green-500 text-lg">🆓</span>
                <p className="text-sm font-semibold text-green-500">
                  Free entry — no cost!
                </p>
              </div>
              <button
                type="button"
                data-ocid="join.confirm.button"
                onClick={() => handleConfirmJoin(selectedPrediction)}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Confirm & Join
              </button>
            </div>
          )}

          {/* STEP: Confirm coins entry */}
          {step === "confirm_coins" && selectedPrediction && (
            <div className="flex flex-col gap-4">
              <div className="bg-muted/30 rounded-xl p-4 flex flex-col gap-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                  Prediction
                </p>
                <p className="text-sm font-bold text-foreground">
                  {selectedPrediction.teamName}
                </p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col gap-1.5">
                <p className="text-sm font-semibold text-amber-500">
                  🪙 Coin Entry
                </p>
                <p className="text-xs text-foreground">
                  Entry cost:{" "}
                  <span className="font-bold">{contest.coinCost} coins</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Your balance:{" "}
                  <span
                    className={cn(
                      "font-bold",
                      superCoins >= (contest.coinCost ?? 0)
                        ? "text-foreground"
                        : "text-red-500",
                    )}
                  >
                    {superCoins} coins
                  </span>
                  {superCoins < (contest.coinCost ?? 0) && (
                    <span className="text-red-500 ml-1">(insufficient)</span>
                  )}
                </p>
              </div>
              <button
                type="button"
                data-ocid="join.confirm.button"
                onClick={handleCoinsConfirm}
                disabled={superCoins < (contest.coinCost ?? 0)}
                className={cn(
                  "w-full py-3 rounded-xl text-sm font-bold transition-all",
                  "bg-primary text-primary-foreground hover:opacity-90",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                )}
              >
                Confirm & Deduct {contest.coinCost} Coins
              </button>
            </div>
          )}
        </div>

        {/* Safe area */}
        <div className="pb-2 sm:pb-0" />
      </div>
    </div>
  );
}
