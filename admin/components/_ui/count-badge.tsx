import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export default function CountBadge({
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "caption-style inline-flex h-4 min-w-6 shrink-0 items-center justify-center rounded-full border-[0.5px] border-[var(--edge-strong)] bg-muted px-1 text-center text-chip shadow-[0px_0px_0px_0.5px_var(--edge-outer)]",
        className,
      )}
      {...props}
    />
  );
}
