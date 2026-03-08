import { useState, KeyboardEvent } from 'react';
import { useSearchStore, LayoutMode } from '@/store/searchStore';
import { Search, X, RefreshCw, LayoutGrid, List, Maximize2 } from 'lucide-react';

export default function SearchPanel({ onRefresh, isRefreshing }: { onRefresh: () => void, isRefreshing: boolean }) {
  const { 
    keywords, setKeywords, 
    operator, setOperator,
    layout, setLayout
  } = useSearchStore();
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      if (keywords.length < 8 && !keywords.includes(input.trim())) {
        setKeywords([...keywords, input.trim()]);
      }
      setInput('');
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter(k => k !== kw));
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-border p-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="flex-1 w-full relative">
          <div className="flex flex-wrap items-center gap-2 bg-surface border border-border rounded-xl p-2 focus-within:border-primary transition-colors">
            <Search className="w-5 h-5 text-textMuted ml-2" />
            {keywords.map(kw => (
              <span key={kw} className="flex items-center space-x-1 bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-mono">
                <span>{kw}</span>
                <button onClick={() => removeKeyword(kw)} className="hover:text-white transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={keywords.length < 8 ? "Type keyword & hit Enter..." : "Max 8 keywords reached"}
              disabled={keywords.length >= 8}
              className="flex-1 bg-transparent border-none outline-none text-textPrimary placeholder:text-textMuted min-w-[150px] px-2"
            />
            {keywords.length > 1 && (
              <button 
                onClick={() => setOperator(operator === 'AND' ? 'OR' : 'AND')}
                className="ml-auto text-xs font-mono font-bold px-2 py-1 rounded bg-border text-textMuted hover:text-textPrimary"
              >
                {operator}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <div className="flex items-center bg-surface border border-border rounded-lg p-1">
            {(['grid', 'list', 'focus'] as LayoutMode[]).map((l) => (
              <button
                key={l}
                onClick={() => setLayout(l)}
                className={`p-2 rounded-md transition-colors ${layout === l ? 'bg-border text-textPrimary' : 'text-textMuted hover:text-textPrimary'}`}
                title={`Layout: ${l}`}
              >
                {l === 'grid' && <LayoutGrid className="w-4 h-4" />}
                {l === 'list' && <List className="w-4 h-4" />}
                {l === 'focus' && <Maximize2 className="w-4 h-4" />}
              </button>
            ))}
          </div>
          
          <button
            onClick={onRefresh}
            disabled={isRefreshing || keywords.length === 0}
            className="flex items-center space-x-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-mono text-sm transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">SYNC</span>
          </button>
        </div>

      </div>
    </div>
  );
}
