'use client';

import { useSearchStore } from '../../store/searchStore';
import { relativeTime } from '../../lib/utils';

export default function StatsBar() {
  const { articles, sourceStatuses, lastSyncTime, dupesRemoved, totalRawCount } = useSearchStore();

  const successSources = sourceStatuses.filter(s => s.status === 'success').length;

  // Calculate timespan
  let timespanStr = '--';
  if (articles.length > 0) {
    const dates = articles.map(a => a.publishedAt.getTime());
    const oldest = Math.min(...dates);
    const newest = Math.max(...dates);
    const diffH = Math.round((newest - oldest) / (1000 * 60 * 60));
    timespanStr = diffH < 1 ? '<1h' : `${diffH}h`;
  }

  const syncStr = lastSyncTime ? relativeTime(lastSyncTime) : '--';

  return (
    <div className="flex items-center gap-4 flex-wrap px-3 py-2 bg-[#1A1D27] border border-[#2D3748] rounded-lg text-[10px] font-mono text-[#64748B] uppercase tracking-wider">
      <span>
        Found: <span className="text-[#F1F5F9]">{articles.length}</span> articles
      </span>
      <span className="text-[#2D3748]">&middot;</span>
      <span>
        Sources: <span className="text-[#F1F5F9]">{successSources}</span>
      </span>
      <span className="text-[#2D3748]">&middot;</span>
      <span>
        Timespan: <span className="text-[#F1F5F9]">{timespanStr}</span>
      </span>
      <span className="text-[#2D3748]">&middot;</span>
      <span>
        Last sync: <span className="text-[#F1F5F9]">{syncStr}</span>
      </span>
      {dupesRemoved > 0 && (
        <>
          <span className="text-[#2D3748]">&middot;</span>
          <span>
            Dupes removed: <span className="text-[#F59E0B]">{dupesRemoved}</span>
          </span>
        </>
      )}
      {totalRawCount > 0 && totalRawCount !== articles.length && (
        <>
          <span className="text-[#2D3748]">&middot;</span>
          <span>
            Raw: <span className="text-[#F1F5F9]">{totalRawCount}</span>
          </span>
        </>
      )}
    </div>
  );
}
