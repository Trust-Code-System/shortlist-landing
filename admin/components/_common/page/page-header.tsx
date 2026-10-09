"use client";

import Avatar from "@/components/_ui/avatar";
import Button from "@/components/_ui/button";
import ThemeToggle from "@/components/_common/theme-toggle";
import { CURRENT_USER } from "@/data/companies";
import { useCompaniesStore } from "@/stores/companies-store";
import MenuIcon from "@/public/assets/images/_common/menu.svg";
import ActiveDot from "@/public/assets/images/companies/header/active-dot.svg";

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
          <ThemeToggle />
          <span className="caption-style border-line-strong flex h-[30px] items-center gap-1.5 rounded-full border py-[5px] pr-[7px] pl-[5px]">
            <Avatar src={CURRENT_USER.avatar} alt="" />
            <span className="hidden sm:inline">{CURRENT_USER.name}</span>
          </span>
        </div>
      </div>

      {tabs && tab !== undefined && onTabChange && (
        <div
          role="group"
          aria-label={`${title} views`}
          className="border-border flex shrink-0 overflow-x-auto border-b px-4"
        >
          {tabs.map((item) => (
            <Button
              key={item.value}
              variant="ghost"
              size="sm"
              aria-pressed={tab === item.value}
              onClick={() => onTabChange(item.value)}
              className="text-soft aria-pressed:border-primary aria-pressed:text-foreground shrink-0 rounded-none border-b-2 border-transparent px-3 py-3"
            >
              {item.count === undefined
                ? item.label
                : `${item.label} · ${item.count}`}
            </Button>
          ))}
        </div>
      )}
    </header>
  );
}
