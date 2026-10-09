export const SEGMENTS = ["Readiness", "Starter", "Standard", "Full Service"] as const;

export const PACKAGE_PRICES: Record<(typeof SEGMENTS)[number], number> = {
  Readiness: 60000,
  Starter: 45000,
  Standard: 180000,
  "Full Service": 300000,
};

export const STAGES = [
  "Intake booked",
  "Agreement sent",
  "CV in progress",
  "Applying",
  "Interviewing",
  "Offer received",
  "Paused",
] as const;

export const MARKETS = [
  "United Kingdom",
  "Canada",
  "Germany",
  "Australia",
  "Singapore",
  "Malaysia",
  "Russia",
] as const;

export type Market = (typeof MARKETS)[number];

export const REGIONS = [
  { slug: "uk-europe", label: "UK & Europe", markets: ["United Kingdom", "Germany", "Russia"] },
  { slug: "canada", label: "Canada", markets: ["Canada"] },
  { slug: "asia-pacific", label: "Asia-Pacific", markets: ["Australia", "Singapore", "Malaysia"] },
] as const satisfies readonly { slug: string; label: string; markets: readonly Market[] }[];

export function regionOf(market: Market) {
  return REGIONS.find((region) => (region.markets as readonly Market[]).includes(market))?.label ?? "";
}

export type Segment = (typeof SEGMENTS)[number];
export type Stage = (typeof STAGES)[number];
export type Tag = Segment | Stage;

export type TagTone =
  | "blue"
  | "purple"
  | "green"
  | "moss"
  | "red"
  | "orange"
  | "amber"
  | "teal"
  | "yellow"
  | "neutral";

export const TAG_TONES: Record<Tag, TagTone> = {
  Readiness: "moss",
  Starter: "neutral",
  Standard: "blue",
  "Full Service": "purple",
  "Intake booked": "teal",
  "Agreement sent": "amber",
  "CV in progress": "yellow",
  Applying: "green",
  Interviewing: "orange",
  "Offer received": "moss",
  Paused: "red",
};

export type Owner = {
  name: string;
  avatar: string;
  email: string;
  phone: string;
  role: string;
};

const AVATAR_TONES = [
  ["#33302A", "#E8D9A8"],
  ["#2A3340", "#B9CBE6"],
  ["#3A2D33", "#E6BFCD"],
  ["#2D3A35", "#B5DCC8"],
  ["#3A332A", "#E6CFA8"],
  ["#302D3A", "#CBC2EA"],
];

export function initialsAvatar(name: string) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const [bg, fg] = AVATAR_TONES[hash % AVATAR_TONES.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="${bg}"/><text x="20" y="25.5" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="15" font-weight="600" fill="${fg}">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const OWNER_NAMES = [
  "Ngozi Eze",
  "Tunde Bakare",
  "Amaka Obi",
  "Ifeanyi Nwosu",
  "Halima Bello",
  "Seyi Adeyemi",
  "Kemi Lawal",
  "Emeka Okonkwo",
];

export const OWNERS: Owner[] = OWNER_NAMES.map((name, i) => ({
  name,
  avatar: initialsAvatar(name),
  email: `${name.split(" ")[0].toLowerCase()}@shortlist.ng`,
  phone: `+234 80${(i % 3) + 3} ${String(214 + i * 37).padStart(3, "0")} ${String(4410 + i * 263).slice(-4)}`,
  role: i % 3 === 0 ? "Senior Career Specialist" : "Career Specialist",
}));

export const CURRENT_USER: Owner = {
  name: "Funmi Adebayo",
  avatar: initialsAvatar("Funmi Adebayo"),
  email: "funmi@shortlist.ng",
  phone: "+234 809 120 3301",
  role: "Head of Client Success",
};

export function ownerByName(name: string): Owner {
  return OWNERS.find((owner) => owner.name === name) ?? OWNERS[0];
}

export function profileByName(name: string): Owner {
  return name === CURRENT_USER.name ? CURRENT_USER : ownerByName(name);
}

export type Company = {
  id: string;
  name: string;
  tags: Tag[];
  owner: string;
  openDeals: number;
  pipelineValue: number;
  winProbability: number;
  trend: number[];
  lastInteraction: { date: string; label: string };
  activityDays: number;
  market: Market;
  logo?: string;
};

export const TREND_PATTERN = [
  false,
  true,
  true,
  false,
  true,
  true,
  false,
  true,
  false,
  true,
  false,
  true,
  true,
  false,
];

export const DEFAULT_TREND = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

const TREND_A = [4, 4, 10, 3, 2, 4, 7, 4, 11, 4, 11, 7, 4, 14];
const TREND_B = [4, 4, 5, 5, 2, 7, 11, 7, 5, 7, 5, 3, 7, 14];
const TREND_C = [4, 4, 10, 5, 2, 7, 11, 7, 11, 7, 11, 7, 7, 14];
const TREND_D = [4, 4, 5, 12, 5, 7, 11, 3, 11, 3, 11, 3, 7, 14];
const TREND_SLOW = [6, 5, 5, 4, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

const COMPANY_RECORDS: Company[] = [
  {
    id: "adaeze-okafor",
    name: "Adaeze Okafor",
    tags: ["Standard", "Applying"],
    owner: "Ngozi Eze",
    openDeals: 24,
    pipelineValue: 180000,
    winProbability: 38,
    trend: TREND_A,
    lastInteraction: { date: "2026-10-07", label: "Shortlist approved" },
    market: "United Kingdom",
    activityDays: 1,
  },
  {
    id: "chinedu-okeke",
    name: "Chinedu Okeke",
    tags: ["Full Service", "Interviewing"],
    owner: "Tunde Bakare",
    openDeals: 41,
    pipelineValue: 300000,
    winProbability: 46,
    trend: TREND_C,
    lastInteraction: { date: "2026-10-06", label: "Mock interview" },
    market: "United Kingdom",
    activityDays: 2,
  },
  {
    id: "fatima-sule",
    name: "Fatima Sule",
    tags: ["Starter", "CV in progress"],
    owner: "Amaka Obi",
    openDeals: 0,
    pipelineValue: 45000,
    winProbability: 0,
    trend: DEFAULT_TREND,
    lastInteraction: { date: "2026-10-05", label: "CV draft sent" },
    market: "Canada",
    activityDays: 3,
  },
  {
    id: "oluwaseun-ajayi",
    name: "Oluwaseun Ajayi",
    tags: ["Standard", "Interviewing"],
    owner: "Ifeanyi Nwosu",
    openDeals: 28,
    pipelineValue: 180000,
    winProbability: 52,
    trend: TREND_D,
    lastInteraction: { date: "2026-10-07", label: "Interview invite" },
    market: "Germany",
    activityDays: 1,
  },
  {
    id: "blessing-udoh",
    name: "Blessing Udoh",
    tags: ["Standard", "Agreement sent"],
    owner: "Halima Bello",
    openDeals: 0,
    pipelineValue: 180000,
    winProbability: 0,
    trend: DEFAULT_TREND,
    lastInteraction: { date: "2026-10-06", label: "Agreement sent" },
    market: "Canada",
    activityDays: 2,
  },
  {
    id: "ibrahim-musa",
    name: "Ibrahim Musa",
    tags: ["Full Service", "Offer received"],
    owner: "Seyi Adeyemi",
    openDeals: 57,
    pipelineValue: 300000,
    winProbability: 61,
    trend: TREND_C,
    lastInteraction: { date: "2026-10-04", label: "Offer review" },
    market: "Canada",
    activityDays: 4,
  },
  {
    id: "chiamaka-nnadi",
    name: "Chiamaka Nnadi",
    tags: ["Starter", "Intake booked"],
    owner: "Kemi Lawal",
    openDeals: 0,
    pipelineValue: 45000,
    winProbability: 0,
    trend: DEFAULT_TREND,
    lastInteraction: { date: "2026-10-03", label: "Call booked" },
    market: "Australia",
    activityDays: 5,
  },
  {
    id: "temitope-alade",
    name: "Temitope Alade",
    tags: ["Standard", "Applying"],
    owner: "Ngozi Eze",
    openDeals: 19,
    pipelineValue: 180000,
    winProbability: 27,
    trend: TREND_B,
    lastInteraction: { date: "2026-09-30", label: "Applications sent" },
    market: "United Kingdom",
    activityDays: 8,
  },
  {
    id: "yusuf-danjuma",
    name: "Yusuf Danjuma",
    tags: ["Standard", "Paused"],
    owner: "Tunde Bakare",
    openDeals: 12,
    pipelineValue: 180000,
    winProbability: 17,
    trend: TREND_SLOW,
    lastInteraction: { date: "2026-09-12", label: "Check-in call" },
    market: "Germany",
    activityDays: 26,
  },
  {
    id: "nkechi-agu",
    name: "Nkechi Agu",
    tags: ["Full Service", "Applying"],
    owner: "Amaka Obi",
    openDeals: 36,
    pipelineValue: 300000,
    winProbability: 33,
    trend: TREND_A,
    lastInteraction: { date: "2026-10-02", label: "Applications sent" },
    market: "Canada",
    activityDays: 6,
  },
  {
    id: "damilola-ojo",
    name: "Damilola Ojo",
    tags: ["Readiness", "CV in progress"],
    owner: "Ifeanyi Nwosu",
    openDeals: 0,
    pipelineValue: 60000,
    winProbability: 0,
    trend: DEFAULT_TREND,
    lastInteraction: { date: "2026-09-29", label: "Roadmap sent" },
    market: "Malaysia",
    activityDays: 9,
  },
  {
    id: "ebuka-nwankwo",
    name: "Ebuka Nwankwo",
    tags: ["Standard", "Interviewing"],
    owner: "Halima Bello",
    openDeals: 31,
    pipelineValue: 180000,
    winProbability: 44,
    trend: TREND_C,
    lastInteraction: { date: "2026-10-01", label: "Interview invite" },
    market: "Australia",
    activityDays: 7,
  },
  {
    id: "zainab-abubakar",
    name: "Zainab Abubakar",
    tags: ["Full Service", "Interviewing"],
    owner: "Seyi Adeyemi",
    openDeals: 48,
    pipelineValue: 300000,
    winProbability: 50,
    trend: TREND_D,
    lastInteraction: { date: "2026-10-06", label: "Mock interview" },
    market: "United Kingdom",
    activityDays: 2,
  },
  {
    id: "kelechi-ibe",
    name: "Kelechi Ibe",
    tags: ["Standard", "Applying"],
    owner: "Kemi Lawal",
    openDeals: 22,
    pipelineValue: 180000,
    winProbability: 31,
    trend: TREND_B,
    lastInteraction: { date: "2026-09-25", label: "Shortlist approved" },
    market: "Singapore",
    activityDays: 13,
  },
  {
    id: "folake-ogunleye",
    name: "Folake Ogunleye",
    tags: ["Starter", "CV in progress"],
    owner: "Amaka Obi",
    openDeals: 0,
    pipelineValue: 45000,
    winProbability: 0,
    trend: DEFAULT_TREND,
    lastInteraction: { date: "2026-10-01", label: "CV draft sent" },
    market: "United Kingdom",
    activityDays: 7,
  },
  {
    id: "obinna-chukwu",
    name: "Obinna Chukwu",
    tags: ["Standard", "Intake booked"],
    owner: "Emeka Okonkwo",
    openDeals: 0,
    pipelineValue: 180000,
    winProbability: 0,
    trend: DEFAULT_TREND,
    lastInteraction: { date: "2026-10-07", label: "Call booked" },
    market: "Germany",
    activityDays: 1,
  },
  {
    id: "aisha-lawan",
    name: "Aisha Lawan",
    tags: ["Full Service", "Agreement sent"],
    owner: "Emeka Okonkwo",
    openDeals: 0,
    pipelineValue: 300000,
    winProbability: 0,
    trend: DEFAULT_TREND,
    lastInteraction: { date: "2026-10-05", label: "Agreement sent" },
    market: "Australia",
    activityDays: 3,
  },
  {
    id: "segun-afolabi",
    name: "Segun Afolabi",
    tags: ["Standard", "Paused"],
    owner: "Ngozi Eze",
    openDeals: 9,
    pipelineValue: 180000,
    winProbability: 22,
    trend: TREND_SLOW,
    lastInteraction: { date: "2026-08-28", label: "No reply" },
    market: "Russia",
    activityDays: 41,
  },
];

export const COMPANIES: Company[] = COMPANY_RECORDS;

export const SORT_OPTIONS = [
  { value: "pipelineValue", label: "Package Value" },
  { value: "winProbability", label: "Response Rate" },
  { value: "openDeals", label: "Applications Sent" },
  { value: "lastInteraction", label: "Last Touchpoint" },
  { value: "name", label: "Client Name" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export const INTERACTION_TYPES = [
  "Call booked",
  "Intake call",
  "Agreement sent",
  "Payment received",
  "CV draft sent",
  "Revision 2",
  "Roadmap sent",
  "Reassessment call",
  "CV approved",
  "Shortlist approved",
  "Applications sent",
  "Interview invite",
  "Mock interview",
  "Check-in call",
  "Offer review",
] as const;

export const ACTIVITY_WINDOWS = [7, 30, 60, 90] as const;

export type ActivityWindow = (typeof ACTIVITY_WINDOWS)[number];

export const TREND_WINDOWS = ["Last 7 Days", "Last 30 Days", "Last 90 Days"];

export type ScoreCard = {
  title: string;
  description: string;
  reviewer: string;
  reviewerAvatar: string;
  updated: string;
  verdict: string;
  stars: number;
};

export const SCORE_CARDS: ScoreCard[] = [
  {
    title: "CV quality",
    description:
      "How strongly the CV reads for the target roles after rewrites and revisions.",
    reviewer: "Amaka Obi",
    reviewerAvatar: initialsAvatar("Amaka Obi"),
    updated: "Updated 2h ago",
    verdict: "Ready to send",
    stars: 4,
  },
  {
    title: "Interview readiness",
    description:
      "Structure, confidence and examples in mock interviews so far.",
    reviewer: "Tunde Bakare",
    reviewerAvatar: initialsAvatar("Tunde Bakare"),
    updated: "Updated yesterday",
    verdict: "One more mock",
    stars: 3,
  },
  {
    title: "Market fit",
    description:
      "How well their experience matches the roles, salary and locations they want.",
    reviewer: "Seyi Adeyemi",
    reviewerAvatar: initialsAvatar("Seyi Adeyemi"),
    updated: "Updated 3d ago",
    verdict: "Strong match",
    stars: 4,
  },
];
