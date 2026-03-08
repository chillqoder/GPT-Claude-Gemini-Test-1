import { useSearchStore } from '@/store/searchStore';

interface StatsBarProps {
  articleCount: number;
  sourceCount: number;
  lastSync: Date | null;
  dupesRemoved: number;
}

export default function StatsBar({ articleCount, sourceCount, lastSync, dupesRemoved }: StatsBarProps) {
  const { timeRange } = useSearchStore();

  const syncText = lastSync 
    ? `${Math.floor((Date.now() - lastSync.getTime()) / 60000)} min ago` 
    : 'Never';

  return (
    <div className="w-full bg-surface border-y border-border px-4 py-2 flex items-center justify-between overflow-x-auto text-[11px] font-mono text-textMuted whitespace-nowrap scrollbar-hide">
      <div className="flex space-x-6 min-w-max mx-auto">
        <span className="flex items-center">
          <span className="text-textPrimary mr-2">FOUND:</span> {articleCount} articles
        </span>
        <span className="text-border">·</span>
        <span className="flex items-center">
          <span className="text-textPrimary mr-2">SOURCES:</span> {sourceCount}
        </span>
        <span className="text-border">·</span>
        <span className="flex items-center">
          <span className="text-textPrimary mr-2">TIMESPAN:</span> {timeRange}
        </span>
        <span className="text-border">·</span>
        <span className="flex items-center">
          <span className="text-textPrimary mr-2">LAST SYNC:</span> {syncText}
        </span>
        {dupesRemoved > 0 && (
          <>
            <span className="text-border">·</span>
            <span className="flex items-center text-accent">
              DUPES REMOVED: {dupesRemoved}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
