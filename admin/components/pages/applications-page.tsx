"use client";

import { useMemo, useState } from "react";
import Button from "@/components/_ui/button";
import Tag from "@/components/_ui/tag";
import FilterMenu from "@/components/_common/filter-menu";
import PageHeader from "@/components/_common/page/page-header";
import PageShell from "@/components/_common/page/page-shell";
import StatStrip from "@/components/_common/page/stat-strip";
import DataTable, { type Column } from "@/components/_common/page/data-table";
import { ClientCell, Muted, SpecialistCell } from "@/components/_common/page/cells";
import { OWNERS } from "@/data/companies";
import {
  APPLICATIONS,
  APPLICATION_TONES,
  clientById,
  formatDay,
  type Application,
  type ApplicationStatus,
} from "@/data/ops";
import { downloadCsv } from "@/lib/csv";
import { useCompaniesStore } from "@/stores/companies-store";
import ShareIcon from "@/public/assets/images/companies/toolbar/share.svg";

const VIEWS: { value: string; label: string; statuses?: ApplicationStatus[] }[] = [
  { value: "all", label: "All" },
  { value: "approval", label: "Awaiting approval", statuses: ["Awaiting approval"] },
  { value: "progress", label: "In progress", statuses: ["Sent", "Viewed", "Replied"] },
  { value: "interviews", label: "Interviews & offers", statuses: ["Interview", "Offer"] },
  { value: "closed", label: "Not progressed", statuses: ["Not progressed"] },
];

const ALL = "all";

export default function ApplicationsPage() {
  const openDetail = useCompaniesStore((state) => state.openDetail);
  const [view, setView] = useState("all");
  const [owner, setOwner] = useState(ALL);

  const scoped = useMemo(
    () =>
      APPLICATIONS.filter(
        (app) => owner === ALL || clientById(app.clientId)?.owner === owner,
      ),
    [owner],
  );

  const rows = useMemo(() => {
    const statuses = VIEWS.find((item) => item.value === view)?.statuses;
    return scoped
      .filter((app) => !statuses || statuses.includes(app.status))
      .sort((a, b) => (b.sent ?? "9999").localeCompare(a.sent ?? "9999"));
  }, [scoped, view]);

  const sent = scoped.filter((app) => app.sent);
  const responded = sent.filter((app) =>
    ["Replied", "Interview", "Offer"].includes(app.status),
  );

  const columns: Column<Application>[] = [
    { key: "client", label: "Client", render: (app) => <ClientCell name={clientById(app.clientId)?.name ?? ""} /> },
    { key: "role", label: "Role", render: (app) => app.role },
    { key: "employer", label: "Employer", render: (app) => app.employer },
    { key: "location", label: "Location", render: (app) => <Muted>{app.location}</Muted> },
    { key: "sent", label: "Sent", render: (app) => (app.sent ? <span className="tabular-nums">{formatDay(app.sent)}</span> : <Muted>Not sent</Muted>) },
    { key: "status", label: "Status", render: (app) => <Tag tone={APPLICATION_TONES[app.status]}>{app.status}</Tag> },
    { key: "specialist", label: "Specialist", render: (app) => <SpecialistCell name={clientById(app.clientId)?.owner ?? ""} /> },
  ];

  function exportCsv() {
    downloadCsv("applications.csv", [
      ["Client", "Role", "Employer", "Location", "Sent", "Status"],
      ...rows.map((app) => [clientById(app.clientId)?.name ?? "", app.role, app.employer, app.location, app.sent ?? "", app.status]),
    ]);
  }

  return (
    <PageShell
      header={
        <PageHeader
          title="Applications"
          tabs={VIEWS.map((item) => ({
            value: item.value,
            label: item.label,
            count: scoped.filter((app) => !item.statuses || item.statuses.includes(app.status)).length,
          }))}
          tab={view}
          onTabChange={setView}
        />
      }
      toolbar={
        <>
          <FilterMenu
            label="Specialist"
            value={owner}
            options={[{ value: ALL, label: "All Specialists" }, ...OWNERS.map((item) => ({ value: item.name, label: item.name }))]}
            onChange={setOwner}
          />
          <Button variant="secondary" size="sm" onClick={exportCsv}>
            <ShareIcon aria-hidden className="size-3" />
            Export
          </Button>
        </>
      }
    >
      <StatStrip
        stats={[
          { label: "Sent", value: sent.length, hint: "Across all active searches" },
          { label: "Awaiting approval", value: scoped.filter((app) => app.status === "Awaiting approval").length, hint: "Shortlists clients haven’t approved" },
          { label: "Response rate", value: `${sent.length ? Math.round((responded.length / sent.length) * 100) : 0}%`, hint: "Replied, interview or offer" },
          { label: "Interviews & offers", value: scoped.filter((app) => ["Interview", "Offer"].includes(app.status)).length, hint: "From these applications" },
        ]}
      />
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(app) => app.id}
        onRowClick={(app) => openDetail(app.clientId)}
        rowLabel={(app) => `${app.role} at ${app.employer}, open client`}
        empty="No applications in this view."
        countLabel="Applications in view"
      />
    </PageShell>
  );
}
