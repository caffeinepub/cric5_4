export interface Slide {
  id: number;
  title: string;
  subtitle: string;
  label: string;
  image: string;
}

export const slides: Slide[] = [
  {
    id: 1,
    title: "IND vs AUS — 1st Test",
    subtitle: "Day 3 Live · Adelaide Oval · India 312/6",
    label: "LIVE NOW",
    image: "/assets/generated/slider-stadium-night.dim_1200x480.jpg",
  },
  {
    id: 2,
    title: "World Cup 2026 Full Schedule",
    subtitle: "All fixtures announced · 16 teams · 39 matches",
    label: "BREAKING",
    image: "/assets/generated/slider-batting-action.dim_1200x480.jpg",
  },
  {
    id: 3,
    title: "IPL 2026 Auction",
    subtitle: "₹2200 Cr purse finalized · Big names up for grabs",
    label: "UPCOMING",
    image: "/assets/generated/slider-ipl-trophy.dim_1200x480.jpg",
  },
];
