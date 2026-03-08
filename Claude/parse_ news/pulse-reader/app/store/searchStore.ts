'use client';

import { create } from 'zustand';
import { Article } from '../lib/parsers/normalize';
import { TimeRange } from '../lib/filters/timeFilter';
import { SortMode } from '../lib/filters/sort';

export type LayoutMode = 'grid' | 'list' | 'focus';
export type RefreshInterval = 0 | 5 | 15 | 30;
export type FontSize = 'small' | 'medium' | 'large';

export interface SavedSearch {
  id: string;
  keywords: string[];
  timeRange: TimeRange;
  limit: number;
  booleanMode: 'AND' | 'OR';
  sources: string[];
  timestamp: number;
  pinned: boolean;
}

export interface SourceStatus {
  name: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  count: number;
  error?: string;
}

interface SearchState {
  // Search params
  keywords: string[];
  timeRange: TimeRange;
  articleLimit: number;
  booleanMode: 'AND' | 'OR';
  enabledSources: string[];
  deduplicationEnabled: boolean;
  sortMode: SortMode;

  // Results
  articles: Article[];
  previousArticleIds: Set<string>;
  newArticleIds: Set<string>;
  isLoading: boolean;
  sourceStatuses: SourceStatus[];
  totalRawCount: number;
  dupesRemoved: number;
  lastSyncTime: Date | null;

  // UI
  layoutMode: LayoutMode;
  refreshInterval: RefreshInterval;
  darkMode: boolean;
  fontSize: FontSize;
  settingsOpen: boolean;
  historyOpen: boolean;

  // History
  searchHistory: SavedSearch[];

  // Actions
  setKeywords: (keywords: string[]) => void;
  addKeyword: (keyword: string) => void;
  removeKeyword: (keyword: string) => void;
  setTimeRange: (range: TimeRange) => void;
  setArticleLimit: (limit: number) => void;
  setBooleanMode: (mode: 'AND' | 'OR') => void;
  toggleSource: (source: string) => void;
  setDeduplication: (enabled: boolean) => void;
  setSortMode: (mode: SortMode) => void;

  setArticles: (articles: Article[]) => void;
  addArticles: (articles: Article[], sourceName: string) => void;
  setLoading: (loading: boolean) => void;
  setSourceStatus: (name: string, status: SourceStatus['status'], count?: number, error?: string) => void;
  resetSourceStatuses: () => void;
  setTotalRawCount: (count: number) => void;
  setDupesRemoved: (count: number) => void;
  setLastSyncTime: (time: Date) => void;
  prepareForNewSearch: () => void;

  setLayoutMode: (mode: LayoutMode) => void;
  setRefreshInterval: (interval: RefreshInterval) => void;
  setDarkMode: (dark: boolean) => void;
  setFontSize: (size: FontSize) => void;
  setSettingsOpen: (open: boolean) => void;
  setHistoryOpen: (open: boolean) => void;

  addToHistory: (search: SavedSearch) => void;
  togglePinSearch: (id: string) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

const ALL_SOURCES = ['General', 'Tech', 'Finance', 'Reddit', 'HackerNews'];

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export const useSearchStore = create<SearchState>((set, get) => ({
  keywords: [],
  timeRange: 'today',
  articleLimit: 20,
  booleanMode: 'OR',
  enabledSources: [...ALL_SOURCES],
  deduplicationEnabled: true,
  sortMode: 'date',

  articles: [],
  previousArticleIds: new Set(),
  newArticleIds: new Set(),
  isLoading: false,
  sourceStatuses: ALL_SOURCES.map(name => ({ name, status: 'idle', count: 0 })),
  totalRawCount: 0,
  dupesRemoved: 0,
  lastSyncTime: null,

  layoutMode: 'grid',
  refreshInterval: 0,
  darkMode: true,
  fontSize: 'medium',
  settingsOpen: false,
  historyOpen: false,

  searchHistory: [],

  setKeywords: (keywords) => set({ keywords }),
  addKeyword: (keyword) => {
    const current = get().keywords;
    if (current.length < 8 && !current.includes(keyword.trim())) {
      set({ keywords: [...current, keyword.trim()] });
    }
  },
  removeKeyword: (keyword) => set(s => ({ keywords: s.keywords.filter(k => k !== keyword) })),
  setTimeRange: (timeRange) => set({ timeRange }),
  setArticleLimit: (articleLimit) => set({ articleLimit }),
  setBooleanMode: (booleanMode) => set({ booleanMode }),
  toggleSource: (source) =>
    set(s => {
      const sources = s.enabledSources.includes(source)
        ? s.enabledSources.filter(s2 => s2 !== source)
        : [...s.enabledSources, source];
      return { enabledSources: sources };
    }),
  setDeduplication: (deduplicationEnabled) => set({ deduplicationEnabled }),
  setSortMode: (sortMode) => set({ sortMode }),

  setArticles: (articles) => set({ articles }),
  addArticles: (newArticles, sourceName) =>
    set(s => {
      const updated = [...s.articles, ...newArticles];
      const status = s.sourceStatuses.map(ss =>
        ss.name === sourceName ? { ...ss, status: 'success' as const, count: newArticles.length } : ss
      );
      return { articles: updated, sourceStatuses: status };
    }),
  setLoading: (isLoading) => set({ isLoading }),
  setSourceStatus: (name, status, count, error) =>
    set(s => ({
      sourceStatuses: s.sourceStatuses.map(ss =>
        ss.name === name ? { ...ss, status, count: count ?? ss.count, error } : ss
      ),
    })),
  resetSourceStatuses: () =>
    set({ sourceStatuses: ALL_SOURCES.map(name => ({ name, status: 'idle', count: 0 })) }),
  setTotalRawCount: (totalRawCount) => set({ totalRawCount }),
  setDupesRemoved: (dupesRemoved) => set({ dupesRemoved }),
  setLastSyncTime: (lastSyncTime) => set({ lastSyncTime }),
  prepareForNewSearch: () => {
    const currentIds = new Set(get().articles.map(a => a.id));
    set({
      previousArticleIds: currentIds,
      newArticleIds: new Set(),
      articles: [],
      isLoading: true,
      totalRawCount: 0,
      dupesRemoved: 0,
    });
    get().resetSourceStatuses();
  },

  setLayoutMode: (layoutMode) => {
    set({ layoutMode });
    saveToStorage('pr_layout', layoutMode);
  },
  setRefreshInterval: (refreshInterval) => set({ refreshInterval }),
  setDarkMode: (darkMode) => {
    set({ darkMode });
    saveToStorage('pr_darkMode', darkMode);
  },
  setFontSize: (fontSize) => {
    set({ fontSize });
    saveToStorage('pr_fontSize', fontSize);
  },
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
  setHistoryOpen: (historyOpen) => set({ historyOpen }),

  addToHistory: (search) =>
    set(s => {
      const history = [search, ...s.searchHistory.filter(h => h.id !== search.id)].slice(0, 10);
      saveToStorage('pr_history', history);
      return { searchHistory: history };
    }),
  togglePinSearch: (id) =>
    set(s => {
      const history = s.searchHistory.map(h =>
        h.id === id ? { ...h, pinned: !h.pinned } : h
      );
      saveToStorage('pr_history', history);
      return { searchHistory: history };
    }),
  removeFromHistory: (id) =>
    set(s => {
      const history = s.searchHistory.filter(h => h.id !== id);
      saveToStorage('pr_history', history);
      return { searchHistory: history };
    }),
  clearHistory: () => {
    saveToStorage('pr_history', []);
    set({ searchHistory: [] });
  },
}));

// Initialize from localStorage on client side
if (typeof window !== 'undefined') {
  const layout = loadFromStorage<LayoutMode>('pr_layout', 'grid');
  const darkMode = loadFromStorage<boolean>('pr_darkMode', true);
  const fontSize = loadFromStorage<FontSize>('pr_fontSize', 'medium');
  const history = loadFromStorage<SavedSearch[]>('pr_history', []);
  useSearchStore.setState({ layoutMode: layout, darkMode, fontSize, searchHistory: history });
}
