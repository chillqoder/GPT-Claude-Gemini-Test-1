"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, RefreshCw } from "lucide-react";

interface RefreshEngineProps {
  refreshInterval: number;
  lastSyncAt: string | null;
  loading: boolean;
  onRefresh: () => void;
}

export function RefreshEngine({
  refreshInterval,
  lastSyncAt,
  loading,
  onRefresh,
}: RefreshEngineProps) {
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (refreshInterval === 0 || !lastSyncAt) {
      setRemainingSeconds(null);
      return;
    }

    const intervalMs = refreshInterval * 60 * 1000;
    const update = () => {
      const target = new Date(lastSyncAt).getTime() + intervalMs;
      const remaining = Math.max(0, Math.ceil((target - Date.now()) / 1000));
      setRemainingSeconds(remaining);
      if (remaining === 0 && !loading) {
        onRefresh();
      }
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [lastSyncAt, loading, onRefresh, refreshInterval]);

  const totalSeconds = refreshInterval * 60;
  const progress =
    remainingSeconds === null || totalSeconds === 0
      ? 0
      : 1 - remainingSeconds / totalSeconds;
  const circumference = 2 * Math.PI * 20;
  const dashoffset = circumference - progress * circumference;

  return (
    <div className="glass-panel flex items-center gap-4 rounded-full px-4 py-3">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <svg className="h-12 w-12 -rotate-90" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="rgba(148,163,184,0.2)"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="#22C55E"
            strokeWidth="4"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
          />
        </svg>
        {loading ? (
          <LoaderCircle className="absolute h-4 w-4 animate-spin text-accent" />
        ) : (
          <RefreshCw className="absolute h-4 w-4 text-accent" />
        )}
      </div>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
          Auto refresh
        </p>
        <p className="text-sm text-text">
          {refreshInterval === 0
            ? "Off"
            : remainingSeconds === null
              ? `${refreshInterval} min`
              : `${Math.floor(remainingSeconds / 60)
                  .toString()
                  .padStart(2, "0")}:${(remainingSeconds % 60)
                  .toString()
                  .padStart(2, "0")}`}
        </p>
      </div>
    </div>
  );
}
