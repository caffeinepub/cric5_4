import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface VideoAdModalProps {
  open: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

export default function VideoAdModal({
  open,
  onComplete,
  onCancel,
}: VideoAdModalProps) {
  const DURATION = 5;
  const [secondsLeft, setSecondsLeft] = useState(DURATION);
  const [phase, setPhase] = useState<"counting" | "done">("counting");
  const completedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      setSecondsLeft(DURATION);
      setPhase("counting");
      completedRef.current = false;
      return;
    }

    setSecondsLeft(DURATION);
    setPhase("counting");
    completedRef.current = false;

    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setPhase("done");
          if (!completedRef.current) {
            completedRef.current = true;
            setTimeout(() => onComplete(), 500);
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [open, onComplete]);

  if (!open) return null;

  const progress = ((DURATION - secondsLeft) / DURATION) * 100;

  return (
    <div
      data-ocid="video.ad.modal"
      className="fixed inset-0 z-[90] bg-black/80 flex items-center justify-center px-5"
    >
      <div className="bg-background border border-border rounded-2xl w-full max-w-sm p-6 flex flex-col items-center gap-4 shadow-2xl">
        {/* Ad placeholder */}
        <div className="w-full h-32 rounded-xl bg-muted flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
          <div className="flex flex-col items-center gap-2 relative z-10">
            <span className="text-4xl">📺</span>
            <p className="text-xs text-muted-foreground font-medium">
              Advertisement
            </p>
          </div>
        </div>

        {/* Status text */}
        <div className="text-center">
          <p className="text-sm font-bold text-foreground">
            {phase === "counting" ? "Watching Ad…" : "Ad complete!"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {phase === "counting"
              ? `Entry will be granted in ${secondsLeft}s`
              : "Granting your entry…"}
          </p>
        </div>

        {/* Progress bar */}
        <div
          data-ocid="video.ad.countdown"
          className="w-full h-2 bg-muted rounded-full overflow-hidden"
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000 ease-linear",
              phase === "done" ? "bg-green-500" : "bg-primary",
            )}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Timer */}
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-muted-foreground">
            {phase === "counting" ? `${secondsLeft}s remaining` : "Done ✓"}
          </span>
          {phase === "counting" && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
