"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { SOURCE_CATEGORIES, type Article, type FontSize, type LanguageOption, type LayoutMode, type SearchHistoryEntry, type SearchPreset, type SearchResultPayload, type SearchSnapshot, type SearchStats, type SortMode, type SourceCategory, type SourceStatus, type ThemeMode, type TimeRange } from "@/lib/types";
import { createPresetLabel, createSearchPreset, uniqCategories } from "@/lib/utils";

interface SearchStore extends SearchSnapshot {
  articles: Article[];
  sourceStatuses: SourceStatus[];
  history: SearchHistoryEntry[];
  savedPresets: SearchPreset[];
  defaultKeywordPresets: string[];
  stats: SearchStats;
  loading: boolean;
  hydrated: boolean;
  offline: boolean;
  partialFailure: boolean;
  toastMessage: string | null;
  cooldownUntil: string | null;
  lastSyncAt: string | null;
  newArticleIds: string[];
  settingsOpen: boolean;
  historyOpen: boolean;
  setHydrated: (value: boolean) => void;
  addKeyword: (keyword: string) => void;
  removeKeyword: (keyword: string) => void;
  clearKeywords: () => void;
  setBooleanMode: (mode: SearchSnapshot["booleanMode"]) => void;
  setTimeRange: (range: TimeRange) => void;
  setArticleLimit: (limit: number) => void;
  toggleSourceCategory: (category: SourceCategory) => void;
  setSourceCategories: (categories: SourceCategory[]) => void;
  setDedupeEnabled: (value: boolean) => void;
  setLanguage: (value: LanguageOption) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  setRefreshInterval: (minutes: number) => void;
  setFontSize: (size: FontSize) => void;
  setTheme: (theme: ThemeMode) => void;
  setSortMode: (mode: SortMode) => void;
  setDefaultKeywordPresets: (presets: string[]) => void;
  setLoading: (value: boolean) => void;
  setOffline: (value: boolean) => void;
  setToastMessage: (message: string | null) => void;
  setCooldownUntil: (value: string | null) => void;
  setSearchPayload: (payload: SearchResultPayload, highlightNew: boolean) => void;
  setSourceStatuses: (statuses: SourceStatus[]) => void;
  clearResults: () => void;
  addHistoryEntry: () => void;
  saveCurrentPreset: () => void;
  removeSavedPreset: (presetId: string) => void;
  applyPreset: (preset: SearchPreset) => void;
  setSettingsOpen: (value: boolean) => void;
  setHistoryOpen: (value: boolean) => void;
  applyIncomingSnapshot: (partial: Partial<SearchSnapshot>) => void;
  clearToast: () => void;
  clearNewBadges: () => void;
  getSnapshot: () => SearchSnapshot;
}

const DEFAULT_STATE: SearchSnapshot = {
  keywords: [],
  booleanMode: "OR",
  timeRange: "today",
  articleLimit: 20,
  sourceCategories: [...SOURCE_CATEGORIES],
  dedupeEnabled: true,
  language: "en",
  layoutMode: "grid",
  refreshInterval: 15,
  fontSize: "md",
  theme: "dark",
  sortMode: "newest",
};

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,
      articles: [],
      sourceStatuses: [],
      history: [],
      savedPresets: [],
      defaultKeywordPresets: [],
      stats: {
        found: 0,
        sources: 0,
        timespanHours: 0,
        lastSyncAt: null,
        dupesRemoved: 0,
      },
      loading: false,
      hydrated: false,
      offline: false,
      partialFailure: false,
      toastMessage: null,
      cooldownUntil: null,
      lastSyncAt: null,
      newArticleIds: [],
      settingsOpen: false,
      historyOpen: false,
      setHydrated: (value) => set({ hydrated: value }),
      addKeyword: (keyword) =>
        set((state) => {
          const cleaned = keyword.trim();
          if (!cleaned || state.keywords.includes(cleaned) || state.keywords.length >= 8) {
            return {};
          }
          return {
            keywords: [...state.keywords, cleaned],
          };
        }),
      removeKeyword: (keyword) =>
        set((state) => ({
          keywords: state.keywords.filter((item) => item !== keyword),
        })),
      clearKeywords: () => set({ keywords: [] }),
      setBooleanMode: (booleanMode) => set({ booleanMode }),
      setTimeRange: (timeRange) => set({ timeRange }),
      setArticleLimit: (articleLimit) => set({ articleLimit }),
      toggleSourceCategory: (category) =>
        set((state) => {
          const next = state.sourceCategories.includes(category)
            ? state.sourceCategories.filter((item) => item !== category)
            : [...state.sourceCategories, category];

          return {
            sourceCategories: next.length > 0 ? uniqCategories(next) : state.sourceCategories,
          };
        }),
      setSourceCategories: (sourceCategories) =>
        set({
          sourceCategories: uniqCategories(sourceCategories),
        }),
      setDedupeEnabled: (dedupeEnabled) => set({ dedupeEnabled }),
      setLanguage: (language) => set({ language }),
      setLayoutMode: (layoutMode) => set({ layoutMode }),
      setRefreshInterval: (refreshInterval) => set({ refreshInterval }),
      setFontSize: (fontSize) => set({ fontSize }),
      setTheme: (theme) => set({ theme }),
      setSortMode: (sortMode) => set({ sortMode }),
      setDefaultKeywordPresets: (defaultKeywordPresets) =>
        set({
          defaultKeywordPresets: defaultKeywordPresets
            .map((entry) => entry.trim())
            .filter(Boolean),
        }),
      setLoading: (loading) => set({ loading }),
      setOffline: (offline) => set({ offline }),
      setToastMessage: (toastMessage) => set({ toastMessage }),
      setCooldownUntil: (cooldownUntil) => set({ cooldownUntil }),
      setSearchPayload: (payload, highlightNew) =>
        set((state) => {
          const previousIds = new Set(state.articles.map((article) => article.id));
          const newArticleIds = highlightNew
            ? payload.articles
                .filter((article) => !previousIds.has(article.id))
                .map((article) => article.id)
            : [];

          return {
            articles: payload.articles,
            sourceStatuses: payload.statuses,
            stats: payload.stats,
            partialFailure: payload.partialFailure,
            lastSyncAt: payload.stats.lastSyncAt,
            newArticleIds,
          };
        }),
      setSourceStatuses: (sourceStatuses) => set({ sourceStatuses }),
      clearResults: () =>
        set({
          articles: [],
          sourceStatuses: [],
          stats: {
            found: 0,
            sources: 0,
            timespanHours: 0,
            lastSyncAt: null,
            dupesRemoved: 0,
          },
          partialFailure: false,
          lastSyncAt: null,
          newArticleIds: [],
        }),
      addHistoryEntry: () =>
        set((state) => {
          const preset = createSearchPreset(get().getSnapshot());
          const nextEntry: SearchHistoryEntry = {
            id: `history-${Date.now()}`,
            label: createPresetLabel(state.keywords),
            lastUsedAt: new Date().toISOString(),
            preset,
          };
          const deduped = [
            nextEntry,
            ...state.history.filter(
              (entry) =>
                entry.preset.keywords.join("|") !== nextEntry.preset.keywords.join("|") ||
                entry.preset.timeRange !== nextEntry.preset.timeRange,
            ),
          ].slice(0, 10);

          return {
            history: deduped,
          };
        }),
      saveCurrentPreset: () =>
        set((state) => {
          const preset = createSearchPreset(get().getSnapshot());
          if (state.savedPresets.some((item) => item.label === preset.label)) {
            return state;
          }
          return {
            savedPresets: [preset, ...state.savedPresets],
          };
        }),
      removeSavedPreset: (presetId) =>
        set((state) => ({
          savedPresets: state.savedPresets.filter((preset) => preset.id !== presetId),
        })),
      applyPreset: (preset) =>
        set({
          keywords: preset.keywords,
          booleanMode: preset.booleanMode,
          timeRange: preset.timeRange,
          articleLimit: preset.articleLimit,
          sourceCategories: preset.sourceCategories,
          dedupeEnabled: preset.dedupeEnabled,
          language: preset.language,
          sortMode: preset.sortMode,
        }),
      setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
      setHistoryOpen: (historyOpen) => set({ historyOpen }),
      applyIncomingSnapshot: (partial) => set(partial),
      clearToast: () => set({ toastMessage: null }),
      clearNewBadges: () => set({ newArticleIds: [] }),
      getSnapshot: () => {
        const state = get();
        return {
          keywords: state.keywords,
          booleanMode: state.booleanMode,
          timeRange: state.timeRange,
          articleLimit: state.articleLimit,
          sourceCategories: state.sourceCategories,
          dedupeEnabled: state.dedupeEnabled,
          language: state.language,
          layoutMode: state.layoutMode,
          refreshInterval: state.refreshInterval,
          fontSize: state.fontSize,
          theme: state.theme,
          sortMode: state.sortMode,
        };
      },
    }),
    {
      name: "pulse-reader-store",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        keywords: state.keywords,
        booleanMode: state.booleanMode,
        timeRange: state.timeRange,
        articleLimit: state.articleLimit,
        sourceCategories: state.sourceCategories,
        dedupeEnabled: state.dedupeEnabled,
        language: state.language,
        layoutMode: state.layoutMode,
        refreshInterval: state.refreshInterval,
        fontSize: state.fontSize,
        theme: state.theme,
        sortMode: state.sortMode,
        history: state.history,
        savedPresets: state.savedPresets,
        defaultKeywordPresets: state.defaultKeywordPresets,
      }),
      onRehydrateStorage: () => () => {
        useSearchStore.getState().setHydrated(true);
      },
    },
  ),
);
