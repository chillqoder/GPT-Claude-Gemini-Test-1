'use client';

import { useState, useCallback, KeyboardEvent } from 'react';
import { Search, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchStore } from '../../store/searchStore';
import { TimeRange } from '../../lib/filters/timeFilter';

const TIME_RANGES: { label: string; value: TimeRange }[] = [
  { label: 'Last 1h', value: '1h' },
  { label: 'Last 6h', value: '6h' },
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: '7d' },
];

const SOURCE_OPTIONS = ['General', 'Tech', 'Finance', 'Reddit', 'HackerNews'];

export default function SearchPanel({ onSearch }: { onSearch: () => void }) {
  const [inputValue, setInputValue] = useState('');
  const {
    keywords, addKeyword, removeKeyword,
    timeRange, setTimeRange,
    articleLimit, setArticleLimit,
    booleanMode, setBooleanMode,
    enabledSources, toggleSource,
    deduplicationEnabled, setDeduplication,
    isLoading,
  } = useSearchStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputValue.trim()) {
        e.preventDefault();
        addKeyword(inputValue.trim());
        setInputValue('');
      }
      if (e.key === 'Backspace' && !inputValue && keywords.length > 0) {
        removeKeyword(keywords[keywords.length - 1]);
      }
    },
    [inputValue, keywords, addKeyword, removeKeyword]
  );

  const handleSearch = () => {
    if (keywords.length === 0) return;
    onSearch();
  };

  return (
    <div className="w-full space-y-4">
      {/* Keyword Input */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 flex-wrap bg-[#1A1D27] border border-[#2D3748] rounded-lg px-3 py-2 focus-within:border-[#3B82F6] transition-colors">
          <Search size={18} className="text-[#64748B] shrink-0" />
          <AnimatePresence>
            {keywords.map(kw => (
              <motion.span
                key={kw}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="inline-flex items-center gap-1 bg-[#3B82F6]/20 text-[#3B82F6] text-sm px-2 py-0.5 rounded-md font-medium"
              >
                {kw}
                <button onClick={() => removeKeyword(kw)} className="hover:text-white">
                  <X size={14} />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={keywords.length === 0 ? 'Enter keywords...' : keywords.length >= 8 ? 'Max 8 keywords' : 'Add keyword...'}
            disabled={keywords.length >= 8}
            className="flex-1 min-w-[120px] bg-transparent text-[#F1F5F9] placeholder-[#64748B] outline-none text-sm"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={keywords.length === 0 || isLoading}
          className="px-5 py-2 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Boolean Mode */}
        <button
          onClick={() => setBooleanMode(booleanMode === 'AND' ? 'OR' : 'AND')}
          className="flex items-center gap-1.5 text-xs font-mono text-[#64748B] hover:text-[#F1F5F9] transition-colors"
        >
          {booleanMode === 'AND' ? <ToggleRight size={16} className="text-[#3B82F6]" /> : <ToggleLeft size={16} />}
          {booleanMode}
        </button>

        {/* Time Range */}
        <div className="flex bg-[#1A1D27] rounded-lg border border-[#2D3748] overflow-hidden">
          {TIME_RANGES.map(tr => (
            <button
              key={tr.value}
              onClick={() => setTimeRange(tr.value)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                timeRange === tr.value
                  ? 'bg-[#3B82F6] text-white'
                  : 'text-[#64748B] hover:text-[#F1F5F9]'
              }`}
            >
              {tr.label}
            </button>
          ))}
        </div>

        {/* Article Limit */}
        <div className="flex items-center gap-2 text-xs text-[#64748B]">
          <span className="font-mono">Limit:</span>
          <input
            type="range"
            min={10}
            max={100}
            step={10}
            value={articleLimit}
            onChange={e => setArticleLimit(Number(e.target.value))}
            className="w-20 accent-[#3B82F6]"
          />
          <span className="font-mono text-[#F1F5F9] w-6">{articleLimit}</span>
        </div>

        {/* Source Filters */}
        <div className="flex gap-1.5 flex-wrap">
          {SOURCE_OPTIONS.map(src => (
            <button
              key={src}
              onClick={() => toggleSource(src)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                enabledSources.includes(src)
                  ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30'
                  : 'bg-[#1A1D27] text-[#64748B] border border-[#2D3748]'
              }`}
            >
              {src}
            </button>
          ))}
        </div>

        {/* Deduplication */}
        <button
          onClick={() => setDeduplication(!deduplicationEnabled)}
          className="flex items-center gap-1.5 text-xs font-mono text-[#64748B] hover:text-[#F1F5F9] transition-colors"
        >
          {deduplicationEnabled ? <ToggleRight size={16} className="text-[#22C55E]" /> : <ToggleLeft size={16} />}
          Dedup
        </button>
      </div>
    </div>
  );
}
