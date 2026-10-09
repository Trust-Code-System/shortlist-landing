import PlusIcon from "@/public/assets/images/_common/plus.svg";

type TableFooterProps = {
  count: number;
};

const CALCULATIONS = ["Sum of package value", "Avg response rate", "Add calculation"];

export default function TableFooter({ count }: TableFooterProps) {
  return (
    <div className="caption-style grid shrink-0 grid-cols-2 gap-px border-b border-border bg-background p-px sm:grid-cols-4">
      <div className="flex items-center gap-2 p-3 outline-1 outline-border">
        <span className="text-foreground">{count}</span>
        <span className="text-muted-foreground">Clients in view</span>
      </div>
      {CALCULATIONS.map((label) => (
        <div
          key={label}
          className="flex items-center gap-2 p-3 text-muted-foreground outline-1 outline-border"
        >
          <PlusIcon aria-hidden className="size-3 text-muted-foreground" />
          {label}
        </div>
      ))}
    </div>
  );
}
