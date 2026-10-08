"use client";

import { useState, type MouseEvent } from "react";
import Button from "@/components/_ui/button";
import Tag from "@/components/_ui/tag";
import PageHeader from "@/components/_common/page/page-header";
import PageShell from "@/components/_common/page/page-shell";
import StatStrip from "@/components/_common/page/stat-strip";
import DataTable, { type Column } from "@/components/_common/page/data-table";
import { ClientCell, Money, Muted, SpecialistCell } from "@/components/_common/page/cells";
import { TAG_TONES } from "@/data/companies";
import {
  AGREEMENTS,
  AGREEMENT_TONES,
  clientById,
  formatDay,
  packageOf,
  type Agreement,
} from "@/data/ops";
import { useCompaniesStore } from "@/stores/companies-store";

export default function AgreementsPage() {
  const openDetail = useCompaniesStore((state) => state.openDetail);
  const [view, setView] = useState("all");
  const [reminded, setReminded] = useState<string[]>([]);

  const unsigned = AGREEMENTS.filter((item) => item.status !== "Signed");
  const signed = AGREEMENTS.filter((item) => item.status === "Signed");
  const rows = (view === "unsigned" ? unsigned : view === "signed" ? signed : AGREEMENTS)
    .slice()
    .sort((a, b) => b.sent.localeCompare(a.sent));

  function remind(event: MouseEvent, id: string) {
    event.stopPropagation();
    setReminded((current) => [...current, id]);
  }

  const columns: Column<Agreement>[] = [
    { key: "client", label: "Client", render: (item) => <ClientCell name={clientById(item.clientId)?.name ?? ""} /> },
    {
      key: "package",
      label: "Package",
      render: (item) => {
        const client = clientById(item.clientId);
        return client ? <Tag tone={TAG_TONES[packageOf(client)]}>{packageOf(client)}</Tag> : null;
      },
    },
    { key: "value", label: "Value", align: "end", render: (item) => <Money value={clientById(item.clientId)?.pipelineValue ?? 0} /> },
    { key: "sent", label: "Sent", render: (item) => <span className="tabular-nums">{formatDay(item.sent)}</span> },
    { key: "signed", label: "Signed", render: (item) => (item.signed ? <span className="tabular-nums">{formatDay(item.signed)}</span> : <Muted>Not yet</Muted>) },
    { key: "version", label: "Version", render: (item) => <Muted>{item.version} draft</Muted> },
    { key: "specialist", label: "Specialist", render: (item) => <SpecialistCell name={clientById(item.clientId)?.owner ?? ""} /> },
    { key: "status", label: "Status", render: (item) => <Tag tone={AGREEMENT_TONES[item.status]}>{item.status}</Tag> },
    {
      key: "action",
      label: "Action",
      render: (item) =>
        item.status === "Signed" ? (
          <Muted>Stored</Muted>
        ) : reminded.includes(item.id) ? (
          <span className="caption-style text-subtle">Reminder sent</span>
        ) : (
          <Button variant="secondary" size="sm" onClick={(event) => remind(event, item.id)}>
            Send reminder
          </Button>
        ),
    },
  ];

  return (
    <PageShell
      header={
        <PageHeader
          title="Agreements"
          tabs={[
            { value: "all", label: "All", count: AGREEMENTS.length },
            { value: "unsigned", label: "Awaiting signature", count: unsigned.length },
            { value: "signed", label: "Signed", count: signed.length },
          ]}
          tab={view}
          onTabChange={setView}
        />
      }
    >
      <StatStrip
        stats={[
          { label: "Signed", value: signed.length, hint: "Stored with timestamp and version" },
          { label: "Awaiting signature", value: unsigned.length, hint: "Sent after the intake call" },
          { label: "Overdue", value: AGREEMENTS.filter((item) => item.status === "Overdue").length, hint: "Unsigned for 2 days or more" },
          { label: "Agreement version", value: "v0.1", hint: "Draft — needs legal review" },
        ]}
      />
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(item) => item.id}
        onRowClick={(item) => openDetail(item.clientId)}
        rowLabel={(item) => `Agreement for ${clientById(item.clientId)?.name}`}
        empty="No agreements in this view."
        countLabel="Agreements in view"
      />
    </PageShell>
  );
}
