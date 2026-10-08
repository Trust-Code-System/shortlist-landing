"use client";

import Avatar from "@/components/_ui/avatar";
import Button from "@/components/_ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/_ui/tabs";
import Notifications from "@/components/companies/header/notifications/notifications";
import ThemeToggle from "@/components/_common/theme-toggle";
import { CURRENT_USER } from "@/data/companies";
import { useCompaniesStore } from "@/stores/companies-store";
import MenuIcon from "@/public/assets/images/_common/menu.svg";
import ActiveDot from "@/public/assets/images/companies/header/active-dot.svg";
import SearchIcon from "@/public/assets/images/_common/search.svg";

export type PageTab = { value: string; label: string; count?: number };

type PageHeaderProps = {
  title: string;
  status?: string;
  tabs?: PageTab[];
  tab?: string;
  onTabChange?: (value: string) => void;
};

export default function PageHeader({
  title,
  status,
  tabs,
  tab,
  onTabChange,
}: PageHeaderProps) {
  const setSidebarOpen = useCompaniesStore((state) => state.setSidebarOpen);
  const setSearchOpen = useCompaniesStore((state) => state.setSearchOpen);
  const openProfile = useCompaniesStore((state) => state.openProfile);

  return (
    <header className="shrink-0">
      <div className="flex items-center justify-between gap-2 px-4 py-[14px]">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon aria-hidden className="size-3.5" />
          </Button>
          <h1 className="truncate">{title}</h1>
          {status && (
            <span className="caption-style bg-muted hidden shrink-0 items-center gap-0.5 rounded-full border border-(--tag-neutral-border) py-[3px] pr-[5px] pl-[3px] sm:inline-flex">
              <ActiveDot aria-hidden className="size-3" />
              {status}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            aria-label="Search"
            aria-keyshortcuts="Meta+K Control+K"
            onClick={() => setSearchOpen(true)}
          >
            <SearchIcon aria-hidden className="size-3.5" />
          </Button>
          <Notifications />
          <ThemeToggle />
          <Button
            variant="secondary"
            size="none"
            className="caption-style h-[30px] gap-1.5 py-[5px] pr-[7px] pl-[5px] font-normal"
            aria-label={`Open profile for ${CURRENT_USER.name}`}
            onClick={() => openProfile(CURRENT_USER.name)}
          >
            <Avatar src={CURRENT_USER.avatar} alt="" />
            <span className="hidden sm:inline">{CURRENT_USER.name}</span>
          </Button>
        </div>
      </div>

      {tabs && tab !== undefined && onTabChange && (
        <Tabs value={tab} onValueChange={onTabChange}>
          <TabsList className="border-border scrollbar-none overflow-x-auto border-b px-4">
            {tabs.map((item) => (
              <TabsTrigger key={item.value} value={item.value} className="shrink-0">
                {item.count === undefined
                  ? item.label
                  : `${item.label} · ${item.count}`}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}
    </header>
  );
}
