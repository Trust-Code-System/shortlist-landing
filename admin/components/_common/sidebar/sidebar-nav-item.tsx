import type { ComponentType, SVGProps } from "react";
import Button from "@/components/_ui/button";
import CountBadge from "@/components/_ui/count-badge";
import { cn } from "@/lib/utils";

type SidebarNavItemProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  href?: string;
  count?: number;
  comingSoon?: boolean;
  active?: boolean;
  tone?: "default" | "quiet";
  iconClassName?: string;
  onNavigate?: () => void;
};

export default function SidebarNavItem({
  icon: Icon,
  label,
  href,
  count,
  comingSoon,
  active = false,
  tone = "default",
  iconClassName,
  onNavigate,
}: SidebarNavItemProps) {
  return (
    <li className={cn(active && "mb-0.75")}>
      <Button
        variant="nav"
        size="md"
        href={href}
        disabled={comingSoon && !href}
        aria-label={comingSoon ? `${label} · Coming soon` : undefined}
        title={comingSoon ? `${label} · Coming soon` : label}
        onClick={onNavigate}
        data-active={active}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group h-[30px] gap-1.5 py-0 data-[active=true]:h-8",
          tone === "quiet" && "text-subtle",
        )}
      >
        <Icon
          aria-hidden
          className={cn(
            "text-subtle ease-power3-out group-hover:text-icon group-data-[active=true]:text-icon size-3.5 shrink-0 transition-colors duration-150",
            iconClassName,
          )}
        />
        <span className="min-w-0 flex-1 truncate text-left">{label}</span>
        {comingSoon ? (
          <span className="bg-muted text-soft shrink-0 rounded-full px-1.5 py-1 text-[10px] leading-none">
            Coming soon
          </span>
        ) : (
          count !== undefined && <CountBadge>{count}</CountBadge>
        )}
      </Button>
    </li>
  );
}
