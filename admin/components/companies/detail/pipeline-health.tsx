import SegmentBar from "@/components/_common/segment-bar";
import type { Company } from "@/data/companies";

type PipelineHealthProps = {
  company: Company;
};

export default function PipelineHealth({ company }: PipelineHealthProps) {
  const rate = company.winProbability;
  const stages = [
    { label: "Viewed by employer", value: Math.min(95, Math.round(rate * 1.6)), tone: "success" as const },
    { label: "Replied", value: rate, tone: "warning" as const },
    { label: "Reached interview", value: Math.round(rate * 0.45), tone: "danger" as const },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <span className="block text-[28px] leading-none font-semibold">
          {company.winProbability}%
        </span>
        <span className="caption-style block text-soft">
          Response rate across all applications sent
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {stages.map((stage) => (
          <div key={stage.label} className="flex flex-col gap-2">
            <div className="caption-style flex items-center justify-between">
              <span>{stage.label}</span>
              <span>{stage.value}%</span>
            </div>
            <SegmentBar
              percent={stage.value}
              segments={63}
              tone={stage.tone}
              className="h-3 w-full border border-white/4 px-px"
              segmentClassName="h-2"
              trackClassName="bg-white/8"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
