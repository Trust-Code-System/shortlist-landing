"use client";

import { useMemo, useState } from "react";
import Avatar from "@/components/_ui/avatar";
import Tag from "@/components/_ui/tag";
import PageHeader from "@/components/_common/page/page-header";
import PageShell from "@/components/_common/page/page-shell";
import StatStrip from "@/components/_common/page/stat-strip";
import DataTable, { type Column } from "@/components/_common/page/data-table";
import { ClientCell, Muted } from "@/components/_common/page/cells";
import {
  COACHES,
  INTERVIEWS,
  PREP_TONES,
  clientById,
  formatDay,
  relativeDay,
  type Interview,
} from "@/data/ops";
import { useCompaniesStore } from "@/stores/companies-store";

export default function InterviewsPage() {
  const openDetail = useCompaniesStore((state) => state.openDetail);
  const [view, setView] = useState("upcoming");

  const upcoming = INTERVIEWS.filter((item) => !item.outcome).sort((a, b) =>
    (a.date + a.time).localeCompare(b.date + b.time),
  );
  const past = INTERVIEWS.filter((item) => item.outcome).sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  const rows = view === "upcoming" ? upcoming : past;

  const columns = useMemo<Column<Interview>[]>(() => {
    const base: Column<Interview>[] = [
      {
        key: "when",
        label: "When",
        render: (item) => (
          <span className="flex flex-col gap-1">
            <span className="tabular-nums">{formatDay(item.date)} · {item.time}</span>
            <span className="caption-style text-subtle">{relativeDay(item.date)}</span>
          </span>
        ),
      },
      { key: "client", label: "Client", render: (item) => <ClientCell name={clientById(item.clientId)?.name ?? ""} /> },
      {
        key: "role",
        label: "Role",
        render: (item) => (
          <span className="flex flex-col gap-1">
            <span>{item.role}</span>
            <span className="caption-style text-subtle">{item.employer}</span>
          </span>
        ),
      },
      { key: "round", label: "Round", render: (item) => item.round },
      { key: "format", label: "Format", render: (item) => <Muted>{item.format}</Muted> },
      { key: "prep", label: "Prep", render: (item) => <Tag tone={PREP_TONES[item.prep]}>{item.prep}</Tag> },
      {
        key: "coach",
        label: "Coach",
        render: (item) => {
          const coach = COACHES.find((c) => c.name === item.coach);
          return (
            <span className="flex items-center gap-1.5">
              {coach && <Avatar src={coach.avatar} alt="" />}
              {item.coach}
            </span>
          );
        },
      },
    ];
    return view === "past"
      ? [...base.filter((column) => column.key !== "prep"), { key: "outcome", label: "Outcome", render: (item) => <Tag tone={item.outcome === "Offer made" ? "moss" : "green"}>{item.outcome}</Tag> }]
      : base;
  }, [view]);

  const thisWeek = upcoming.filter((item) => Date.parse(item.date) - Date.parse("2026-10-08") <= 6 * 86400000);

  return (
    <PageShell
      header={
        <PageHeader
          title="Interviews"
          tabs={[
            { value: "upcoming", label: "Upcoming", count: upcoming.length },
            { value: "past", label: "Past", count: past.length },
          ]}
          tab={view}
          onTabChange={setView}
        />
      }
    >
      <StatStrip
        stats={[
          { label: "This week", value: thisWeek.length, hint: "Interviews in the next 7 days" },
          { label: "Prep needed", value: upcoming.filter((item) => item.prep === "Prep needed").length, hint: "Book a mock with a coach" },
          { label: "Mocks done", value: `${upcoming.length ? Math.round((upcoming.filter((item) => item.prep === "Mock done").length / upcoming.length) * 100) : 0}%`, hint: "Of upcoming interviews" },
          { label: "Offers", value: past.filter((item) => item.outcome === "Offer made").length, hint: "From past interviews" },
        ]}
      />
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(item) => item.id}
        onRowClick={(item) => openDetail(item.clientId)}
        rowLabel={(item) => `${item.round} interview for ${item.role} at ${item.employer}, open client`}
        empty="No interviews in this view."
        countLabel="Interviews in view"
      />
    </PageShell>
  );
}
