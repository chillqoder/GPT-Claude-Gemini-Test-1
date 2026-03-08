import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimeRange = '1h' | '6h' | 'today' | '7d';
export type LayoutMode = 'grid' | 'list' | 'focus';
export type SourceCategory = 'General' | 'Tech' | 'Finance' | 'Reddit' | 'HackerNews';

interface SearchState {
  keywords: string[];
  operator: 'AND' | 'OR';
  timeRange: TimeRange;
  limit: number;
  sources: Record<SourceCategory, boolean>;
  dedupEnabled: boolean;
  language: 'English' | 'All';
  layout: LayoutMode;
  autoRefresh: number; // 0 = off, else minutes
  savedSearches: { name: string; keywords: string[] }[];
  searchHistory: { keywords: string[], timestamp: number }[];
  
  setKeywords: (keywords: string[]) => void;
  setOperator: (op: 'AND' | 'OR') => void;
  setTimeRange: (range: TimeRange) => void;
  setLimit: (limit: number) => void;
  toggleSource: (source: SourceCategory) => void;
  setDedup: (enabled: boolean) => void;
  setLanguage: (lang: 'English' | 'All') => void;
  setLayout: (layout: LayoutMode) => void;
  setAutoRefresh: (mins: number) => void;
  addSavedSearch: (name: string, keywords: string[]) => void;
  addToHistory: (keywords: string[]) => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      keywords: [],
      operator: 'OR',
      timeRange: 'today',
      limit: 20,
      sources: {
        General: true,
        Tech: true,
        Finance: true,
        Reddit: true,
        HackerNews: true,
      },
      dedupEnabled: false,
      language: 'English',
      layout: 'grid',
      autoRefresh: 0,
      savedSearches: [],
      searchHistory: [],

      setKeywords: (keywords) => set({ keywords }),
      setOperator: (operator) => set({ operator }),
      setTimeRange: (timeRange) => set({ timeRange }),
      setLimit: (limit) => set({ limit }),
      toggleSource: (source) => set((state) => ({
        sources: { ...state.sources, [source]: !state.sources[source] }
      })),
      setDedup: (dedupEnabled) => set({ dedupEnabled }),
      setLanguage: (language) => set({ language }),
      setLayout: (layout) => set({ layout }),
      setAutoRefresh: (autoRefresh) => set({ autoRefresh }),
      addSavedSearch: (name, keywords) => set((state) => ({
        savedSearches: [...state.savedSearches, { name, keywords }]
      })),
      addToHistory: (keywords) => set((state) => ({
        searchHistory: [{ keywords, timestamp: Date.now() }, ...state.searchHistory.slice(0, 9)]
      })),
    }),
    {
      name: 'pulse-reader-storage',
    }
  )
);
