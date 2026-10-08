import type { ReactNode } from "react";

export type Stat = { label: string; value: ReactNode; hint?: string };

export default function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <div className="border-border bg-background grid shrink-0 grid-cols-2 gap-px border-b p-px lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="outline-border flex flex-col gap-2.5 p-4 outline-1"
        >
          <span className="caption-style text-subtle block">{stat.label}</span>
          <span className="block text-[22px] leading-none font-semibold tracking-[-0.02em] tabular-nums">
            {stat.value}
          </span>
          {stat.hint && (
            <span className="caption-style text-subtle block">{stat.hint}</span>
          )}
        </div>
      ))}
    </div>
  );
}
