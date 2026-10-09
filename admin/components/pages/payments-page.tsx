"use client";

import { useState } from "react";
import Button from "@/components/_ui/button";
import Tag from "@/components/_ui/tag";
import PageHeader from "@/components/_common/page/page-header";
import PageShell from "@/components/_common/page/page-shell";
import StatStrip from "@/components/_common/page/stat-strip";
import DataTable, { type Column } from "@/components/_common/page/data-table";
import { ClientCell, Money, Muted } from "@/components/_common/page/cells";
import { TAG_TONES } from "@/data/companies";
import {
  PAYMENTS,
  PAYMENT_TONES,
  REVENUE,
  clientById,
  formatDay,
  packageOf,
  stageOf,
  type Payment,
  type PaymentStatus,
} from "@/data/ops";
import { downloadCsv } from "@/lib/csv";
import { useCompaniesStore } from "@/stores/companies-store";
import ShareIcon from "@/public/assets/images/companies/toolbar/share.svg";

const naira = (value: number) => `₦${value.toLocaleString("en-NG")}`;

export default function PaymentsPage() {
  const openDetail = useCompaniesStore((state) => state.openDetail);
  const companies = useCompaniesStore((state) => state.companies);
  const [view, setView] = useState("all");

  const byStatus = (status: PaymentStatus) => PAYMENTS.filter((item) => item.status === status);
  const rows = view === "all" ? PAYMENTS : byStatus(view as PaymentStatus);
  const thisMonth = REVENUE[REVENUE.length - 1];
  const inService = companies
    .filter((client) => !["Intake booked", "Agreement sent", "Paused"].includes(stageOf(client)))
    .reduce((sum, client) => sum + client.pipelineValue, 0);

  const columns: Column<Payment>[] = [
    { key: "ref", label: "Reference", render: (item) => <span className="caption-style text-soft font-mono">{item.ref}</span> },
    { key: "client", label: "Client", render: (item) => <ClientCell name={clientById(item.clientId)?.name ?? ""} /> },
    {
      key: "package",
      label: "Package",
      render: (item) => {
        const client = clientById(item.clientId);
        return client ? <Tag tone={TAG_TONES[packageOf(client)]}>{packageOf(client)}</Tag> : null;
      },
    },
    
    { key: "date", label: "Date", render: (item) => <span className="tabular-nums">{formatDay(item.date)}</span> },
    { key: "method", label: "Method", render: (item) => <Muted>{item.method}</Muted> },
    { key: "amount", label: "Amount", align: "end", render: (item) => <Money value={item.amount} /> },
    { key: "status", label: "Status", render: (item) => <Tag tone={PAYMENT_TONES[item.status]}>{item.status}</Tag> },
  ];

  function exportCsv() {
    downloadCsv("payments.csv", [
      ["Reference", "Client", "Package", "Date", "Method", "Amount (NGN)", "Status"],
      ...rows.map((item) => [item.ref, clientById(item.clientId)?.name ?? "", item.period, item.date, item.method, item.amount, item.status]),
    ]);
  }

  return (
    <PageShell
      header={
        <PageHeader
          title="Payments"
          status="Paystack · sample prices"
          tabs={[
            { value: "all", label: "All", count: PAYMENTS.length },
            { value: "Paid", label: "Paid", count: byStatus("Paid").length },
            { value: "Failed", label: "Failed", count: byStatus("Failed").length },
            { value: "Refunded", label: "Refunded", count: byStatus("Refunded").length },
          ]}
          tab={view}
          onTabChange={setView}
        />
      }
      toolbar={
        <>
          <span className="caption-style text-subtle">Payments are processed by Paystack. Card details never touch Shortlist.</span>
          <Button variant="secondary" size="sm" onClick={exportCsv}>
            <ShareIcon aria-hidden className="size-3" />
            Export
          </Button>
        </>
      }
    >
      <StatStrip
        stats={[
          { label: `Collected in ${thisMonth.label}`, value: naira(thisMonth.total), hint: "Successful payments only" },
          { label: "Value in service", value: naira(inService), hint: "Packages currently being delivered" },
          { label: "Failed", value: byStatus("Failed").length, hint: "Retry or send a new payment link" },
          { label: "Refunded", value: naira(byStatus("Refunded").reduce((sum, item) => sum + item.amount, 0)), hint: "Across all months" },
        ]}
      />
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(item) => item.ref}
        onRowClick={(item) => openDetail(item.clientId)}
        rowLabel={(item) => `Payment ${item.ref}, open client`}
        empty="No payments in this view."
        countLabel="Payments in view"
      />
    </PageShell>
  );
}
