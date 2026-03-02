import { Calendar } from "lucide-react";

export default function MatchesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
        <Calendar className="w-8 h-8 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold">Matches</h1>
      <p className="text-muted-foreground text-sm max-w-xs">
        Matches page coming soon. Live scores, fixtures, and results will appear
        here.
      </p>
    </div>
  );
}
