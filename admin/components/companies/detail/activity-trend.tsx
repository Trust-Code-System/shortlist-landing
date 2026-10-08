import type { ComponentType, SVGProps } from "react";
import Sparkline from "@/components/_common/sparkline";
import type { Company } from "@/data/companies";
import { companyActivity } from "@/lib/companies";
import CursorClickIcon from "@/public/assets/images/companies/detail/cursor-click.svg";
import MailIcon from "@/public/assets/images/companies/detail/mail-03.svg";
import CalendarIcon from "@/public/assets/images/companies/detail/calendar.svg";
import PhoneCallIcon from "@/public/assets/images/companies/detail/phone-call.svg";

type ActivityTrendProps = {
  company: Company;
};

type Stat = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: number;
};

export default function ActivityTrend({ company }: ActivityTrendProps) {
  const activity = companyActivity(company);
  const stats: Stat[] = [
    { icon: CursorClickIcon, label: "Roles shortlisted", value: activity.touches },
    { icon: MailIcon, label: "Messages", value: activity.emails },
    { icon: CalendarIcon, label: "Mock interviews", value: activity.meetings },
    { icon: PhoneCallIcon, label: "Calls & notes", value: activity.calls },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-[3px]">
          <span className="block text-[24px] leading-none">{activity.total}</span>
          <Sparkline values={company.trend} className="h-[22px]" />
        </div>
        <span className="caption-style block text-soft">
          Spikes around shortlist approvals and interview prep
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-3 rounded-lg border border-line-strong p-[11px]"
          >
            <span className="caption-style flex items-center gap-1 text-soft">
              <stat.icon aria-hidden className="size-3 shrink-0" />
              {stat.label}
            </span>
            <span className="lead-style block">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
