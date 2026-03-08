'use client';

import { useSearchStore } from '../../store/searchStore';

export default function SourceStatusGrid() {
  const { sourceStatuses } = useSearchStore();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-md">
      {sourceStatuses.map(source => (
        <div
          key={source.name}
          className="flex items-center gap-2 px-3 py-2 bg-[#1A1D27] border border-[#2D3748] rounded-lg"
        >
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              source.status === 'success'
                ? 'bg-[#22C55E]'
                : source.status === 'error'
                ? 'bg-red-400'
                : source.status === 'loading'
                ? 'bg-[#F59E0B] animate-pulse'
                : 'bg-[#64748B]'
            }`}
          />
          <span className="text-xs font-mono text-[#F1F5F9]">{source.name}</span>
          {source.status === 'success' && (
            <span className="text-[10px] font-mono text-[#64748B] ml-auto">{source.count}</span>
          )}
          {source.status === 'error' && (
            <span className="text-[10px] text-red-400 ml-auto">fail</span>
          )}
        </div>
      ))}
    </div>
  );
}
