import type { ReactNode } from "react";

type PageShellProps = {
  header: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
};

export default function PageShell({ header, toolbar, children }: PageShellProps) {
  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col">
      {header}
      {toolbar && (
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-4 py-4">
          {toolbar}
        </div>
      )}
      <div className="border-border flex min-h-0 flex-1 flex-col border-t">
        {children}
      </div>
    </section>
  );
}
