"use client";

import Avatar from "@/components/_ui/avatar";
import SegmentBar from "@/components/_common/segment-bar";
import PageHeader from "@/components/_common/page/page-header";
import PageShell from "@/components/_common/page/page-shell";
import StatStrip from "@/components/_common/page/stat-strip";
import DataTable, { type Column } from "@/components/_common/page/data-table";
import { Muted } from "@/components/_common/page/cells";
import { OWNERS, type Owner } from "@/data/companies";
import { COACHES, INTERVIEWS, stageOf, type Coach } from "@/data/ops";
import { useCompaniesStore } from "@/stores/companies-store";

const CAPACITY = 6;

function Person({ name, avatar, role }: { name: string; avatar: string; role: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <Avatar src={avatar} alt="" className="size-7" />
      <span className="flex flex-col gap-1">
        <span>{name}</span>
        <span className="caption-style text-subtle">{role}</span>
      </span>
    </span>
  );
}

export function SpecialistsPage() {
  const companies = useCompaniesStore((state) => state.companies);
  const openProfile = useCompaniesStore((state) => state.openProfile);

  const load = (owner: Owner) => {
    const clients = companies.filter((client) => client.owner === owner.name);
    const searching = clients.filter((client) => ["Applying", "Interviewing"].includes(stageOf(client)));
    const sent = clients.reduce((sum, client) => sum + client.openDeals, 0);
    const withApps = clients.filter((client) => client.openDeals > 0);
    const response = withApps.length
      ? Math.round(withApps.reduce((sum, client) => sum + client.winProbability, 0) / withApps.length)
      : 0;
    return { clients: clients.length, searching: searching.length, sent, response };
  };

  const columns: Column<Owner>[] = [
    { key: "name", label: "Specialist", render: (owner) => <Person name={owner.name} avatar={owner.avatar} role={owner.role} /> },
    { key: "clients", label: "Clients", align: "end", render: (owner) => load(owner).clients },
    { key: "searching", label: "Active searches", align: "end", render: (owner) => load(owner).searching },
    { key: "sent", label: "Applications sent", align: "end", render: (owner) => load(owner).sent },
    { key: "response", label: "Avg. response", align: "end", render: (owner) => `${load(owner).response}%` },
    {
      key: "capacity",
      label: "Capacity",
      render: (owner) => {
        const used = Math.round((load(owner).clients / CAPACITY) * 100);
        return (
          <span className="flex items-center gap-2">
            <SegmentBar percent={Math.min(100, used)} tone={used > 80 ? "warning" : "success"} className="w-[74px]" />
            <span className="caption-style text-subtle tabular-nums">{load(owner).clients}/{CAPACITY}</span>
          </span>
        );
      },
    },
    { key: "contact", label: "Contact", render: (owner) => <Muted>{owner.email}</Muted> },
  ];

  const totalClients = companies.length;
  return (
    <PageShell header={<PageHeader title="Career specialists" />}>
      <StatStrip
        stats={[
          { label: "Specialists", value: OWNERS.length, hint: `Capacity of ${CAPACITY} clients each` },
          { label: "Clients per specialist", value: (totalClients / OWNERS.length).toFixed(1), hint: "Average load" },
          { label: "Near capacity", value: OWNERS.filter((owner) => load(owner).clients >= CAPACITY - 1).length, hint: "5 or more clients" },
          { label: "Free slots", value: OWNERS.length * CAPACITY - totalClients, hint: "Before hiring is needed" },
        ]}
      />
      <DataTable
        columns={columns}
        rows={OWNERS}
        rowKey={(owner) => owner.name}
        onRowClick={(owner) => openProfile(owner.name)}
        rowLabel={(owner) => `Open ${owner.name} profile`}
        empty="No specialists yet."
        countLabel="Specialists"
      />
    </PageShell>
  );
}

export function CoachesPage() {
  const columns: Column<Coach>[] = [
    { key: "name", label: "Coach", render: (coach) => <Person name={coach.name} avatar={coach.avatar} role="Interview coach" /> },
    { key: "focus", label: "Focus", render: (coach) => coach.focus },
    { key: "availability", label: "Availability", render: (coach) => <Muted>{coach.availability}</Muted> },
    { key: "upcoming", label: "Upcoming mocks", align: "end", render: (coach) => INTERVIEWS.filter((item) => item.coach === coach.name && !item.outcome).length },
    { key: "sessions", label: "Sessions this month", align: "end", render: (coach) => coach.sessions },
    { key: "rating", label: "Client rating", align: "end", render: (coach) => `${coach.rating.toFixed(1)} / 5` },
    { key: "email", label: "Contact", render: (coach) => <Muted>{coach.email}</Muted> },
  ];

  return (
    <PageShell header={<PageHeader title="Interview coaches" />}>
      <StatStrip
        stats={[
          { label: "Coaches", value: COACHES.length, hint: "Run mock interviews on video" },
          { label: "Sessions this month", value: COACHES.reduce((sum, coach) => sum + coach.sessions, 0), hint: "Across all coaches" },
          { label: "Upcoming mocks", value: INTERVIEWS.filter((item) => !item.outcome && item.prep !== "Mock done").length, hint: "Booked or still needed" },
          { label: "Average rating", value: (COACHES.reduce((sum, coach) => sum + coach.rating, 0) / COACHES.length).toFixed(1), hint: "From client feedback" },
        ]}
      />
      <DataTable
        columns={columns}
        rows={COACHES}
        rowKey={(coach) => coach.name}
        empty="No coaches yet."
        countLabel="Coaches"
      />
    </PageShell>
  );
}
