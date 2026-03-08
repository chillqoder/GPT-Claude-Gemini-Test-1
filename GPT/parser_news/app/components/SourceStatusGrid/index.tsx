"use client";

import type { SourceStatus } from "@/lib/types";

interface SourceStatusGridProps {
  statuses: SourceStatus[];
}

const STATE_STYLES: Record<SourceStatus["state"], string> = {
  idle: "bg-slate-500/30 text-slate-300",
  loading: "bg-primary/20 text-primary",
  success: "bg-accent/20 text-accent",
  error: "bg-rose-500/20 text-rose-300",
  rate_limited: "bg-warning/20 text-warning",
};

export function SourceStatusGrid({ statuses }: SourceStatusGridProps) {
  if (statuses.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {statuses.map((status) => (
        <div
          key={status.id}
          className="surface-panel rounded-[24px] px-4 py-4 text-sm text-text"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">{status.label}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                {status.articleCount} articles
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] ${
                STATE_STYLES[status.state]
              }`}
            >
              {status.state.replace("_", " ")}
            </span>
          </div>
          {status.message ? (
            <p className="mt-3 text-xs leading-6 text-muted">{status.message}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
