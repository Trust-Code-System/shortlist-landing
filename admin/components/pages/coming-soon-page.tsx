"use client";

import PageHeader from "@/components/_common/page/page-header";
import PageShell from "@/components/_common/page/page-shell";
import Button from "@/components/_ui/button";

export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <PageShell header={<PageHeader title={title} />}>
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto p-5">
        <div
          aria-hidden="true"
          inert
          className="pointer-events-none absolute inset-6 overflow-hidden opacity-30 blur-[5px]"
        >
          <div className="mb-6 grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="border-border bg-card h-28 rounded-xl border"
              />
            ))}
          </div>
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              className="border-border bg-card mb-3 h-12 rounded-lg border"
            />
          ))}
        </div>
        <div className="border-line-strong bg-background/95 shadow-overlay relative max-w-[440px] rounded-2xl border p-7 text-center">
          <span className="caption-style border-line-strong bg-muted text-soft inline-block rounded-full border px-3 py-1.5">
            On the way
          </span>
          <h2 className="mt-5 text-[28px] leading-tight tracking-[-0.03em]">
            Coming soon
          </h2>
          <p className="text-soft mt-3 text-[14px] leading-6">
            {title} will be available in a future update. For now, manage client
            documents, preparation invites, and payments.
          </p>
          <Button href="/" variant="primary" size="md" className="mt-6">
            Back to clients
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
