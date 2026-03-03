export interface BallEntry {
  value: string;
  type: "normal" | "four" | "six" | "wicket" | "wide" | "noball";
}

export interface OverGroup {
  over: string; // e.g. "12o 8r"
  balls: BallEntry[];
}

export interface BatterStat {
  name: string;
  status: string; // "batting" | "not out" | "c Carey b Cummins"
  r: number;
  b: number;
  fours: number;
  sixes: number;
  sr: string;
}

export interface BowlerStat {
  name: string;
  isBowling?: boolean;
  o: string;
  m: number;
  r: number;
  w: number;
  econ: string;
}

export interface InningsData {
  team: string;
  flag: string;
  total: string;
  overs: string;
  batters: Array<{
    name: string;
    dismissal: string;
    r: number;
    b: number;
    fours: number;
    sixes: number;
    sr: string;
  }>;
  bowlers: Array<{
    name: string;
    o: string;
    m: number;
    r: number;
    w: number;
    econ: string;
  }>;
}

export interface CommentaryEntry {
  over: string;
  text: string;
  highlight?: "wicket" | "four" | "six" | "wide" | "noball";
}

export interface MatchDetail {
  id: number;
  status: "live" | "upcoming" | "result";
  /** Fine-grained match status for the status bar */
  matchStatusType?: "live" | "rain" | "finished" | "upcoming";
  tournament: string;
  currentBall?: { value: string; type: BallEntry["type"] };
  team1: {
    flag: string;
    code: string;
    name: string;
    score?: string;
    overs?: string;
    isBatting?: boolean;
  };
  team2: {
    flag: string;
    code: string;
    name: string;
    score?: string;
    overs?: string;
    isBatting?: boolean;
  };
  statusText: string;
  chaseBanner?: { text: string; rrr: string };

  info: {
    venue: string;
    city: string;
    date: string;
    format: string;
    toss: string;
    umpires: string;
    matchReferee: string;
  };

  liveStats?: {
    crr: string;
    rrr: string;
    last5: string;
    recentBalls: OverGroup[];
    batting: BatterStat[];
    bowling: BowlerStat[];
    currentBowler?: BowlerStat;
    partnership: {
      batters: string;
      runs: number;
      balls: number;
      overs: string;
    };
    lastWicket: {
      player: string;
      dismissal: string;
      score: string;
      over: string;
    };
    commentary?: CommentaryEntry[];
  };

  scorecard?: {
    innings: InningsData[];
  };

  summary?: {
    highlights: string[];
    topPerformers: Array<{
      name: string;
      team: string;
      stat: string;
      detail: string;
    }>;
  };

  stats?: {
    runRate: { team1: string; team2: string };
    boundaries: {
      team1fours: number;
      team1sixes: number;
      team2fours?: number;
      team2sixes?: number;
    };
    extras: { team1: string; team2?: string };
    highestPartnership: string;
  };

  news: Array<{ id: number; title: string; excerpt: string; time: string }>;

  winners?: Array<{
    rank: number;
    name: string;
    team: string;
    points: string;
    prize: string;
  }>;
}

// ── Match 101 — LIVE: IND vs AUS ─────────────────────────────────────────────
const match101: MatchDetail = {
  id: 101,
  status: "live",
  matchStatusType: "live",
  tournament: "ICC T20 World Cup · Semi-Final",
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
  chaseBanner: { text: "Need 56 runs from 30 balls", rrr: "11.2" },
  currentBall: { value: "6", type: "six" },

  info: {
    venue: "Melbourne Cricket Ground",
    city: "Melbourne, Australia",
    date: "Mon, 2 Mar 2026 · 2:30 PM AEDT",
    format: "T20 International",
    toss: "Australia won the toss and elected to field",
    umpires: "Rod Tucker, Michael Gough",
    matchReferee: "Ranjan Madugalle",
  },

  liveStats: {
    crr: "9.25",
    rrr: "11.4",
    last5: "52/2",
    recentBalls: [
      {
        over: "17o  8r",
        balls: [
          { value: "1", type: "normal" },
          { value: "0", type: "normal" },
          { value: "4", type: "four" },
          { value: "W", type: "wicket" },
          { value: "2", type: "normal" },
          { value: "1", type: "normal" },
        ],
      },
      {
        over: "18o  9r",
        balls: [
          { value: "0", type: "normal" },
          { value: "6", type: "six" },
          { value: "1", type: "normal" },
          { value: "Wd", type: "wide" },
          { value: "2", type: "normal" },
        ],
      },
    ],
    batting: [
      {
        name: "Virat Kohli",
        status: "batting",
        r: 72,
        b: 48,
        fours: 6,
        sixes: 3,
        sr: "150.0",
      },
      {
        name: "Rohit Sharma",
        status: "batting",
        r: 38,
        b: 25,
        fours: 4,
        sixes: 2,
        sr: "152.0",
      },
      {
        name: "Suryakumar Yadav",
        status: "c Maxwell b Cummins",
        r: 45,
        b: 28,
        fours: 3,
        sixes: 3,
        sr: "160.7",
      },
      {
        name: "KL Rahul",
        status: "c Carey b Hazlewood",
        r: 21,
        b: 16,
        fours: 2,
        sixes: 1,
        sr: "131.2",
      },
    ],
    bowling: [
      {
        name: "Pat Cummins",
        isBowling: true,
        o: "3.2",
        m: 0,
        r: 34,
        w: 2,
        econ: "10.2",
      },
      { name: "Mitchell Starc", o: "4", m: 0, r: 41, w: 1, econ: "10.25" },
      { name: "Josh Hazlewood", o: "4", m: 0, r: 32, w: 1, econ: "8.0" },
      { name: "Adam Zampa", o: "4", m: 0, r: 38, w: 0, econ: "9.5" },
      { name: "Glenn Maxwell", o: "3", m: 0, r: 42, w: 0, econ: "14.0" },
    ],
    currentBowler: {
      name: "Pat Cummins",
      isBowling: true,
      o: "3.2",
      m: 0,
      r: 34,
      w: 2,
      econ: "10.2",
    },
    partnership: {
      batters: "V Kohli & R Sharma",
      runs: 61,
      balls: 36,
      overs: "6.0",
    },
    lastWicket: {
      player: "Suryakumar Yadav",
      dismissal: "c Maxwell b Cummins",
      score: "187/4",
      over: "18.2",
    },
    commentary: [
      {
        over: "18.2",
        text: "Cummins to Kohli — SIX! Kohli walks across and launches it over wide long-on. What a hit! India 187/4.",
        highlight: "six",
      },
      {
        over: "18.1",
        text: "Cummins to Kohli — Wide! Slipping down the leg side, umpire signals wide. Extra added.",
        highlight: "wide",
      },
      {
        over: "17.6",
        text: "Cummins to Sharma — 2 runs. Clipped off the pads, good running between the wickets.",
      },
      {
        over: "17.5",
        text: "Cummins to Sharma — 1 run. Punched off the back foot towards point.",
      },
      {
        over: "17.4",
        text: "Cummins to Kohli — WICKET! Suryakumar Yadav caught at deep midwicket by Maxwell! SKY goes for 45. Big moment for Australia.",
        highlight: "wicket",
      },
      {
        over: "17.3",
        text: "Cummins to SKY — FOUR! Short and wide, SKY cuts it ferociously through the gap at backward point.",
        highlight: "four",
      },
      {
        over: "17.2",
        text: "Cummins to SKY — Dot ball. Defended back to the bowler. Good length delivery on off stump.",
      },
      {
        over: "17.1",
        text: "Cummins to SKY — 1 run. Pushed to mid-on, single taken comfortably.",
      },
      {
        over: "16.6",
        text: "Starc to Kohli — 1 run. Full delivery driven to long-off for a single.",
      },
      {
        over: "16.5",
        text: "Starc to Kohli — SIX! Kohli stands tall and lofts it over mid-wicket. Incredible stroke! The crowd is on its feet.",
        highlight: "six",
      },
      {
        over: "16.4",
        text: "Starc to Rohit — 0. Dot ball. Full and straight, Rohit jabs it back.",
      },
      {
        over: "16.3",
        text: "Starc to Rohit — FOUR! Rohit flicks off his pads, beats the fine-leg fielder. Fifty partnership for IND!",
        highlight: "four",
      },
      {
        over: "16.2",
        text: "Starc to Rohit — 2 runs. Guided behind square on the leg side, good placement.",
      },
    ],
  },

  scorecard: {
    innings: [
      {
        team: "IND",
        flag: "🇮🇳",
        total: "187/4",
        overs: "18.2",
        batters: [
          {
            name: "Rohit Sharma",
            dismissal: "batting",
            r: 38,
            b: 25,
            fours: 4,
            sixes: 2,
            sr: "152.0",
          },
          {
            name: "Shubman Gill",
            dismissal: "b Starc",
            r: 11,
            b: 9,
            fours: 1,
            sixes: 0,
            sr: "122.2",
          },
          {
            name: "Virat Kohli",
            dismissal: "batting",
            r: 72,
            b: 48,
            fours: 6,
            sixes: 3,
            sr: "150.0",
          },
          {
            name: "Suryakumar Yadav",
            dismissal: "c Maxwell b Cummins",
            r: 45,
            b: 28,
            fours: 3,
            sixes: 3,
            sr: "160.7",
          },
          {
            name: "KL Rahul",
            dismissal: "c Carey b Hazlewood",
            r: 21,
            b: 16,
            fours: 2,
            sixes: 1,
            sr: "131.2",
          },
        ],
        bowlers: [
          { name: "Mitchell Starc", o: "4", m: 0, r: 41, w: 1, econ: "10.25" },
          { name: "Josh Hazlewood", o: "4", m: 0, r: 32, w: 1, econ: "8.0" },
          { name: "Pat Cummins", o: "3.2", m: 0, r: 34, w: 2, econ: "10.2" },
          { name: "Adam Zampa", o: "4", m: 0, r: 38, w: 0, econ: "9.5" },
          { name: "Glenn Maxwell", o: "3", m: 0, r: 42, w: 0, econ: "14.0" },
        ],
      },
    ],
  },

  stats: {
    runRate: { team1: "9.25", team2: "—" },
    boundaries: { team1fours: 16, team1sixes: 9 },
    extras: { team1: "W 2  NB 1  B 0  LB 1  Total 4" },
    highestPartnership: "61 runs (V Kohli & R Sharma, 6 ov)",
  },

  news: [
    {
      id: 1,
      title: "Kohli's masterclass puts India in commanding position",
      excerpt:
        "Virat Kohli's unbeaten 72 off 48 has given India a strong platform heading into the final overs against Australia.",
      time: "2 min ago",
    },
    {
      id: 2,
      title: "Cummins claims key wicket of Suryakumar Yadav",
      excerpt:
        "Pat Cummins delivered a crucial blow removing the dangerous SKY for 45 to give Australia a fighting chance.",
      time: "8 min ago",
    },
    {
      id: 3,
      title: "MCG set for a thrilling finish — India vs Australia",
      excerpt:
        "With India needing big runs in the final two overs, the Melbourne crowd is on its feet for a nail-biting climax.",
      time: "15 min ago",
    },
    {
      id: 4,
      title: "Starc and Hazlewood rattle India's top order early",
      excerpt:
        "Shubman Gill fell early to Mitchell Starc, but Rohit and Kohli steadied the ship with a crucial partnership.",
      time: "55 min ago",
    },
  ],
};

// ── Match 201 — UPCOMING: PAK vs NZ ──────────────────────────────────────────
const match201: MatchDetail = {
  id: 201,
  status: "upcoming",
  matchStatusType: "upcoming",
  tournament: "ICC T20 World Cup",
  team1: { flag: "🇵🇰", code: "PAK", name: "Pakistan" },
  team2: { flag: "🇳🇿", code: "NZ", name: "New Zealand" },
  statusText: "Mon, Mar 2 · 2:30 PM",

  info: {
    venue: "Providence Stadium",
    city: "Guyana, West Indies",
    date: "Mon, 2 Mar 2026 · 2:30 PM AST",
    format: "T20 International",
    toss: "To be decided",
    umpires: "Aleem Dar, Richard Kettleborough",
    matchReferee: "Chris Broad",
  },

  summary: {
    highlights: [
      "Pakistan vs New Zealand — Super 8s clash in Guyana",
      "PAK have won 4 of their last 5 T20Is against NZ",
      "NZ captain Mitchell Santner returns after injury layoff",
      "This is a must-win game for both sides to advance to the semis",
      "Weather forecast: partly cloudy, conditions favour pace bowling",
    ],
    topPerformers: [
      {
        name: "Babar Azam",
        team: "PAK",
        stat: "Recent Form",
        detail: "78, 45, 62 in last 3 T20Is",
      },
      {
        name: "Kane Williamson",
        team: "NZ",
        stat: "Recent Form",
        detail: "55, 38, 71 in last 3 T20Is",
      },
      {
        name: "Shaheen Afridi",
        team: "PAK",
        stat: "Tournament Wickets",
        detail: "9 wickets in 4 matches",
      },
      {
        name: "Trent Boult",
        team: "NZ",
        stat: "Tournament Wickets",
        detail: "7 wickets in 4 matches",
      },
    ],
  },

  stats: {
    runRate: { team1: "—", team2: "—" },
    boundaries: { team1fours: 0, team1sixes: 0, team2fours: 0, team2sixes: 0 },
    extras: { team1: "—" },
    highestPartnership: "—",
  },

  news: [
    {
      id: 1,
      title: "Pakistan name unchanged squad for must-win NZ clash",
      excerpt:
        "Pakistan go in with the same XI that beat Sri Lanka, banking on their experienced batting lineup.",
      time: "1 hr ago",
    },
    {
      id: 2,
      title: "Williamson fit and ready for Super 8 battle",
      excerpt:
        "NZ captain Kane Williamson has passed his fitness test and is all set to lead the Kiwis against Pakistan.",
      time: "3 hr ago",
    },
    {
      id: 3,
      title: "Pitch report: Guyana wicket likely to aid spinners",
      excerpt:
        "Curators at Providence expect a dry, slow surface ideal for spinners in the later stages of the innings.",
      time: "5 hr ago",
    },
    {
      id: 4,
      title: "Head-to-head: Pakistan edge New Zealand in T20 history",
      excerpt:
        "Of 22 T20I meetings, Pakistan lead 13-9. Recent form though shows New Zealand in rich vein of confidence.",
      time: "8 hr ago",
    },
  ],
};

// ── Match 301 — RESULT: WI vs IND ────────────────────────────────────────────
const match301: MatchDetail = {
  id: 301,
  status: "result",
  matchStatusType: "finished",
  tournament: "ICC T20 World Cup",
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

  info: {
    venue: "Kensington Oval",
    city: "Bridgetown, Barbados",
    date: "Mon, 2 Mar 2026 · 10:30 AM AST",
    format: "T20 International",
    toss: "West Indies won the toss and elected to bat",
    umpires: "Kumar Dharmasena, Marais Erasmus",
    matchReferee: "Andy Pycroft",
  },

  summary: {
    highlights: [
      "India chase down 196 with 4 balls to spare in a thrilling Super 8s clash",
      "Suryakumar Yadav's explosive 76* off 44 balls won the match for India",
      "West Indies set a challenging target of 196 thanks to Pooran's 58-ball 89",
      "Hardik Pandya took 3/28 to restrict WI after a blistering start",
      "India remain unbeaten in the Super 8s stage of the tournament",
    ],
    topPerformers: [
      {
        name: "Suryakumar Yadav",
        team: "IND",
        stat: "Player of the Match",
        detail: "76* off 44 balls · 8 fours · 4 sixes",
      },
      {
        name: "Nicholas Pooran",
        team: "WI",
        stat: "Top Scorer",
        detail: "89 off 58 balls · 9 fours · 5 sixes",
      },
      {
        name: "Hardik Pandya",
        team: "IND",
        stat: "Best Bowler",
        detail: "3/28 in 4 overs · Econ 7.0",
      },
      {
        name: "Johnson Charles",
        team: "WI",
        stat: "Opening Contribution",
        detail: "47 off 30 balls · 5 fours · 3 sixes",
      },
    ],
  },

  scorecard: {
    innings: [
      {
        team: "WI",
        flag: "🏳️",
        total: "195/4",
        overs: "20",
        batters: [
          {
            name: "Johnson Charles",
            dismissal: "c Kohli b Pandya",
            r: 47,
            b: 30,
            fours: 5,
            sixes: 3,
            sr: "156.7",
          },
          {
            name: "Kyle Mayers",
            dismissal: "b Bumrah",
            r: 18,
            b: 14,
            fours: 2,
            sixes: 1,
            sr: "128.6",
          },
          {
            name: "Nicholas Pooran",
            dismissal: "c Pant b Pandya",
            r: 89,
            b: 58,
            fours: 9,
            sixes: 5,
            sr: "153.4",
          },
          {
            name: "Rovman Powell",
            dismissal: "c Gill b Pandya",
            r: 22,
            b: 13,
            fours: 2,
            sixes: 2,
            sr: "169.2",
          },
          {
            name: "Andre Russell",
            dismissal: "not out",
            r: 19,
            b: 10,
            fours: 1,
            sixes: 2,
            sr: "190.0",
          },
        ],
        bowlers: [
          { name: "Jasprit Bumrah", o: "4", m: 0, r: 28, w: 1, econ: "7.0" },
          { name: "Arshdeep Singh", o: "4", m: 0, r: 42, w: 0, econ: "10.5" },
          { name: "Hardik Pandya", o: "4", m: 0, r: 28, w: 3, econ: "7.0" },
          { name: "Axar Patel", o: "4", m: 0, r: 44, w: 0, econ: "11.0" },
          { name: "Kuldeep Yadav", o: "4", m: 0, r: 53, w: 0, econ: "13.25" },
        ],
      },
      {
        team: "IND",
        flag: "🇮🇳",
        total: "199/5",
        overs: "19.2",
        batters: [
          {
            name: "Rohit Sharma",
            dismissal: "c Charles b Holder",
            r: 24,
            b: 18,
            fours: 3,
            sixes: 1,
            sr: "133.3",
          },
          {
            name: "Virat Kohli",
            dismissal: "c Pooran b Joseph",
            r: 35,
            b: 29,
            fours: 3,
            sixes: 1,
            sr: "120.7",
          },
          {
            name: "Suryakumar Yadav",
            dismissal: "not out",
            r: 76,
            b: 44,
            fours: 8,
            sixes: 4,
            sr: "172.7",
          },
          {
            name: "Rishabh Pant",
            dismissal: "c Powell b Russell",
            r: 28,
            b: 17,
            fours: 2,
            sixes: 2,
            sr: "164.7",
          },
          {
            name: "Hardik Pandya",
            dismissal: "c Mayers b Holder",
            r: 19,
            b: 11,
            fours: 1,
            sixes: 2,
            sr: "172.7",
          },
          {
            name: "Shivam Dube",
            dismissal: "not out",
            r: 17,
            b: 8,
            fours: 1,
            sixes: 2,
            sr: "212.5",
          },
        ],
        bowlers: [
          { name: "Jason Holder", o: "4", m: 0, r: 38, w: 2, econ: "9.5" },
          {
            name: "Alzarri Joseph",
            o: "3.2",
            m: 0,
            r: 46,
            w: 1,
            econ: "13.8",
          },
          { name: "Andre Russell", o: "4", m: 0, r: 47, w: 1, econ: "11.75" },
          { name: "Akeal Hosein", o: "4", m: 0, r: 36, w: 0, econ: "9.0" },
          { name: "Roston Chase", o: "4", m: 0, r: 32, w: 1, econ: "8.0" },
        ],
      },
    ],
  },

  stats: {
    runRate: { team1: "9.75", team2: "10.29" },
    boundaries: {
      team1fours: 19,
      team1sixes: 13,
      team2fours: 18,
      team2sixes: 12,
    },
    extras: {
      team1: "W 1  NB 2  B 0  LB 2  Total 5",
      team2: "W 2  NB 0  B 0  LB 3  Total 5",
    },
    highestPartnership:
      "61 runs (SKY & Pant, 6.3 ov) for IND; 79 runs (Charles & Pooran, 8.1 ov) for WI",
  },

  news: [
    {
      id: 1,
      title: "SKY's jaw-dropping 76* seals dramatic India victory",
      excerpt:
        "Suryakumar Yadav was at his imperious best, nailing sixes over midwicket and extra cover to take India home in style.",
      time: "Just now",
    },
    {
      id: 2,
      title: "Pooran's blitzkrieg 89 leaves India with stiff chase",
      excerpt:
        "Nicholas Pooran destroyed the Indian bowling attack, hitting nine fours and five sixes in a brutal 58-ball knock.",
      time: "1 hr ago",
    },
    {
      id: 3,
      title: "Pandya's 3-wicket haul keeps India in the game",
      excerpt:
        "Hardik Pandya showed class with the ball, removing the dangerous Pooran and Powell to peg West Indies back.",
      time: "2 hr ago",
    },
    {
      id: 4,
      title: "India march into T20 World Cup semi-finals unbeaten",
      excerpt:
        "Rohit Sharma's men have now won all five Super 8 games and are overwhelming favourites for the title.",
      time: "3 hr ago",
    },
  ],

  winners: [
    {
      rank: 1,
      name: "Aryan_Cricket88",
      team: "Team SKY",
      points: "842",
      prize: "₹25,000",
    },
    {
      rank: 2,
      name: "Priya_Fantasy11",
      team: "Dream XI Alpha",
      points: "817",
      prize: "₹10,000",
    },
    {
      rank: 3,
      name: "CricketKing99",
      team: "SKY Warriors",
      points: "794",
      prize: "₹5,000",
    },
    {
      rank: 4,
      name: "Rohit_Fan_2026",
      team: "Hitman's Army",
      points: "771",
      prize: "₹2,000",
    },
    {
      rank: 5,
      name: "FantasyGuru_IN",
      team: "Star Eleven",
      points: "758,",
      prize: "₹1,000",
    },
  ],
};

// ── Match 999 — TEST: IND vs AUS (ICC Champions Trophy Final) ─────────────────
const match999: MatchDetail = {
  id: 999,
  status: "upcoming",
  matchStatusType: "upcoming",
  tournament: "ICC Champions Trophy 2025 · Final",
  team1: { flag: "🇮🇳", code: "IND", name: "India" },
  team2: { flag: "🇦🇺", code: "AUS", name: "Australia" },
  statusText: "Starts in 1 min",

  info: {
    venue: "Narendra Modi Stadium",
    city: "Ahmedabad, India",
    date: "Mon, 2 Mar 2026 · 2:00 PM IST",
    format: "ODI",
    toss: "To be decided",
    umpires: "Aleem Dar, Richard Kettleborough",
    matchReferee: "Ranjan Madugalle",
  },

  summary: {
    highlights: [
      "India vs Australia — ICC Champions Trophy 2025 Final",
      "India topped Group A with 3 consecutive wins",
      "Australia defeated England in the semi-finals",
      "Rohit Sharma goes into the Final in red-hot form (72, 58, 81*)",
      "Pat Cummins leads Australia's bowling attack — 9 wickets in the tournament",
      "Weather forecast: clear skies, excellent batting conditions",
    ],
    topPerformers: [
      {
        name: "Rohit Sharma",
        team: "IND",
        stat: "Tournament Form",
        detail: "72, 58, 81* in last 3 matches",
      },
      {
        name: "Virat Kohli",
        team: "IND",
        stat: "Top Scorer",
        detail: "248 runs in 4 matches · Avg 82.67",
      },
      {
        name: "Pat Cummins",
        team: "AUS",
        stat: "Top Wicket-Taker",
        detail: "9 wickets · Economy 5.2",
      },
      {
        name: "David Warner",
        team: "AUS",
        stat: "Opening Form",
        detail: "Three 50+ scores in 4 matches",
      },
    ],
  },

  stats: {
    runRate: { team1: "—", team2: "—" },
    boundaries: { team1fours: 0, team1sixes: 0, team2fours: 0, team2sixes: 0 },
    extras: { team1: "—" },
    highestPartnership: "—",
  },

  news: [
    {
      id: 1,
      title: "India name unchanged XI for Champions Trophy Final",
      excerpt:
        "Rohit Sharma confirmed the same winning combination that beat South Africa in the semis will take the field.",
      time: "30 min ago",
    },
    {
      id: 2,
      title: "Cummins fit and raring to go for the Final",
      excerpt:
        "Australian captain Pat Cummins has cleared his fitness test and is set to lead the attack against India.",
      time: "1 hr ago",
    },
    {
      id: 3,
      title: "Pitch report: Ahmedabad surface to aid seamers early",
      excerpt:
        "Curators expect early movement for pacers with the pitch settling into a batting paradise by the 30th over.",
      time: "2 hr ago",
    },
    {
      id: 4,
      title: "Head-to-head: India and Australia locked at 8-8 in ODI Finals",
      excerpt:
        "The two cricketing giants have faced each other in 16 ICC finals with an equal 8-8 split — tonight one breaks the deadlock.",
      time: "3 hr ago",
    },
  ],
};

export const matchDetails: MatchDetail[] = [
  match101,
  match201,
  match301,
  match999,
];

export function getMatchDetail(id: number): MatchDetail | undefined {
  return matchDetails.find((m) => m.id === id);
}
