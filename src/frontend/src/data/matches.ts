export type MatchStatus = "live" | "upcoming" | "completed";

export interface TeamInfo {
  flag: string;
  code: string;
  name: string;
  score?: string;
  overs?: string;
  isBatting?: boolean;
}

export interface Match {
  id: number;
  tournament: string;
  stage: string;
  team1: TeamInfo;
  team2: TeamInfo;
  status: MatchStatus;
  statusText: string;
  format: string;
  venue?: string;
}

export const matches: Match[] = [
  {
    id: 1,
    tournament: "ICC Men's T20 World Cup 2024",
    stage: "SUPER 8S · MATCH 3",
    team1: {
      flag: "🇮🇳",
      code: "IND",
      name: "India",
      score: "187/4",
      overs: "18.2",
      isBatting: true,
    },
    team2: {
      flag: "🇦🇺",
      code: "AUS",
      name: "Australia",
    },
    status: "live",
    statusText: "In Progress · 18.2/20",
    format: "T20I",
    venue: "Providence Stadium, Guyana",
  },
  {
    id: 2,
    tournament: "Women's T20 Series",
    stage: "2ND T20I",
    team1: {
      flag: "🇼🇮",
      code: "WI",
      name: "West Indies",
      score: "142/6",
      overs: "20.0",
    },
    team2: {
      flag: "🇱🇰",
      code: "SL",
      name: "Sri Lanka",
      score: "88/4",
      overs: "13.1",
      isBatting: true,
    },
    status: "live",
    statusText: "In Progress · 13.1/20",
    format: "T20I",
    venue: "Pallekele International Stadium",
  },
  {
    id: 3,
    tournament: "Test Series",
    stage: "1ST TEST · DAY 1",
    team1: {
      flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      code: "ENG",
      name: "England",
    },
    team2: {
      flag: "🇿🇦",
      code: "SA",
      name: "South Africa",
    },
    status: "upcoming",
    statusText: "Starts 10:00 AM",
    format: "Test",
    venue: "Lord's Cricket Ground, London",
  },
  {
    id: 4,
    tournament: "IPL 2024",
    stage: "QUALIFIER 1",
    team1: {
      flag: "🏏",
      code: "MI",
      name: "Mumbai Indians",
      score: "198/5",
      overs: "20.0",
    },
    team2: {
      flag: "🏏",
      code: "CSK",
      name: "Chennai Super Kings",
      score: "195/7",
      overs: "20.0",
    },
    status: "completed",
    statusText: "MI won by 3 runs",
    format: "IPL",
    venue: "Wankhede Stadium, Mumbai",
  },
  {
    id: 5,
    tournament: "Asia Cup 2024",
    stage: "GROUP STAGE · MATCH 6",
    team1: {
      flag: "🇵🇰",
      code: "PAK",
      name: "Pakistan",
    },
    team2: {
      flag: "🇧🇩",
      code: "BAN",
      name: "Bangladesh",
    },
    status: "upcoming",
    statusText: "Starts 2:30 PM",
    format: "ODI",
    venue: "Pallekele International Stadium",
  },
  {
    id: 6,
    tournament: "ODI Series",
    stage: "3RD ODI",
    team1: {
      flag: "🇳🇿",
      code: "NZ",
      name: "New Zealand",
      score: "287/6",
      overs: "50.0",
    },
    team2: {
      flag: "🇮🇳",
      code: "IND",
      name: "India",
      score: "290/4",
      overs: "48.2",
      isBatting: false,
    },
    status: "completed",
    statusText: "IND won by 6 wickets",
    format: "ODI",
    venue: "Eden Gardens, Kolkata",
  },
];
