import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";

export interface Prediction {
  id: string;
  teamName: string; // e.g. "StrikerX1"
  matchId: number;
  answers: Record<string, string>; // questionId -> optionId
  createdAt: number;
}

export interface JoinedContest {
  contestId: string;
  matchId: number;
  predictionId: string;
  joinedAt: number;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  teamName: string;
  points: number;
  prize?: string;
}

interface FantasyState {
  predictions: Prediction[];
  joinedContests: JoinedContest[];
  matchCompleted: boolean;
  leaderboard: LeaderboardEntry[];
}

interface FantasyContextValue extends FantasyState {
  createPrediction: (
    matchId: number,
    answers: Record<string, string>,
    teamBaseName: string,
    username: string,
  ) => Prediction | { error: string };
  joinContest: (
    contestId: string,
    matchId: number,
    predictionId: string,
    username: string,
  ) => boolean | { error: string };
  completeMatch: () => void;
  getUserPredictions: (matchId: number, username: string) => Prediction[];
  getUserJoinedContests: (matchId: number, username: string) => JoinedContest[];
  getPredictionJoinCount: (contestId: string, username: string) => number;
}

const STORAGE_KEY = "cric5_fantasy";

function loadFantasyState(): FantasyState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as FantasyState;
  } catch {
    // ignore
  }
  return {
    predictions: [],
    joinedContests: [],
    matchCompleted: false,
    leaderboard: [],
  };
}

function saveFantasyState(state: FantasyState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function answersAreSame(
  a: Record<string, string>,
  b: Record<string, string>,
): boolean {
  const keysA = Object.keys(a).sort();
  const keysB = Object.keys(b).sort();
  if (keysA.length !== keysB.length) return false;
  return keysA.every((k, i) => k === keysB[i] && a[k] === b[k]);
}

const FantasyContext = createContext<FantasyContextValue | undefined>(
  undefined,
);

export function FantasyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FantasyState>(loadFantasyState);

  const createPrediction = useCallback(
    (
      matchId: number,
      answers: Record<string, string>,
      teamBaseName: string,
      username: string,
    ): Prediction | { error: string } => {
      const userPredictions = state.predictions.filter(
        (p) => p.matchId === matchId && p.teamName.startsWith(teamBaseName),
      );

      // Check max 20 predictions
      if (userPredictions.length >= 20) {
        return { error: "Maximum 20 predictions reached for this match." };
      }

      // Check not all-same answers as existing
      const duplicate = userPredictions.find((p) =>
        answersAreSame(p.answers, answers),
      );
      if (duplicate) {
        return {
          error:
            "This prediction is identical to an existing one. Please change at least one answer.",
        };
      }

      const index = userPredictions.length + 1;
      const teamName = `${teamBaseName}${index}`;
      const prediction: Prediction = {
        id: `${username}_${matchId}_${Date.now()}`,
        teamName,
        matchId,
        answers,
        createdAt: Date.now(),
      };

      setState((prev) => {
        const next = {
          ...prev,
          predictions: [...prev.predictions, prediction],
        };
        saveFantasyState(next);
        return next;
      });

      return prediction;
    },
    [state.predictions],
  );

  const joinContest = useCallback(
    (
      contestId: string,
      matchId: number,
      predictionId: string,
      username: string,
    ): boolean | { error: string } => {
      // Count how many times this user joined this contest
      const joinCount = state.joinedContests.filter(
        (jc) =>
          jc.contestId === contestId &&
          state.predictions.find(
            (p) => p.id === jc.predictionId && p.id.startsWith(username),
          ),
      ).length;

      if (joinCount >= 20) {
        return {
          error: "You can join this contest a maximum of 20 times.",
        };
      }

      // Check if already joined with this specific prediction
      const alreadyJoined = state.joinedContests.some(
        (jc) => jc.contestId === contestId && jc.predictionId === predictionId,
      );
      if (alreadyJoined) {
        return {
          error: "You have already joined this contest with this prediction.",
        };
      }

      const joined: JoinedContest = {
        contestId,
        matchId,
        predictionId,
        joinedAt: Date.now(),
      };

      setState((prev) => {
        const next = {
          ...prev,
          joinedContests: [...prev.joinedContests, joined],
        };
        saveFantasyState(next);
        return next;
      });

      return true;
    },
    [state.joinedContests, state.predictions],
  );

  const completeMatch = useCallback(() => {
    const leaderboard: LeaderboardEntry[] = [
      {
        rank: 1,
        username: "player1",
        teamName: "player1's team",
        points: 500,
        prize: "₹500 Amazon Voucher",
      },
      {
        rank: 2,
        username: "player2",
        teamName: "player2's team",
        points: 300,
        prize: "50 Super Coins",
      },
      {
        rank: 3,
        username: "CricHero",
        teamName: "HeroSquad1",
        points: 250,
        prize: "25 Super Coins",
      },
      {
        rank: 4,
        username: "BlazeKing",
        teamName: "BlazeEleven",
        points: 180,
      },
      {
        rank: 5,
        username: "SpinGod",
        teamName: "SpinCity1",
        points: 120,
      },
    ];

    setState((prev) => {
      // Update team names for player1 and player2 from actual predictions
      const updatedLeaderboard = leaderboard.map((entry) => {
        const userPrediction = prev.predictions.find((p) =>
          p.id.startsWith(entry.username),
        );
        if (userPrediction) {
          return { ...entry, teamName: userPrediction.teamName };
        }
        return entry;
      });

      const next = {
        ...prev,
        matchCompleted: true,
        leaderboard: updatedLeaderboard,
      };
      saveFantasyState(next);
      return next;
    });
  }, []);

  const getUserPredictions = useCallback(
    (matchId: number, username: string): Prediction[] => {
      return state.predictions.filter(
        (p) => p.matchId === matchId && p.id.startsWith(username),
      );
    },
    [state.predictions],
  );

  const getUserJoinedContests = useCallback(
    (matchId: number, username: string): JoinedContest[] => {
      const userPredictionIds = new Set(
        state.predictions
          .filter((p) => p.id.startsWith(username) && p.matchId === matchId)
          .map((p) => p.id),
      );
      return state.joinedContests.filter(
        (jc) =>
          jc.matchId === matchId && userPredictionIds.has(jc.predictionId),
      );
    },
    [state.joinedContests, state.predictions],
  );

  const getPredictionJoinCount = useCallback(
    (contestId: string, username: string): number => {
      const userPredictionIds = new Set(
        state.predictions
          .filter((p) => p.id.startsWith(username))
          .map((p) => p.id),
      );
      return state.joinedContests.filter(
        (jc) =>
          jc.contestId === contestId && userPredictionIds.has(jc.predictionId),
      ).length;
    },
    [state.joinedContests, state.predictions],
  );

  return (
    <FantasyContext.Provider
      value={{
        ...state,
        createPrediction,
        joinContest,
        completeMatch,
        getUserPredictions,
        getUserJoinedContests,
        getPredictionJoinCount,
      }}
    >
      {children}
    </FantasyContext.Provider>
  );
}

export function useFantasy(): FantasyContextValue {
  const ctx = useContext(FantasyContext);
  if (!ctx) throw new Error("useFantasy must be used within FantasyProvider");
  return ctx;
}
