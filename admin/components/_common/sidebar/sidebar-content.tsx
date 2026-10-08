"use client";

import Button from "@/components/_ui/button";
import { ScrollArea } from "@/components/_ui/scroll-area";
import SidebarNavItem from "./sidebar-nav-item";
import SidebarSection from "./sidebar-section";
import { useCompaniesStore } from "@/stores/companies-store";
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

const UNPAID_STAGES = ["Intake booked", "Agreement sent"];

function shortNaira(value: number) {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}m`;
  if (value >= 1_000) return `₦${Math.round(value / 1_000)}k`;
  return `₦${value}`;
}

export default function SidebarContent() {
  const companies = useCompaniesStore((state) => state.companies);
  const count = (stage: string) =>
    companies.filter((company) => company.tags.some((tag) => tag === stage))
      .length;
  const collected = companies
    .filter(
      (company) =>
        !company.tags.some((tag) => UNPAID_STAGES.includes(tag)) &&
        !company.tags.some((tag) => tag === "Paused"),
    )
    .reduce((sum, company) => sum + company.pipelineValue, 0);
  const applications = companies.reduce(
    (sum, company) => sum + company.openDeals,
    0,
  );

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
          <SidebarSection className="border-sidebar-border border-b">
            <SidebarNavItem
              icon={UsersIcon}
              label="Clients"
              count={companies.length}
              active
            />
            <SidebarNavItem
              icon={ClipboardIcon}
              label="Intake calls"
              count={count("Intake booked")}
            />
            <SidebarNavItem
              icon={BookClosedIcon}
              label="Agreements"
              count={count("Agreement sent")}
            />
            <SidebarNavItem
              icon={ListIcon}
              label="Applications"
              count={applications}
            />
            <SidebarNavItem
              icon={TargetIcon}
              label="Interviews"
              count={count("Interviewing")}
            />
            <SidebarNavItem icon={MailIcon} label="Messages" />
          </SidebarSection>

          <SidebarSection
            title="Team"
            className="border-sidebar-border border-b"
          >
            <SidebarNavItem icon={UsersIcon} label="Career specialists" />
            <SidebarNavItem icon={TargetAltIcon} label="Interview coaches" />
          </SidebarSection>

          <SidebarSection
            title="Reporting"
            className="border-sidebar-border border-b"
          >
            <SidebarNavItem icon={BarChartAltIcon} label="Monthly revenue" />
            <SidebarNavItem
              icon={AlertTriangleIcon}
              label="At-risk clients"
              count={count("Paused")}
            />
          </SidebarSection>

          <SidebarSection title="Markets">
            <SidebarNavItem icon={DotYellow} label="Nigeria" />
            <SidebarNavItem icon={DotPink} label="UK & Ireland" />
            <SidebarNavItem icon={DotPurple} label="Canada & remote" />
          </SidebarSection>
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
        <div className="flex flex-col gap-2">
          <span className="lead-style block font-medium tracking-[-0.01em] tabular-nums">
            {shortNaira(collected)}
          </span>
          <span className="caption-style text-subtle block">
            Active this month
          </span>
        </div>
        <Button variant="muted" size="md">
          <WalletIcon aria-hidden className="size-3.5" />
          Payments
        </Button>
      </div>
    </div>
  );
}
