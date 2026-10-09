"use client";

import { useState } from "react";
import Tag from "@/components/_ui/tag";
import PageHeader from "@/components/_common/page/page-header";
import PageShell from "@/components/_common/page/page-shell";
import StatStrip from "@/components/_common/page/stat-strip";
import DataTable, { type Column } from "@/components/_common/page/data-table";
import { ClientCell, Muted, SpecialistCell } from "@/components/_common/page/cells";
import {
  INTAKE_CALLS,
  INTAKE_TONES,
  formatDay,
  relativeDay,
  type IntakeCall,
} from "@/data/ops";
import { useCompaniesStore } from "@/stores/companies-store";

const UPCOMING = ["Confirmed", "Rescheduled"];

export default function IntakeCallsPage() {
  const openDetail = useCompaniesStore((state) => state.openDetail);
  const [view, setView] = useState("upcoming");

  const upcoming = INTAKE_CALLS.filter((call) => UPCOMING.includes(call.status)).sort((a, b) =>
    (a.date + a.time).localeCompare(b.date + b.time),
  );
  const done = INTAKE_CALLS.filter((call) => !UPCOMING.includes(call.status)).sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  const completed = done.filter((call) => call.status === "Completed");
  const converted = completed.filter((call) => call.clientId);

  const columns: Column<IntakeCall>[] = [
    {
      key: "when",
      label: "When",
      render: (call) => (
        <span className="flex flex-col gap-1">
          <span className="tabular-nums">{formatDay(call.date)} · {call.time} WAT</span>
          <span className="caption-style text-subtle">{relativeDay(call.date)}</span>
        </span>
      ),
    },
    { key: "name", label: "Name", render: (call) => <ClientCell name={call.name} /> },
    { key: "interest", label: "Interested in", render: (call) => call.interest },
    { key: "where", label: "Target country", render: (call) => <Muted>{call.where}</Muted> },
    { key: "roles", label: "Target roles", render: (call) => <Muted>{call.roles}</Muted> },
    { key: "source", label: "Source", render: (call) => <Muted>{call.source}</Muted> },
    { key: "specialist", label: "Specialist", render: (call) => <SpecialistCell name={call.specialist} /> },
    { key: "status", label: "Status", render: (call) => <Tag tone={INTAKE_TONES[call.status]}>{call.status}</Tag> },
  ];

  return (
    <PageShell
      header={
        <PageHeader
          title="Intake calls"
          tabs={[
            { value: "upcoming", label: "Upcoming", count: upcoming.length },
            { value: "done", label: "Completed & missed", count: done.length },
          ]}
          tab={view}
          onTabChange={setView}
        />
      }
    >
      <StatStrip
        stats={[
          { label: "Upcoming", value: upcoming.length, hint: "Booked from the website and referrals" },
          { label: "Next 48 hours", value: upcoming.filter((call) => Date.parse(call.date) - Date.parse("2026-10-08") <= 2 * 86400000).length, hint: "Send reminders the day before" },
          { label: "Became clients", value: `${completed.length ? Math.round((converted.length / completed.length) * 100) : 0}%`, hint: "Of completed calls" },
          { label: "No-shows", value: done.filter((call) => call.status === "No-show").length, hint: "Follow up with a new slot" },
        ]}
      />
      <DataTable
        columns={columns}
        rows={view === "upcoming" ? upcoming : done}
        rowKey={(call) => call.id}
        onRowClick={(call) => call.clientId && openDetail(call.clientId)}
        rowLabel={(call) => `Intake call with ${call.name}`}
        empty="No calls in this view."
        countLabel="Calls in view"
      />
    </PageShell>
  );
}
