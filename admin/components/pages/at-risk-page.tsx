"use client";

import Tag from "@/components/_ui/tag";
import PageHeader from "@/components/_common/page/page-header";
import PageShell from "@/components/_common/page/page-shell";
import StatStrip from "@/components/_common/page/stat-strip";
import DataTable, { type Column } from "@/components/_common/page/data-table";
import { ClientCell, Muted, SpecialistCell } from "@/components/_common/page/cells";
import { TAG_TONES, type Tag as TagName } from "@/data/companies";
import { RISK_TONES, clientById, formatDay, risksFor, type Risk } from "@/data/ops";
import { useCompaniesStore } from "@/stores/companies-store";

export default function AtRiskPage() {
  const openDetail = useCompaniesStore((state) => state.openDetail);
  const companies = useCompaniesStore((state) => state.companies);
  const risks = risksFor(companies).sort((a, b) =>
    a.severity === b.severity ? 0 : a.severity === "High" ? -1 : 1,
  );
  const client = (risk: Risk) =>
    companies.find((item) => item.id === risk.clientId) ?? clientById(risk.clientId);

  const columns: Column<Risk>[] = [
    { key: "client", label: "Client", render: (risk) => <ClientCell name={client(risk)?.name ?? ""} /> },
    { key: "reason", label: "Risk", render: (risk) => risk.reason },
    { key: "severity", label: "Severity", render: (risk) => <Tag tone={RISK_TONES[risk.severity]}>{risk.severity}</Tag> },
    {
      key: "stage",
      label: "Stage",
      render: (risk) => {
        const stage = client(risk)?.tags[1] as TagName | undefined;
        return stage ? <Tag tone={TAG_TONES[stage]}>{stage}</Tag> : null;
      },
    },
    { key: "specialist", label: "Specialist", render: (risk) => <SpecialistCell name={client(risk)?.owner ?? ""} /> },
    {
      key: "last",
      label: "Last touchpoint",
      render: (risk) => {
        const item = client(risk);
        return item ? <Muted>{formatDay(item.lastInteraction.date)} · {item.lastInteraction.label}</Muted> : null;
      },
    },
    { key: "action", label: "Suggested action", render: (risk) => <span className="text-foreground">{risk.action}</span> },
  ];

  return (
    <PageShell header={<PageHeader title="At-risk clients" />}>
      <StatStrip
        stats={[
          { label: "Clients at risk", value: new Set(risks.map((risk) => risk.clientId)).size, hint: `Of ${companies.length} clients` },
          { label: "High severity", value: risks.filter((risk) => risk.severity === "High").length, hint: "Act today" },
          { label: "Payment issues", value: risks.filter((risk) => risk.reason.includes("payment")).length, hint: "Failed renewals" },
          { label: "Gone quiet", value: risks.filter((risk) => risk.reason.startsWith("No touchpoint")).length, hint: "No contact in 10+ days" },
        ]}
      />
      <DataTable
        columns={columns}
        rows={risks}
        rowKey={(risk) => `${risk.clientId}-${risk.reason}`}
        onRowClick={(risk) => openDetail(risk.clientId)}
        rowLabel={(risk) => `${client(risk)?.name}: ${risk.reason}`}
        empty="No clients at risk right now."
        countLabel="Risks flagged"
      />
    </PageShell>
  );
}
