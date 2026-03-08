'use client';

import { X, Star, Trash2, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchStore, SavedSearch } from '../../store/searchStore';

interface HistorySidebarProps {
  onLoadSearch: (search: SavedSearch) => void;
}

export default function HistorySidebar({ onLoadSearch }: HistorySidebarProps) {
  const {
    historyOpen, setHistoryOpen,
    searchHistory,
    togglePinSearch, removeFromHistory, clearHistory,
  } = useSearchStore();

  const pinnedSearches = searchHistory.filter(s => s.pinned);
  const recentSearches = searchHistory.filter(s => !s.pinned);

  return (
    <AnimatePresence>
      {historyOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setHistoryOpen(false)}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 h-full w-80 bg-[#0F1117] border-r border-[#2D3748] z-50 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#F1F5F9]">Search History</h2>
              <button onClick={() => setHistoryOpen(false)} className="text-[#64748B] hover:text-[#F1F5F9]">
                <X size={20} />
              </button>
            </div>

            {/* Pinned */}
            {pinnedSearches.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-mono text-[#64748B] uppercase tracking-wider mb-3">Saved Presets</h3>
                <div className="space-y-2">
                  {pinnedSearches.map(s => (
                    <SearchItem
                      key={s.id}
                      search={s}
                      onLoad={() => onLoadSearch(s)}
                      onTogglePin={() => togglePinSearch(s.id)}
                      onRemove={() => removeFromHistory(s.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Recent */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-mono text-[#64748B] uppercase tracking-wider">Recent</h3>
                {recentSearches.length > 0 && (
                  <button onClick={clearHistory} className="text-[10px] text-[#64748B] hover:text-red-400">
                    Clear all
                  </button>
                )}
              </div>
              {recentSearches.length === 0 ? (
                <p className="text-sm text-[#64748B]">No recent searches</p>
              ) : (
                <div className="space-y-2">
                  {recentSearches.map(s => (
                    <SearchItem
                      key={s.id}
                      search={s}
                      onLoad={() => onLoadSearch(s)}
                      onTogglePin={() => togglePinSearch(s.id)}
                      onRemove={() => removeFromHistory(s.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SearchItem({
  search,
  onLoad,
  onTogglePin,
  onRemove,
}: {
  search: SavedSearch;
  onLoad: () => void;
  onTogglePin: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-start gap-2 p-2 bg-[#1A1D27] border border-[#2D3748] rounded-lg group">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-1 mb-1">
          {search.keywords.map(kw => (
            <span key={kw} className="text-[10px] px-1.5 py-0.5 bg-[#3B82F6]/20 text-[#3B82F6] rounded">
              {kw}
            </span>
          ))}
        </div>
        <span className="text-[10px] font-mono text-[#64748B]">
          {search.timeRange} &middot; {search.booleanMode}
        </span>
      </div>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button onClick={onLoad} className="p-1 text-[#64748B] hover:text-[#22C55E]" title="Run">
          <PlayCircle size={14} />
        </button>
        <button onClick={onTogglePin} className={`p-1 ${search.pinned ? 'text-[#F59E0B]' : 'text-[#64748B] hover:text-[#F59E0B]'}`} title="Pin">
          <Star size={14} fill={search.pinned ? '#F59E0B' : 'none'} />
        </button>
        <button onClick={onRemove} className="p-1 text-[#64748B] hover:text-red-400" title="Remove">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
