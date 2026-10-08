"use client";

import type { ComponentType, SVGProps } from "react";
import { usePathname } from "next/navigation";
import Button from "@/components/_ui/button";
import { ScrollArea } from "@/components/_ui/scroll-area";
import SidebarNavItem from "./sidebar-nav-item";
import SidebarSection from "./sidebar-section";
import { useCompaniesStore } from "@/stores/companies-store";
import { APPLICATIONS, INTAKE_CALLS, INTERVIEWS, THREADS, risksFor } from "@/data/ops";
import Logo from "@/public/assets/images/_common/logo.svg";
import ClipboardIcon from "@/public/assets/images/companies/sidebar/clipboard.svg";
import ListIcon from "@/public/assets/images/companies/sidebar/list.svg";
import BookClosedIcon from "@/public/assets/images/companies/sidebar/book-closed.svg";
import MailIcon from "@/public/assets/images/companies/sidebar/mail.svg";
import TargetIcon from "@/public/assets/images/companies/sidebar/target-05.svg";
import TargetAltIcon from "@/public/assets/images/companies/sidebar/target-03.svg";
import UsersIcon from "@/public/assets/images/companies/sidebar/users.svg";
import BarChartAltIcon from "@/public/assets/images/companies/sidebar/bar-chart-10.svg";
import AlertTriangleIcon from "@/public/assets/images/companies/sidebar/alert-triangle.svg";
import DotYellow from "@/public/assets/images/companies/sidebar/dot-yellow.svg";
import DotPink from "@/public/assets/images/companies/sidebar/dot-pink.svg";
import DotPurple from "@/public/assets/images/companies/sidebar/dot-purple.svg";
import UserPlusIcon from "@/public/assets/images/companies/sidebar/user-plus.svg";
import MessageQuestionIcon from "@/public/assets/images/companies/sidebar/message-question.svg";
import WalletIcon from "@/public/assets/images/companies/sidebar/wallet.svg";

type NavItem = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  href: string;
  count?: number;
};

const UNPAID_STAGES = ["Intake booked", "Agreement sent"];

function shortNaira(value: number) {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}m`;
  if (value >= 1_000) return `₦${Math.round(value / 1_000)}k`;
  return `₦${value}`;
}

export default function SidebarContent() {
  const pathname = usePathname();
  const companies = useCompaniesStore((state) => state.companies);
  const setSidebarOpen = useCompaniesStore((state) => state.setSidebarOpen);
  const count = (stage: string) =>
    companies.filter((company) => company.tags.some((tag) => tag === stage))
      .length;
  const collected = companies
    .filter(
      (company) =>
        !company.tags.some(
          (tag) => UNPAID_STAGES.includes(tag) || tag === "Paused",
        ),
    )
    .reduce((sum, company) => sum + company.pipelineValue, 0);
  const atRisk = new Set(risksFor(companies).map((risk) => risk.clientId)).size;

  const sections: { title?: string; items: NavItem[] }[] = [
    {
      items: [
        { icon: UsersIcon, label: "Clients", href: "/", count: companies.length },
        { icon: ClipboardIcon, label: "Intake calls", href: "/intake-calls", count: INTAKE_CALLS.filter((call) => call.status === "Confirmed" || call.status === "Rescheduled").length },
        { icon: BookClosedIcon, label: "Agreements", href: "/agreements", count: count("Agreement sent") },
        { icon: ListIcon, label: "Applications", href: "/applications", count: APPLICATIONS.length },
        { icon: TargetIcon, label: "Interviews", href: "/interviews", count: INTERVIEWS.filter((interview) => !interview.outcome).length },
        { icon: MailIcon, label: "Messages", href: "/messages", count: THREADS.filter((thread) => thread.unread).length },
      ],
    },
    {
      title: "Team",
      items: [
        { icon: UsersIcon, label: "Career specialists", href: "/team/specialists" },
        { icon: TargetAltIcon, label: "Interview coaches", href: "/team/coaches" },
      ],
    },
    {
      title: "Reporting",
      items: [
        { icon: BarChartAltIcon, label: "Monthly revenue", href: "/reports/revenue" },
        { icon: AlertTriangleIcon, label: "At-risk clients", href: "/reports/at-risk", count: atRisk },
      ],
    },
    {
      title: "Markets",
      items: [
        { icon: DotYellow, label: "Nigeria", href: "/markets/nigeria" },
        { icon: DotPink, label: "UK & Ireland", href: "/markets/uk-ireland" },
        { icon: DotPurple, label: "Canada & remote", href: "/markets/canada-remote" },
      ],
    },
  ];

  const close = () => setSidebarOpen(false);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-sidebar-border bg-sidebar-accent flex shrink-0 items-center gap-2 border-b p-3">
        <Logo aria-hidden className="size-8 shrink-0 overflow-visible" />
        <div className="flex min-w-0 flex-col gap-1">
          <span className="lead-style block truncate font-medium tracking-[-0.01em]">
            Shortlist
          </span>
          <span className="caption-style text-subtle block truncate">
            Client operations
          </span>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <nav aria-label="Primary">
          {sections.map((section, index) => (
            <SidebarSection
              key={section.title ?? "main"}
              title={section.title}
              className={
                index < sections.length - 1
                  ? "border-sidebar-border border-b"
                  : undefined
              }
            >
              {section.items.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  count={item.count}
                  active={pathname === item.href}
                  onNavigate={close}
                />
              ))}
            </SidebarSection>
          ))}
        </nav>
      </ScrollArea>

      <SidebarSection className="border-sidebar-border shrink-0 border-t border-b">
        <SidebarNavItem
          icon={UserPlusIcon}
          label="Invite teammates"
          tone="quiet"
        />
        <SidebarNavItem icon={MessageQuestionIcon} label="Help" tone="quiet" />
      </SidebarSection>

      <div className="border-sidebar-border bg-sidebar-accent flex shrink-0 items-center justify-between gap-2 border-b p-4">
        <div className="flex min-w-0 flex-col gap-2">
          <span className="lead-style block font-medium tracking-[-0.01em] tabular-nums">
            {shortNaira(collected)}
          </span>
          <span className="caption-style text-subtle block whitespace-nowrap">
            Active value
          </span>
        </div>
        <Button
          variant="muted"
          size="md"
          href="/payments"
          onClick={close}
          aria-current={pathname === "/payments" ? "page" : undefined}
        >
          <WalletIcon aria-hidden className="size-3.5" />
          Payments
        </Button>
      </div>
    </div>
  );
}
