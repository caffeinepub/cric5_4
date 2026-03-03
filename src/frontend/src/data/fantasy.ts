export type QuestionType =
  | "plus_minus_one"
  | "per_option_plus_minus"
  | "per_option_plus_only";

export interface QuestionOption {
  id: string;
  label: string;
  points?: number; // for per_option types
}

export interface ContestQuestion {
  id: string;
  text: string;
  type: QuestionType;
  correctPoints: number; // for plus_minus_one: points if correct
  wrongPoints?: number; // for plus_minus_one: points if wrong (negative)
  options: QuestionOption[];
  /** The correct option id for plus_minus_one questions */
  correctOptionId?: string;
}

export interface ContestPrize {
  rank: number;
  prize: string;
  prizeType: "voucher" | "coins";
  coinsAmount?: number;
}

export interface Contest {
  id: string;
  matchId: number;
  name: string;
  entryType: "free" | "coins" | "video";
  coinCost?: number;
  maxParticipants: number;
  prizes: ContestPrize[];
  questions: ContestQuestion[];
}

// ── Shared questions for IND vs AUS match 999 ────────────────────────────────
const sharedQuestions: ContestQuestion[] = [
  {
    id: "q1",
    text: "Who will win the match?",
    type: "plus_minus_one",
    correctPoints: 20,
    wrongPoints: -10,
    correctOptionId: "q1_india",
    options: [
      { id: "q1_india", label: "India" },
      { id: "q1_australia", label: "Australia" },
    ],
  },
  {
    id: "q2",
    text: "IND Top Run Scorer",
    type: "per_option_plus_minus",
    correctPoints: 0,
    options: [
      { id: "q2_rohit", label: "Rohit Sharma", points: 15 },
      { id: "q2_virat", label: "Virat Kohli", points: 12 },
      { id: "q2_kl", label: "KL Rahul", points: 8 },
      { id: "q2_gill", label: "Shubman Gill", points: 10 },
      { id: "q2_hardik", label: "Hardik Pandya", points: -5 },
    ],
  },
  {
    id: "q3",
    text: "IND Top Bowler",
    type: "per_option_plus_only",
    correctPoints: 0,
    options: [
      { id: "q3_bumrah", label: "Jasprit Bumrah", points: 20 },
      { id: "q3_siraj", label: "Mohammed Siraj", points: 15 },
      { id: "q3_kuldeep", label: "Kuldeep Yadav", points: 12 },
      { id: "q3_jadeja", label: "Ravindra Jadeja", points: 10 },
      { id: "q3_hardik", label: "Hardik Pandya", points: 8 },
    ],
  },
  {
    id: "q4",
    text: "AUS Top Bowler",
    type: "per_option_plus_minus",
    correctPoints: 0,
    options: [
      { id: "q4_cummins", label: "Pat Cummins", points: 15 },
      { id: "q4_starc", label: "Mitchell Starc", points: 12 },
      { id: "q4_hazlewood", label: "Josh Hazlewood", points: 10 },
      { id: "q4_zampa", label: "Adam Zampa", points: 8 },
      { id: "q4_green", label: "Cameron Green", points: -5 },
    ],
  },
  {
    id: "q5",
    text: "Most Valuable Player",
    type: "plus_minus_one",
    correctPoints: 25,
    wrongPoints: -10,
    correctOptionId: "q5_virat",
    options: [
      { id: "q5_rohit", label: "Rohit Sharma" },
      { id: "q5_virat", label: "Virat Kohli" },
      { id: "q5_cummins", label: "Pat Cummins" },
      { id: "q5_starc", label: "Mitchell Starc" },
      { id: "q5_bumrah", label: "Jasprit Bumrah" },
      { id: "q5_warner", label: "David Warner" },
    ],
  },
];

const PRIZES: ContestPrize[] = [
  { rank: 1, prize: "₹500 Amazon Voucher", prizeType: "voucher" },
  { rank: 2, prize: "50 Super Coins", prizeType: "coins", coinsAmount: 50 },
  { rank: 3, prize: "25 Super Coins", prizeType: "coins", coinsAmount: 25 },
];

export const contests: Contest[] = [
  {
    id: "free-999",
    matchId: 999,
    name: "Mega Free Contest",
    entryType: "free",
    maxParticipants: 50,
    prizes: PRIZES,
    questions: sharedQuestions,
  },
  {
    id: "coins-999",
    matchId: 999,
    name: "Champions Coins Contest",
    entryType: "coins",
    coinCost: 5,
    maxParticipants: 30,
    prizes: PRIZES,
    questions: sharedQuestions,
  },
  {
    id: "video-999",
    matchId: 999,
    name: "Watch & Win Contest",
    entryType: "video",
    maxParticipants: 20,
    prizes: PRIZES,
    questions: sharedQuestions,
  },
];

export function getContestsByMatchId(matchId: number): Contest[] {
  return contests.filter((c) => c.matchId === matchId);
}

export function getContest(id: string): Contest | undefined {
  return contests.find((c) => c.id === id);
}
