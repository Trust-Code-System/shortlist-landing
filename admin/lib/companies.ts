import type { Company, SortKey, Stage } from "@/data/companies";

export type CompanyFilters = {
  sortBy: SortKey;
  owner: string;
  stage: string;
  activityWindow: number;
};

export const TODAY = "2026-10-08";

export const ALL_OWNERS = "all";
export const ANY_STAGE = "any";

export const DEFAULT_FILTERS: CompanyFilters = {
  sortBy: "pipelineValue",
  owner: ALL_OWNERS,
  stage: ANY_STAGE,
  activityWindow: 90,
};

export function activeFilterCount({
  owner,
  stage,
  activityWindow,
}: CompanyFilters) {
  return [
    owner !== DEFAULT_FILTERS.owner,
    stage !== DEFAULT_FILTERS.stage,
    activityWindow !== DEFAULT_FILTERS.activityWindow,
  ].filter(Boolean).length;
}

const TAG_CHAR_BUDGET = 30;

export const ALL_MARKETS = "all";

export const CLIENT_VIEWS: { value: string; label: string; stages?: Stage[] }[] = [
  { value: "all", label: "All clients" },
  { value: "onboarding", label: "Onboarding", stages: ["Intake booked", "Agreement sent", "CV in progress"] },
  { value: "searching", label: "Searching", stages: ["Applying", "Interviewing"] },
  { value: "offers", label: "Offers", stages: ["Offer received"] },
  { value: "paused", label: "Paused", stages: ["Paused"] },
];

export type ClientScope = { market?: string; view?: string };

export function inScope(company: Company, { market, view }: ClientScope = {}) {
  if (market && market !== ALL_MARKETS && company.market !== market) return false;
  const stages = CLIENT_VIEWS.find((item) => item.value === view)?.stages;
  if (stages && !company.tags.some((tag) => (stages as string[]).includes(tag))) return false;
  return true;
}

export function filterCompanies(
  companies: Company[],
  { sortBy, owner, stage, activityWindow }: CompanyFilters,
  scope: ClientScope = {},
): Company[] {
  const filtered = companies.filter((company) => {
    if (!inScope(company, scope)) return false;
    if (owner !== ALL_OWNERS && company.owner !== owner) return false;
    if (stage !== ANY_STAGE && !company.tags.some((tag) => tag === stage)) {
      return false;
    }
    return company.activityDays <= activityWindow;
  });

  return filtered.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "lastInteraction":
        return b.lastInteraction.date.localeCompare(a.lastInteraction.date);
      case "openDeals":
        return b.openDeals - a.openDeals;
      case "winProbability":
        return b.winProbability - a.winProbability;
      default:
        return b.pipelineValue - a.pipelineValue;
    }
  });
}

export function companiesCsvRows(companies: Company[]) {
  return [
    [
      "Client",
      "Package & Stage",
      "Specialist",
      "Applications Sent",
      "Monthly Value (NGN)",
      "Response Rate (%)",
      "Last Touchpoint Date",
      "Last Touchpoint",
      "Market",
    ],
    ...companies.map((company) => [
      company.name,
      company.tags.join("; "),
      company.owner,
      company.openDeals,
      company.pipelineValue,
      company.winProbability,
      company.lastInteraction.date,
      company.lastInteraction.label,
      company.market,
    ]),
  ];
}

export function splitTags(tags: Company["tags"]) {
  let used = 0;
  const visible: Company["tags"] = [];

  for (const tag of tags) {
    if (visible.length === 2 || used + tag.length > TAG_CHAR_BUDGET) break;
    visible.push(tag);
    used += tag.length;
  }

  if (visible.length === 0 && tags.length > 0) visible.push(tags[0]);

  return { visible, hidden: tags.length - visible.length };
}

export function companyHealth(company: Company) {
  return {
    discovery: Math.round(company.winProbability * 0.372),
    evaluation: Math.round(company.winProbability * 0.651),
    procurement: Math.round(company.winProbability * 0.372),
  };
}

export function companyActivity(company: Company) {
  const deals = company.openDeals;
  return {
    total: deals * 15,
    touches: deals * 4,
    emails: deals + 4,
    meetings: Math.ceil(deals / 2),
    calls: deals + 1,
  };
}

export function formatDate(iso: string) {
  const [, month, day] = iso.split("-").map(Number);
  const names = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${names[month - 1]} ${day}`;
}

export function formatMoney(value: number) {
  return value.toLocaleString("en-NG");
}

export function daysSince(iso: string) {
  const day = 24 * 60 * 60 * 1000;
  return Math.max(0, Math.round((Date.parse(TODAY) - Date.parse(iso)) / day));
}
