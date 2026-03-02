import { Trophy } from "lucide-react";

export default function WinPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
        <Trophy className="w-8 h-8 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold">Win</h1>
      <p className="text-muted-foreground text-sm max-w-xs">
        Contests and predictions coming soon. Compete, predict, and win exciting
        prizes.
      </p>
    </div>
  );
}
