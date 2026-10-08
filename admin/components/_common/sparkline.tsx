import { TREND_PATTERN } from "@/data/companies";
import { cn } from "@/lib/utils";

type SparklineProps = {
  values: number[];
  className?: string;
};

const HEIGHT_CLASS: Record<number, string> = {
  1: "h-px",
  2: "h-[2px]",
  3: "h-[3px]",
  4: "h-1",
  5: "h-[5px]",
  6: "h-1.5",
  7: "h-[7px]",
  8: "h-2",
  9: "h-[9px]",
  10: "h-2.5",
  11: "h-[11px]",
  12: "h-3",
  13: "h-[13px]",
  14: "h-3.5",
};

export default function Sparkline({ values, className }: SparklineProps) {
  return (
    <span
      aria-hidden
      className={cn("flex h-[14px] items-end gap-px", className)}
    >
      {values.map((value, index) => (
        <span
          key={index}
          className={cn(
            "w-1 shrink-0 rounded-[1px]",
            HEIGHT_CLASS[Math.min(14, Math.max(1, Math.round(value)))],
            TREND_PATTERN[index % TREND_PATTERN.length]
              ? "bg-trend"
              : "bg-trend-muted",
          )}
        />
      ))}
    </span>
  );
}
