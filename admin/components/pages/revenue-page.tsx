"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/_ui/scroll-area";
import PageHeader from "@/components/_common/page/page-header";
import PageShell from "@/components/_common/page/page-shell";
import StatStrip from "@/components/_common/page/stat-strip";
import { PAYMENTS, REVENUE, packageOf, stageOf } from "@/data/ops";
import { useCompaniesStore } from "@/stores/companies-store";
import type { Segment } from "@/data/companies";
import { cn } from "@/lib/utils";

const SERIES: { key: Segment; color: string }[] = [
  { key: "Active Search", color: "bg-(--chart-1)" },
  { key: "Full Concierge", color: "bg-(--chart-2)" },
  { key: "CV Rewrite", color: "bg-(--chart-3)" },
];

const naira = (value: number) => `₦${value.toLocaleString("en-NG")}`;
const short = (value: number) =>
  value >= 1_000_000 ? `₦${(value / 1_000_000).toFixed(1)}m` : `₦${Math.round(value / 1000)}k`;

type Focus = { month: string; series: Segment; value: number } | null;

export default function RevenuePage() {
  const [focus, setFocus] = useState<Focus>(null);
  const companies = useCompaniesStore((state) => state.companies);
  const current = REVENUE[REVENUE.length - 1];
  const previous = REVENUE[REVENUE.length - 2];
  const recurring = companies
    .filter((client) => packageOf(client) !== "CV Rewrite" && !["Intake booked", "Agreement sent", "Paused"].includes(stageOf(client)))
    .reduce((sum, client) => sum + client.pipelineValue, 0);
  const oneOffs = PAYMENTS.filter((payment) => payment.period === "One-off" && payment.status === "Paid" && payment.date.startsWith(current.key))
    .reduce((sum, payment) => sum + payment.amount, 0);
  const projected = recurring + oneOffs;
  const max = Math.max(...REVENUE.map((month) => month.total));
  const ceiling = Math.ceil(max / 500000) * 500000;
  const ticks = [ceiling, ceiling / 2, 0];
  const total = REVENUE.reduce((sum, month) => sum + month.total, 0);

  return (
    <PageShell header={<PageHeader title="Monthly revenue" status="Sample data" />}>
      <ScrollArea className="min-h-0 flex-1">
        <StatStrip
          stats={[
            { label: `Collected in ${current.label}`, value: naira(current.total), hint: "Month to date" },
            { label: `Collected in ${previous.label}`, value: naira(previous.total), hint: "Full month" },
            { label: `Projected for ${current.label.slice(0, 3)}`, value: naira(projected), hint: "Recurring renewals plus one-offs" },
            { label: "Four-month total", value: naira(total), hint: `${REVENUE[0].label} to ${current.label}` },
          ]}
        />

        <section className="flex flex-col gap-5 p-5" aria-labelledby="revenue-chart-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <h2 id="revenue-chart-title">Revenue by package</h2>
              <p className="text-subtle">Successful payments per month. Failed and refunded payments are excluded.</p>
            </div>
            <ul className="caption-style flex flex-wrap items-center gap-4" aria-label="Legend">
              {SERIES.map((series) => (
                <li key={series.key} className="text-soft flex items-center gap-1.5">
                  <span aria-hidden className={cn("size-2.5 rounded-[2px]", series.color)} />
                  {series.key}
                </li>
              ))}
            </ul>
          </div>

          <p className="caption-style text-soft h-3" aria-live="polite">
            {focus ? `${focus.month} · ${focus.series} · ${naira(focus.value)}` : "Hover or focus a bar segment for its value."}
          </p>

          <div className="relative grid grid-cols-[48px_1fr] gap-3">
            <div className="caption-style text-subtle flex h-[240px] flex-col justify-between text-right tabular-nums" aria-hidden>
              {ticks.map((tick) => (
                <span key={tick} className="-translate-y-1/2 first:translate-y-0 last:translate-y-0">{short(tick)}</span>
              ))}
            </div>
            <div className="relative h-[240px]">
              <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                {ticks.map((tick) => (
                  <span key={tick} className="border-border block border-t" />
                ))}
              </div>
              <div className="relative flex h-full items-end justify-around gap-4 px-2">
                {REVENUE.map((month) => (
                  <div key={month.key} className="flex h-full w-full max-w-[72px] flex-col items-center justify-end gap-2">
                    <span className="caption-style text-foreground tabular-nums">{short(month.total)}</span>
                    <div
                      className="flex w-full flex-col-reverse gap-[2px]"
                      style={{ height: `${(month.total / ceiling) * 100}%` }}
                    >
                      {SERIES.filter((series) => month.byPackage[series.key] > 0).map((series, index, list) => (
                        <button
                          key={series.key}
                          type="button"
                          aria-label={`${month.label}, ${series.key}: ${naira(month.byPackage[series.key])}`}
                          onMouseEnter={() => setFocus({ month: month.label, series: series.key, value: month.byPackage[series.key] })}
                          onFocus={() => setFocus({ month: month.label, series: series.key, value: month.byPackage[series.key] })}
                          onMouseLeave={() => setFocus(null)}
                          onBlur={() => setFocus(null)}
                          className={cn(
                            "w-full min-h-[3px] cursor-default outline-none transition-opacity duration-150 focus-visible:ring-2 focus-visible:ring-ring",
                            series.color,
                            index === list.length - 1 && "rounded-t-[4px]",
                            focus && (focus.month !== month.label || focus.series !== series.key) && "opacity-45",
                          )}
                          style={{ flexGrow: month.byPackage[series.key] }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-[48px_1fr] gap-3" aria-hidden>
            <span />
            <div className="caption-style text-subtle flex justify-around gap-4 px-2">
              {REVENUE.map((month) => (
                <span key={month.key} className="w-full max-w-[72px] text-center">{month.label.slice(0, 3)}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="border-border border-t p-5" aria-labelledby="revenue-table-title">
          <h2 id="revenue-table-title" className="mb-4">Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-[14px]">
              <thead>
                <tr className="caption-style text-subtle border-border border-b text-left">
                  <th className="py-3 pr-4 font-normal">Month</th>
                  {SERIES.map((series) => (
                    <th key={series.key} className="py-3 pr-4 text-right font-normal">{series.key}</th>
                  ))}
                  <th className="py-3 text-right font-normal">Total</th>
                </tr>
              </thead>
              <tbody>
                {REVENUE.map((month) => (
                  <tr key={month.key} className="border-border border-b">
                    <td className="py-3 pr-4">{month.label}</td>
                    {SERIES.map((series) => (
                      <td key={series.key} className="text-soft py-3 pr-4 text-right tabular-nums">{naira(month.byPackage[series.key])}</td>
                    ))}
                    <td className="py-3 text-right font-medium tabular-nums">{naira(month.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </ScrollArea>
    </PageShell>
  );
}
