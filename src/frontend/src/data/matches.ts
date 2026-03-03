export type MatchStatus = "live" | "upcoming" | "result";

export interface TeamInfo {
  flag: string;
  code: string;
  name: string;
  score?: string;
  overs?: string;
  isBatting?: boolean;
}

// ── Legacy Match type used by FeaturedMatches component ─────────────────────
export interface Match {
  id: number;
  tournament: string;
  stage: string;
  status: MatchStatus;
  team1: TeamInfo;
  team2: TeamInfo;
  statusText: string;
}

// ── Featured matches (home page) ─────────────────────────────────────────────
export const matches: Match[] = [
  {
    id: 1,
    tournament: "ICC Men's T20 World Cup 2024",
    stage: "Super 8s · Match 3 · MCG, Melbourne",
    status: "live",
    team1: {
      flag: "🇮🇳",
      code: "IND",
      name: "India",
      score: "187/4",
      overs: "18.2",
      isBatting: true,
    },
    team2: { flag: "🇦🇺", code: "AUS", name: "Australia" },
    statusText: "India chose to bat.",
  },
  {
    id: 2,
    tournament: "SA Tour of England 2024",
    stage: "2nd ODI · Lord's Cricket Ground, London",
    status: "upcoming",
    team1: { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", code: "ENG", name: "England" },
    team2: { flag: "🇿🇦", code: "SA", name: "South Africa" },
    statusText: "Mon, Mar 2 · 6:00 PM",
  },
  {
    id: 3,
    tournament: "The Ashes 2024",
    stage: "3rd Test · Day 4 · Headingley, Leeds",
    status: "live",
    team1: {
      flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      code: "ENG",
      name: "England",
      score: "312/6",
      overs: "87.3",
      isBatting: true,
    },
    team2: {
      flag: "🇦🇺",
      code: "AUS",
      name: "Australia",
      score: "289",
      overs: "94.0",
    },
    statusText: "England trail by 65 runs.",
  },
  {
    id: 4,
    tournament: "ICC Men's T20 World Cup 2024",
    stage: "52nd Match · Kensington Oval, Barbados",
    status: "result",
    team1: {
      flag: "🏳️",
      code: "WI",
      name: "West Indies",
      score: "195/4",
      overs: "20",
    },
    team2: {
      flag: "🇮🇳",
      code: "IND",
      name: "India",
      score: "199/5",
      overs: "19.2",
    },
    statusText: "IND won by 5 wickets",
  },
  {
    id: 5,
    tournament: "India vs Sri Lanka T20I Series",
    stage: "1st T20I · Wankhede Stadium, Mumbai",
    status: "upcoming",
    team1: { flag: "🇮🇳", code: "IND", name: "India" },
    team2: { flag: "🇱🇰", code: "SL", name: "Sri Lanka" },
    statusText: "Tue, Mar 3 · 7:00 PM",
  },
  {
    id: 6,
    tournament: "Asia Cup 2024",
    stage: "Group B · Match 8 · Pallekele, Sri Lanka",
    status: "live",
    team1: {
      flag: "🇵🇰",
      code: "PAK",
      name: "Pakistan",
      score: "142/8",
      overs: "20.0",
    },
    team2: {
      flag: "🇧🇩",
      code: "BAN",
      name: "Bangladesh",
      score: "89/5",
      overs: "15.3",
      isBatting: true,
    },
    statusText: "BAN need 54 runs from 27 balls.",
  },
];

export interface MatchEntry {
  id: number;
  status: MatchStatus;
  label: string; // e.g. "Super 8s · Match 3 · MCG, Melbourne"
  competition: string; // e.g. "ICC Men's T20 World Cup 2024"
  section: string; // section heading grouping
  team1: TeamInfo;
  team2: TeamInfo;
  statusText: string; // "India chose to bat." / "Mon, Mar 3 · 2:30 PM" / "IND won by 5 wickets"
  format: string;
  // For upcoming/result: ISO date string used for date row grouping
  matchDate?: string;
  // For the test match: absolute timestamp when match starts
  startTimestamp?: number;
}

// ── LIVE matches ──────────────────────────────────────────────────────────────
export const liveMatches: MatchEntry[] = [
  {
    id: 101,
    status: "live",
    label: "Super 8s · Match 3 · MCG, Melbourne",
    competition: "ICC Men's T20 World Cup 2024",
    section: "Game On – Featured Live",
    team1: {
      flag: "🇮🇳",
      code: "IND",
      name: "India",
      score: "187/4",
      overs: "18.2 ov",
      isBatting: true,
    },
    team2: { flag: "🇦🇺", code: "AUS", name: "Australia" },
    statusText: "India chose to bat.",
    format: "T20I",
  },
  {
    id: 102,
    status: "live",
    label: "2nd T20I · Kensington Oval, Bridgetown",
    competition: "Women's T20I Series 2024",
    section: "Game On – Featured Live",
    team1: {
      flag: "🏳️",
      code: "WI-W",
      name: "West Indies Women",
      score: "96/4",
      overs: "14.2 ov",
      isBatting: true,
    },
    team2: { flag: "🇱🇰", code: "SL-W", name: "Sri Lanka Women" },
    statusText: "SL Women chose to field.",
    format: "T20I",
  },
  {
    id: 103,
    status: "live",
    label: "3rd Test · Day 4 · Headingley, Leeds",
    competition: "The Ashes 2024",
    section: "Game On – Featured Live",
    team1: {
      flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      code: "ENG",
      name: "England",
      score: "312/6",
      overs: "87.3 ov",
      isBatting: true,
    },
    team2: {
      flag: "🇦🇺",
      code: "AUS",
      name: "Australia",
      score: "289",
      overs: "94.0 ov",
    },
    statusText: "England trail by 65 runs.",
    format: "Test",
  },
  {
    id: 104,
    status: "live",
    label: "1st ODI · Eden Gardens, Kolkata",
    competition: "India vs South Africa ODI Series 2024",
    section: "ICC Men's T20 World Cup 2024",
    team1: {
      flag: "🇮🇳",
      code: "IND",
      name: "India",
      score: "210/4",
      overs: "38.1 ov",
      isBatting: true,
    },
    team2: {
      flag: "🇿🇦",
      code: "SA",
      name: "South Africa",
      score: "193/7",
      overs: "40.0 ov",
    },
    statusText: "IND need 17 runs from 71 balls.",
    format: "ODI",
  },
  {
    id: 105,
    status: "live",
    label: "Group B · Match 8 · Pallekele, Sri Lanka",
    competition: "Asia Cup 2024",
    section: "ICC Men's T20 World Cup 2024",
    team1: {
      flag: "🇵🇰",
      code: "PAK",
      name: "Pakistan",
      score: "142/8",
      overs: "20.0 ov",
    },
    team2: {
      flag: "🇧🇩",
      code: "BAN",
      name: "Bangladesh",
      score: "89/5",
      overs: "15.3 ov",
      isBatting: true,
    },
    statusText: "BAN need 54 runs from 27 balls.",
    format: "T20I",
  },
];

// ── TEST MATCH: stable 1-minute countdown from module load ───────────────────
const TEST_MATCH_START = Date.now() + 60 * 1000;

// ── UPCOMING matches ──────────────────────────────────────────────────────────
// Today is Mon Mar 02 2026
export const upcomingMatches: MatchEntry[] = [
  {
    id: 999,
    status: "upcoming",
    label: "Final · Narendra Modi Stadium, Ahmedabad",
    competition: "ICC Champions Trophy 2025",
    section: "ICC Champions Trophy 2025",
    team1: { flag: "🇮🇳", code: "IND", name: "India" },
    team2: { flag: "🇦🇺", code: "AUS", name: "Australia" },
    statusText: "Starts in 1 min",
    format: "ODI",
    matchDate: "2026-03-02",
    startTimestamp: TEST_MATCH_START,
  },
  {
    id: 201,
    status: "upcoming",
    label: "Super 8s · Match 5 · Providence Stadium, Guyana",
    competition: "ICC Men's T20 World Cup 2024",
    section: "ICC Men's T20 World Cup 2024",
    team1: { flag: "🇵🇰", code: "PAK", name: "Pakistan" },
    team2: { flag: "🇳🇿", code: "NZ", name: "New Zealand" },
    statusText: "Mon, Mar 2 · 2:30 PM",
    format: "T20I",
    matchDate: "2026-03-02",
  },
  {
    id: 202,
    status: "upcoming",
    label: "2nd ODI · Lord's Cricket Ground, London",
    competition: "SA Tour of England 2024",
    section: "SA Tour of England 2024",
    team1: { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", code: "ENG", name: "England" },
    team2: { flag: "🇿🇦", code: "SA", name: "South Africa" },
    statusText: "Mon, Mar 2 · 6:00 PM",
    format: "ODI",
    matchDate: "2026-03-02",
  },
  {
    id: 203,
    status: "upcoming",
    label: "1st T20I · Wankhede Stadium, Mumbai",
    competition: "India vs Sri Lanka T20I Series",
    section: "India vs Sri Lanka T20I Series",
    team1: { flag: "🇮🇳", code: "IND", name: "India" },
    team2: { flag: "🇱🇰", code: "SL", name: "Sri Lanka" },
    statusText: "Tue, Mar 3 · 7:00 PM",
    format: "T20I",
    matchDate: "2026-03-03",
  },
  {
    id: 204,
    status: "upcoming",
    label: "Group A · Match 3 · Sharjah Cricket Stadium",
    competition: "Women's T20 World Cup 2024",
    section: "Women's T20 World Cup 2024",
    team1: { flag: "🇦🇺", code: "AUS-W", name: "Australia Women" },
    team2: { flag: "🇧🇩", code: "BAN-W", name: "Bangladesh Women" },
    statusText: "Wed, Mar 4 · 3:30 PM",
    format: "T20I",
    matchDate: "2026-03-04",
  },
  {
    id: 205,
    status: "upcoming",
    label: "2nd Test · Day 1 · SCG, Sydney",
    competition: "The Ashes 2025",
    section: "The Ashes 2025",
    team1: { flag: "🇦🇺", code: "AUS", name: "Australia" },
    team2: { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", code: "ENG", name: "England" },
    statusText: "Thu, Mar 5 · 9:30 AM",
    format: "Test",
    matchDate: "2026-03-05",
  },
  {
    id: 206,
    status: "upcoming",
    label: "3rd T20I · R. Premadasa, Colombo",
    competition: "NZ Tour of Sri Lanka 2025",
    section: "NZ Tour of Sri Lanka 2025",
    team1: { flag: "🇳🇿", code: "NZ", name: "New Zealand" },
    team2: { flag: "🇱🇰", code: "SL", name: "Sri Lanka" },
    statusText: "Fri, Mar 6 · 4:00 PM",
    format: "T20I",
    matchDate: "2026-03-06",
  },
  {
    id: 207,
    status: "upcoming",
    label: "1st ODI · Gaddafi Stadium, Lahore",
    competition: "Pakistan vs Bangladesh ODI Series",
    section: "Pakistan vs Bangladesh ODI Series",
    team1: { flag: "🇵🇰", code: "PAK", name: "Pakistan" },
    team2: { flag: "🇧🇩", code: "BAN", name: "Bangladesh" },
    statusText: "Sat, Mar 7 · 2:00 PM",
    format: "ODI",
    matchDate: "2026-03-07",
  },
  {
    id: 208,
    status: "upcoming",
    label: "Final · Narendra Modi Stadium, Ahmedabad",
    competition: "ICC Champions Trophy 2025",
    section: "ICC Champions Trophy 2025",
    team1: { flag: "🇮🇳", code: "IND", name: "India" },
    team2: { flag: "🇦🇺", code: "AUS", name: "Australia" },
    statusText: "Sun, Mar 8 · 2:00 PM",
    format: "ODI",
    matchDate: "2026-03-08",
  },
];

// ── RESULT matches ────────────────────────────────────────────────────────────
// Today is Mon Mar 02 2026 — results are past dates
export const resultMatches: MatchEntry[] = [
  {
    id: 301,
    status: "result",
    label: "52nd Match · Super 8s · Kensington Oval, Barbados",
    competition: "ICC Men's T20 World Cup 2024",
    section: "ICC Men's T20 World Cup 2024",
    team1: {
      flag: "🏳️",
      code: "WI",
      name: "West Indies",
      score: "195/4",
      overs: "20 ov",
    },
    team2: {
      flag: "🇮🇳",
      code: "IND",
      name: "India",
      score: "199/5",
      overs: "19.2 ov",
    },
    statusText: "IND won by 5 wickets",
    format: "T20I",
    matchDate: "2026-03-02",
  },
  {
    id: 302,
    status: "result",
    label: "Group A · Match 12 · Nassau County ISD, New York",
    competition: "ICC Men's T20 World Cup 2024",
    section: "ICC Men's T20 World Cup 2024",
    team1: {
      flag: "🇿🇼",
      code: "ZIM",
      name: "Zimbabwe",
      score: "153/7",
      overs: "20 ov",
    },
    team2: {
      flag: "🇿🇦",
      code: "SA",
      name: "South Africa",
      score: "154/5",
      overs: "17.5 ov",
    },
    statusText: "SA won by 5 wickets",
    format: "T20I",
    matchDate: "2026-03-02",
  },
  {
    id: 303,
    status: "result",
    label: "Group C · Match 9 · Arnos Vale, St. Vincent",
    competition: "ICC Men's T20 World Cup 2024",
    section: "ICC Men's T20 World Cup 2024",
    team1: {
      flag: "🇦🇫",
      code: "AFG",
      name: "Afghanistan",
      score: "183/5",
      overs: "20 ov",
    },
    team2: {
      flag: "🇵🇬",
      code: "PNG",
      name: "Papua New Guinea",
      score: "86/9",
      overs: "20 ov",
    },
    statusText: "AFG won by 97 runs",
    format: "T20I",
    matchDate: "2026-03-01",
  },
  {
    id: 304,
    status: "result",
    label: "3rd ODI · R. Premadasa, Colombo",
    competition: "SL vs PAK ODI Series 2024",
    section: "SL vs PAK ODI Series 2024",
    team1: {
      flag: "🇱🇰",
      code: "SL",
      name: "Sri Lanka",
      score: "287/6",
      overs: "50 ov",
    },
    team2: {
      flag: "🇵🇰",
      code: "PAK",
      name: "Pakistan",
      score: "254",
      overs: "43.2 ov",
    },
    statusText: "SL won by 33 runs",
    format: "ODI",
    matchDate: "2026-03-01",
  },
  {
    id: 305,
    status: "result",
    label: "1st Test · Day 5 · Lord's Cricket Ground",
    competition: "England vs New Zealand Test 2024",
    section: "England vs New Zealand Test 2024",
    team1: {
      flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      code: "ENG",
      name: "England",
      score: "325 & 267",
      overs: "",
    },
    team2: {
      flag: "🇳🇿",
      code: "NZ",
      name: "New Zealand",
      score: "378 & 216/8",
      overs: "",
    },
    statusText: "Match drawn",
    format: "Test",
    matchDate: "2026-02-28",
  },
  {
    id: 306,
    status: "result",
    label: "2nd T20I · WACA Ground, Perth",
    competition: "Australia vs India T20I Series",
    section: "Australia vs India T20I Series",
    team1: {
      flag: "🇦🇺",
      code: "AUS",
      name: "Australia",
      score: "178/6",
      overs: "20 ov",
    },
    team2: {
      flag: "🇮🇳",
      code: "IND",
      name: "India",
      score: "180/3",
      overs: "19.1 ov",
    },
    statusText: "IND won by 7 wickets",
    format: "T20I",
    matchDate: "2026-02-27",
  },
  {
    id: 307,
    status: "result",
    label: "2nd ODI · Hagley Oval, Christchurch",
    competition: "NZ vs SA ODI Series 2025",
    section: "NZ vs SA ODI Series 2025",
    team1: {
      flag: "🇳🇿",
      code: "NZ",
      name: "New Zealand",
      score: "245/8",
      overs: "50 ov",
    },
    team2: {
      flag: "🇿🇦",
      code: "SA",
      name: "South Africa",
      score: "246/5",
      overs: "48.3 ov",
    },
    statusText: "SA won by 5 wickets",
    format: "ODI",
    matchDate: "2026-02-26",
  },
];
