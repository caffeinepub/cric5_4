import { useEffect, useState } from "react";

export interface CountdownResult {
  minutes: number;
  seconds: number;
  totalSeconds: number;
  expired: boolean;
}

function computeCountdown(targetTimestamp: number): CountdownResult {
  const diff = Math.max(0, Math.floor((targetTimestamp - Date.now()) / 1000));
  return {
    minutes: Math.floor(diff / 60),
    seconds: diff % 60,
    totalSeconds: diff,
    expired: diff === 0,
  };
}

export function useCountdown(targetTimestamp: number): CountdownResult {
  const [result, setResult] = useState<CountdownResult>(() =>
    computeCountdown(targetTimestamp),
  );

  useEffect(() => {
    if (result.expired) return;
    const id = setInterval(() => {
      const next = computeCountdown(targetTimestamp);
      setResult(next);
      if (next.expired) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [result.expired, targetTimestamp]);

  return result;
}
