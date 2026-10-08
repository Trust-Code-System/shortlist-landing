"use client";

import type { MouseEvent, ReactNode } from "react";
import Avatar from "@/components/_ui/avatar";
import Button from "@/components/_ui/button";
import { OWNERS } from "@/data/companies";
import { useCompaniesStore } from "@/stores/companies-store";

export function ClientCell({ name }: { name: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="bg-muted caption-style text-soft flex size-6 shrink-0 items-center justify-center rounded-md shadow-[0px_0px_0px_1px_var(--edge)]">
        {name.slice(0, 1)}
      </span>
      {name}
    </span>
  );
}

export function SpecialistCell({ name }: { name: string }) {
  const openProfile = useCompaniesStore((state) => state.openProfile);
  const owner = OWNERS.find((item) => item.name === name);

  if (!owner) return <span className="text-soft">{name}</span>;

  return (
    <Button
      variant="ghost"
      size="none"
      onClick={(event: MouseEvent) => {
        event.stopPropagation();
        openProfile(owner.name);
      }}
      aria-label={`Open ${owner.name} profile`}
      className="text-foreground -mx-1.5 gap-1.5 px-1.5 py-1 font-normal"
    >
      <Avatar src={owner.avatar} alt="" />
      {owner.name}
    </Button>
  );
}

export function Money({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-1 tabular-nums">
      <span className="text-muted-foreground">₦</span>
      {value.toLocaleString("en-NG")}
    </span>
  );
}

export function Muted({ children }: { children: ReactNode }) {
  return <span className="text-subtle">{children}</span>;
}
