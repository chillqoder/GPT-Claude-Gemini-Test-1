"use client";

import type { SearchStats } from "@/lib/types";
import { relativeTime } from "@/lib/utils";

interface StatsBarProps {
  stats: SearchStats;
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="glass-panel rounded-[24px] px-5 py-4">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
        <span>Found: {stats.found} articles</span>
        <span>Sources: {stats.sources}</span>
        <span>Timespan: {stats.timespanHours}h</span>
        <span>
          Last sync: {stats.lastSyncAt ? relativeTime(stats.lastSyncAt) : "Not yet"}
        </span>
        <span>Dupes removed: {stats.dupesRemoved}</span>
      </div>
    </div>
  );
}
