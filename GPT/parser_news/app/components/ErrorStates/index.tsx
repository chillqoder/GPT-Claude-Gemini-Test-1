"use client";

import { AlertTriangle, SearchX, WifiOff } from "lucide-react";

import { SourceStatusGrid } from "@/app/components/SourceStatusGrid";
import type { SourceStatus } from "@/lib/types";

interface ErrorStatesProps {
  hasKeywords: boolean;
  loading: boolean;
  articlesCount: number;
  statuses: SourceStatus[];
  offline: boolean;
  onRetry: () => void;
}

export function ErrorStates({
  hasKeywords,
  loading,
  articlesCount,
  statuses,
  offline,
  onRetry,
}: ErrorStatesProps) {
  if (loading || articlesCount > 0) {
    return null;
  }

  if (!hasKeywords) {
    return (
      <div className="surface-panel rounded-[32px] px-8 py-12 text-center">
        <SearchX className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-5 font-headline text-3xl text-text">
          Define the signal you want to track.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted">
          Add up to eight keywords, choose your horizon, and PulseReader will build a
          client-side intelligence feed from open sources.
        </p>
      </div>
    );
  }

  if (offline) {
    return (
      <div className="space-y-6">
        <div className="surface-panel rounded-[32px] px-8 py-12 text-center">
          <WifiOff className="mx-auto h-10 w-10 text-warning" />
          <h2 className="mt-5 font-headline text-3xl text-text">You are offline.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted">
            Cached results are unavailable for this query. Reconnect and retry, or search a
            broader term once back online.
          </p>
        </div>
      </div>
    );
  }

  const allFailed =
    statuses.length > 0 &&
    statuses.every((status) => status.state === "error" || status.state === "rate_limited");

  if (allFailed) {
    return (
      <div className="space-y-6">
        <div className="surface-panel rounded-[32px] px-8 py-12 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-warning" />
          <h2 className="mt-5 font-headline text-3xl text-text">All sources failed.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted">
            The proxy chain or source endpoints are currently unreachable. Try broader
            keywords or retry the search.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-6 rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-medium"
          >
            Retry search
          </button>
        </div>
        <SourceStatusGrid statuses={statuses} />
      </div>
    );
  }

  return (
    <div className="surface-panel rounded-[32px] px-8 py-12 text-center">
      <SearchX className="mx-auto h-10 w-10 text-primary" />
      <h2 className="mt-5 font-headline text-3xl text-text">No results matched.</h2>
      <p className="mx-auto mt-3 max-w-2xl text-muted">
        Try a broader keyword set, switch boolean mode to `OR`, or widen the time range.
      </p>
    </div>
  );
}
