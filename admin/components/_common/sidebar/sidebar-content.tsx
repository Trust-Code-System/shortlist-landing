"use client";

import type { ComponentType, SVGProps } from "react";
import { usePathname } from "next/navigation";
import { Collapsible } from "radix-ui";
import Button from "@/components/_ui/button";
import { ScrollArea } from "@/components/_ui/scroll-area";
import SidebarNavItem from "./sidebar-nav-item";
import SidebarSection from "./sidebar-section";
import { useCompaniesStore } from "@/stores/companies-store";
import { logout } from "@/app/login/actions";
import ShortlistLogo from "@/components/_common/shortlist-logo";
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
import ChevronDownIcon from "@/public/assets/images/_common/chevron-down.svg";

type NavItem = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  href: string;
  count?: number;
  comingSoon?: boolean;
};

export default function SidebarContent() {
  const pathname = usePathname();
  const companies = useCompaniesStore((state) => state.companies);
  const setSidebarOpen = useCompaniesStore((state) => state.setSidebarOpen);

  const sections: { title?: string; items: NavItem[] }[] = [
    {
      items: [
        {
          icon: UsersIcon,
          label: "Clients",
          href: "/",
          count: companies.length,
        },
        {
          icon: ClipboardIcon,
          label: "Document review",
          href: "/document-review",
        },
        { icon: TargetIcon, label: "Preparation", href: "/preparation" },
        { icon: WalletIcon, label: "Payments", href: "/payments" },
      ],
    },
    {
      title: "Next up",
      items: [
        {
          icon: ClipboardIcon,
          label: "Intake calls",
          href: "/intake-calls",
          comingSoon: true,
        },
        {
          icon: BookClosedIcon,
          label: "Agreements",
          href: "/agreements",
          comingSoon: true,
        },
        {
          icon: ListIcon,
          label: "Applications",
          href: "/applications",
          comingSoon: true,
        },
        {
          icon: TargetIcon,
          label: "Interviews",
          href: "/interviews",
          comingSoon: true,
        },
        {
          icon: MailIcon,
          label: "Messages",
          href: "/messages",
          comingSoon: true,
        },
      ],
    },
    {
      title: "Team",
      items: [
        {
          icon: UsersIcon,
          label: "Career specialists",
          href: "/team/specialists",
          comingSoon: true,
        },
        {
          icon: TargetAltIcon,
          label: "Interview coaches",
          href: "/team/coaches",
          comingSoon: true,
        },
      ],
    },
    {
      title: "Reporting",
      items: [
        {
          icon: BarChartAltIcon,
          label: "Monthly revenue",
          href: "/reports/revenue",
          comingSoon: true,
        },
        {
          icon: AlertTriangleIcon,
          label: "At-risk clients",
          href: "/reports/at-risk",
          comingSoon: true,
        },
      ],
    },
    {
      title: "Markets",
      items: [
        {
          icon: DotYellow,
          label: "UK & Europe",
          href: "/markets/uk-europe",
          comingSoon: true,
        },
        {
          icon: DotPink,
          label: "Canada",
          href: "/markets/canada",
          comingSoon: true,
        },
        {
          icon: DotPurple,
          label: "Asia-Pacific",
          href: "/markets/asia-pacific",
          comingSoon: true,
        },
      ],
    },
  ];

  const close = () => setSidebarOpen(false);
  const futureSections = sections.slice(1);
  const comingSoonCount = futureSections.reduce(
    (count, section) => count + section.items.length,
    2, // Inactive support items: Invite teammates and Help.
  );
  const onComingSoonPage = futureSections.some((section) =>
    section.items.some((item) => item.href === pathname),
  );

  const renderSection = (section: (typeof sections)[number]) => (
    <SidebarSection
      key={section.title ?? "main"}
      title={section.title}
      className="border-sidebar-border border-b"
    >
      {section.items.map((item) => (
        <SidebarNavItem
          key={item.href}
          icon={item.icon}
          label={item.label}
          href={item.href}
          count={item.count}
          comingSoon={item.comingSoon}
          active={pathname === item.href}
          onNavigate={close}
        />
      ))}
    </SidebarSection>
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-sidebar-border bg-sidebar-accent flex shrink-0 items-center gap-2.5 border-b p-3">
        <ShortlistLogo />
        <div className="flex min-w-0 flex-col gap-1">
          <span className="block truncate text-[17px] font-semibold tracking-[-0.35px]">
            Shortlist
          </span>
          <span className="caption-style text-subtle block truncate">
            Client operations
          </span>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <nav aria-label="Primary">
          {renderSection(sections[0])}
          <Collapsible.Root key={pathname} defaultOpen={onComingSoonPage}>
            <div className="p-3">
              <Collapsible.Trigger asChild>
                <Button
                  variant="nav"
                  size="md"
                  className="group text-soft hover:bg-sidebar-primary h-9 gap-2"
                >
                  <ChevronDownIcon
                    aria-hidden
                    className="size-3.5 shrink-0 -rotate-90 transition-transform duration-150 group-data-[state=open]:rotate-0 motion-reduce:transition-none"
                  />
                  <span className="min-w-0 flex-1 truncate text-left">
                    Coming soon
                  </span>
                  <span className="bg-muted text-soft rounded-full px-1.5 py-1 text-[10px] leading-none">
                    {comingSoonCount}
                  </span>
                </Button>
              </Collapsible.Trigger>
            </div>
            <Collapsible.Content>
              {futureSections.map(renderSection)}
              <SidebarSection title="Support">
                <SidebarNavItem
                  icon={UserPlusIcon}
                  label="Invite teammates"
                  tone="quiet"
                  comingSoon
                />
                <SidebarNavItem
                  icon={MessageQuestionIcon}
                  label="Help"
                  tone="quiet"
                  comingSoon
                />
              </SidebarSection>
            </Collapsible.Content>
          </Collapsible.Root>
        </nav>
      </ScrollArea>

      <SidebarSection className="border-sidebar-border shrink-0 border-t border-b">
        <li>
          <form action={logout}>
            <Button
              variant="nav"
              size="md"
              type="submit"
              className="group text-subtle h-[30px] gap-1.5 py-0"
            >
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                fill="none"
                className="text-subtle group-hover:text-icon size-3.5 shrink-0"
              >
                <path
                  d="M6 2.5H3.5v11H6M10.5 5l3 3-3 3M13.5 8H6.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="min-w-0 flex-1 truncate text-left">
                Sign out
              </span>
            </Button>
          </form>
        </li>
      </SidebarSection>

      <div className="border-sidebar-border bg-sidebar-accent flex shrink-0 items-center justify-between gap-2 border-b p-4">
        <div className="flex min-w-0 flex-col gap-2">
          <span className="lead-style block truncate font-medium tracking-[-0.01em] tabular-nums">
            Local preview
          </span>
          <span className="caption-style text-subtle block truncate">
            Sample clients
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
