import type { ContestQuestion } from "@/data/fantasy";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

interface PredictionFormProps {
  questions: ContestQuestion[];
  existingAnswers?: Record<string, string>[];
  onSubmit: (answers: Record<string, string>) => void;
  onCancel: () => void;
  submitLabel?: string;
}

function PointBadge({ points }: { points: number }) {
  if (points > 0) {
    return (
      <span className="text-[10px] font-bold text-green-500">+{points}</span>
    );
  }
  if (points < 0) {
    return <span className="text-[10px] font-bold text-red-500">{points}</span>;
  }
  return null;
}

function QuestionPointHint({
  question,
}: {
  question: ContestQuestion;
}) {
  if (question.type === "plus_minus_one") {
    return (
      <span className="text-[10px] text-muted-foreground">
        Correct:{" "}
        <span className="text-green-500 font-bold">
          +{question.correctPoints}
        </span>{" "}
        · Wrong:{" "}
        <span className="text-red-500 font-bold">{question.wrongPoints}</span>
      </span>
    );
  }
  return null;
}

export default function PredictionForm({
  questions,
  existingAnswers = [],
  onSubmit,
  onCancel,
  submitLabel = "Save Prediction",
}: PredictionFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [validationError, setValidationError] = useState("");

  const handleSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setValidationError("");
  };

  const handleSubmit = () => {
    // Check all questions answered
    const unanswered = questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      setValidationError(
        `Please answer all ${questions.length} questions before submitting.`,
      );
      return;
    }

    // Check not duplicate of existing predictions
    const isDuplicate = existingAnswers.some((existing) => {
      const keys = questions.map((q) => q.id);
      return keys.every((k) => existing[k] === answers[k]);
    });

    if (isDuplicate) {
      setValidationError(
        "This prediction is identical to one you already made. Please change at least one answer.",
      );
      return;
    }

    onSubmit(answers);
  };

  const allAnswered = questions.every((q) => !!answers[q.id]);

  return (
    <div data-ocid="prediction.form" className="flex flex-col gap-4">
      {questions.map((question, qi) => (
        <div
          key={question.id}
          className="rounded-xl border border-border bg-card overflow-hidden"
        >
          {/* Question header */}
          <div className="px-4 pt-3.5 pb-2 border-b border-border/50">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-foreground flex-1">
                <span className="text-muted-foreground mr-1.5">Q{qi + 1}.</span>
                {question.text}
              </p>
              <QuestionPointHint question={question} />
            </div>
          </div>

          {/* Options */}
          <div className="px-4 py-3 flex flex-col gap-2">
            {question.options.map((option, oi) => {
              const isSelected = answers[question.id] === option.id;
              return (
                <label
                  key={option.id}
                  data-ocid={`prediction.q${qi + 1}.option.${oi + 1}`}
                  className={cn(
                    "flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all",
                    "border",
                    isSelected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border hover:border-muted-foreground/40 hover:bg-muted/20",
                  )}
                >
                  <div className="flex items-center gap-2.5 flex-1">
                    {/* Radio */}
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center",
                        isSelected
                          ? "border-primary"
                          : "border-muted-foreground/40",
                      )}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-sm",
                        isSelected
                          ? "font-semibold text-foreground"
                          : "text-foreground",
                      )}
                    >
                      {option.label}
                    </span>
                  </div>

                  {/* Points for per-option types */}
                  {option.points !== undefined && (
                    <PointBadge points={option.points} />
                  )}

                  <input
                    type="radio"
                    name={question.id}
                    value={option.id}
                    checked={isSelected}
                    onChange={() => handleSelect(question.id, option.id)}
                    className="sr-only"
                  />
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {/* Validation error */}
      {validationError && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-500">{validationError}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl text-sm font-semibold border border-border text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          data-ocid="prediction.submit_button"
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={cn(
            "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
            "bg-primary text-primary-foreground",
            "hover:opacity-90 active:scale-[0.98]",
            "disabled:opacity-40 disabled:cursor-not-allowed",
          )}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
