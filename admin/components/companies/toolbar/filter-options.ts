import {
  ACTIVITY_WINDOWS,
  OWNERS,
  SEGMENTS,
  SORT_OPTIONS,
  STAGES,
} from "@/data/companies";
import { ALL_OWNERS, ANY_STAGE } from "@/lib/companies";

export const OWNER_OPTIONS = [
  { value: ALL_OWNERS, label: "All Specialists" },
  ...OWNERS.map((owner) => ({ value: owner.name, label: owner.name })),
];

export const STAGE_OPTIONS = [
  { value: ANY_STAGE, label: "Any" },
  ...[...SEGMENTS, ...STAGES].map((tag) => ({ value: tag, label: tag })),
];

export const ACTIVITY_OPTIONS = ACTIVITY_WINDOWS.map((days) => ({
  value: String(days),
  label: `${days} Days`,
}));

export const SORT_MENU_OPTIONS = SORT_OPTIONS.map((option) => ({
  value: option.value,
  label: option.label,
}));
