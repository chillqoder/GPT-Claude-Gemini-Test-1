"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WifiOff } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { ArticleGrid } from "@/app/components/ArticleGrid";
import { ErrorStates } from "@/app/components/ErrorStates";
import { HistorySidebar } from "@/app/components/HistorySidebar";
import { RefreshEngine } from "@/app/components/RefreshEngine";
import { SearchPanel } from "@/app/components/SearchPanel";
import { SettingsDrawer } from "@/app/components/SettingsDrawer";
import { SourceStatusGrid } from "@/app/components/SourceStatusGrid";
import { StatsBar } from "@/app/components/StatsBar";
import { clearSearchCache, readSearchCache, writeSearchCache } from "@/lib/cache";
import { runSearch } from "@/lib/searchEngine";
import { parseSnapshotFromParams } from "@/lib/urlState";
import type { SearchResultPayload } from "@/lib/types";
import { articlesToCsv, buildSearchCacheKey, downloadBlob, formatSearchShareParams } from "@/lib/utils";
import { useSearchStore } from "@/store/searchStore";

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const initializedFromUrlRef = useRef(false);
  const hasCompletedSearchRef = useRef(false);
  const [ready, setReady] = useState(false);

  const store = useSearchStore();

  const {
    hydrated,
    keywords,
    timeRange,
    articleLimit,
    sourceCategories,
    dedupeEnabled,
    language,
    layoutMode,
    refreshInterval,
    fontSize,
    theme,
    sortMode,
    booleanMode,
    articles,
    sourceStatuses,
    history,
    savedPresets,
    defaultKeywordPresets,
    loading,
    stats,
    offline,
    toastMessage,
    cooldownUntil,
    newArticleIds,
    historyOpen,
    settingsOpen,
    setLoading,
    setOffline,
    setToastMessage,
    setCooldownUntil,
    setSearchPayload,
    addHistoryEntry,
    saveCurrentPreset,
    removeSavedPreset,
    applyPreset,
    setHistoryOpen,
    setSettingsOpen,
    clearToast,
    clearNewBadges,
    applyIncomingSnapshot,
    getSnapshot,
    setFontSize,
    setTheme,
    setRefreshInterval,
    setTimeRange,
    setArticleLimit,
    setDefaultKeywordPresets,
    clearResults,
  } = store;

  useEffect(() => {
    useSearchStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (!hydrated || initializedFromUrlRef.current) {
      return;
    }

    const incoming = parseSnapshotFromParams(
      new URLSearchParams(window.location.search),
    );
    if (Object.keys(incoming).length > 0) {
      applyIncomingSnapshot(incoming);
    }

    initializedFromUrlRef.current = true;
    setReady(true);
  }, [applyIncomingSnapshot, hydrated]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.body.classList.remove("font-scale-sm", "font-scale-md", "font-scale-lg");
    document.body.classList.add(`font-scale-${fontSize}`);
  }, [fontSize, ready, theme]);

  useEffect(() => {
    const goOnline = () => setOffline(false);
    const goOffline = () => {
      setOffline(true);
      setToastMessage("Offline mode detected. Cached results will be used when available.");
    };

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    setOffline(!navigator.onLine);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, [setOffline, setToastMessage]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeout = window.setTimeout(() => clearToast(), 5000);
    return () => window.clearTimeout(timeout);
  }, [clearToast, toastMessage]);

  useEffect(() => {
    if (newArticleIds.length === 0) {
      return;
    }

    const timeout = window.setTimeout(() => clearNewBadges(), 10000);
    return () => window.clearTimeout(timeout);
  }, [clearNewBadges, newArticleIds.length]);

  const syncUrl = useCallback(() => {
    const params = formatSearchShareParams(getSnapshot());
    const queryString = params.toString();
    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  }, [getSnapshot, pathname, router]);

  const executeSearch = useCallback(async (highlightNew: boolean) => {
    if (keywords.length === 0) {
      clearResults();
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setLoading(true);
    setCooldownUntil(null);

    const currentSnapshot = getSnapshot();
    const cacheKey = buildSearchCacheKey(currentSnapshot);
    const cached = readSearchCache(cacheKey);

    if (cached) {
      setSearchPayload(
        {
          ...cached,
          fromCache: true,
        },
        false,
      );
    }

    if (!navigator.onLine) {
      if (!cached) {
        clearResults();
      }
      setOffline(true);
      setLoading(false);
      return;
    }

    try {
      const finalPayload = await runSearch({
        snapshot: currentSnapshot,
        signal: controller.signal,
        onProgress: (payload) => {
          setSearchPayload(
            payload,
            highlightNew && hasCompletedSearchRef.current,
          );

          const rateLimited = payload.statuses.find(
            (status) => status.state === "rate_limited",
          );
          if (rateLimited) {
            setCooldownUntil(
              new Date(Date.now() + 60 * 1000).toISOString(),
            );
          }
        },
      });

      if (controller.signal.aborted) {
        return;
      }

      const nextPayload: SearchResultPayload = {
        ...finalPayload,
        fromCache: false,
      };

      writeSearchCache(cacheKey, nextPayload);
      setSearchPayload(
        nextPayload,
        highlightNew && hasCompletedSearchRef.current,
      );
      addHistoryEntry();

      if (nextPayload.partialFailure) {
        const failedCount = nextPayload.statuses.filter(
          (status) => status.state === "error" || status.state === "rate_limited",
        ).length;
        setToastMessage(
          `${failedCount}/${nextPayload.statuses.length} sources unreachable. Results may be incomplete.`,
        );
      }

      hasCompletedSearchRef.current = true;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      setToastMessage(
        error instanceof Error ? error.message : "Search failed unexpectedly.",
      );
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setLoading(false);
    }
  }, [
    addHistoryEntry,
    clearResults,
    getSnapshot,
    keywords.length,
    setCooldownUntil,
    setLoading,
    setOffline,
    setSearchPayload,
    setToastMessage,
  ]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    syncUrl();
  }, [
    ready,
    keywords,
    booleanMode,
    timeRange,
    articleLimit,
    language,
    layoutMode,
    dedupeEnabled,
    sortMode,
    sourceCategories,
    syncUrl,
  ]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void executeSearch(false);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [
    ready,
    keywords,
    booleanMode,
    timeRange,
    articleLimit,
    language,
    sourceCategories,
    dedupeEnabled,
    sortMode,
    executeSearch,
  ]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === "Escape") {
        useSearchStore.getState().clearKeywords();
        inputRef.current?.blur();
      }

      if (!isTyping && event.key.toLowerCase() === "r") {
        event.preventDefault();
        void executeSearch(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [executeSearch]);

  const exportJson = () => {
    downloadBlob(
      "pulse-reader-results.json",
      JSON.stringify(articles, null, 2),
      "application/json",
    );
  };

  const exportCsv = () => {
    downloadBlob("pulse-reader-results.csv", articlesToCsv(articles), "text/csv");
  };

  if (!ready) {
    return <main className="min-h-screen" />;
  }

  return (
    <main className="mx-auto min-h-screen max-w-[1600px] px-4 pb-10 md:px-6">
      <HistorySidebar
        open={historyOpen}
        history={history}
        savedPresets={savedPresets}
        onClose={() => setHistoryOpen(false)}
        onApplyPreset={(preset) => {
          applyPreset(preset);
          setHistoryOpen(false);
        }}
        onRemovePreset={removeSavedPreset}
      />

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        fontSize={fontSize}
        theme={theme}
        refreshInterval={refreshInterval}
        timeRange={timeRange}
        articleLimit={articleLimit}
        defaultKeywordPresets={defaultKeywordPresets}
        onSetFontSize={setFontSize}
        onSetTheme={setTheme}
        onSetRefreshInterval={setRefreshInterval}
        onSetTimeRange={setTimeRange}
        onSetArticleLimit={setArticleLimit}
        onSetDefaultKeywordPresets={setDefaultKeywordPresets}
        onClearCache={() => {
          clearSearchCache();
          setToastMessage("Session cache cleared.");
        }}
        onExportJson={exportJson}
        onExportCsv={exportCsv}
      />

      <SearchPanel
        inputRef={inputRef}
        loading={loading}
        onRefresh={() => void executeSearch(true)}
        onSavePreset={() => {
          saveCurrentPreset();
          setToastMessage("Search preset saved.");
        }}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px] xl:items-start">
        <div className="space-y-4">
          {offline ? (
            <div className="glass-panel flex items-center gap-3 rounded-[24px] px-5 py-4 text-sm text-warning">
              <WifiOff className="h-4 w-4" />
              Offline mode active. Showing cached results when available.
            </div>
          ) : null}

          <StatsBar stats={stats} />

          <ErrorStates
            hasKeywords={keywords.length > 0}
            loading={loading}
            articlesCount={articles.length}
            statuses={sourceStatuses}
            offline={offline}
            onRetry={() => void executeSearch(true)}
          />

          {articles.length > 0 ? (
            <ArticleGrid
              articles={articles}
              layoutMode={layoutMode}
              timeRange={timeRange}
              loading={loading}
              limit={articleLimit}
              newArticleIds={newArticleIds}
              onToast={setToastMessage}
            />
          ) : null}

          <SourceStatusGrid statuses={sourceStatuses} />
        </div>

        <div className="xl:sticky xl:top-4">
          <RefreshEngine
            refreshInterval={refreshInterval}
            lastSyncAt={stats.lastSyncAt}
            loading={loading}
            onRefresh={() => void executeSearch(true)}
          />

          {cooldownUntil ? (
            <div className="surface-panel mt-4 rounded-[24px] px-4 py-4 text-sm text-warning">
              Cooldown active until {new Date(cooldownUntil).toLocaleTimeString()}.
            </div>
          ) : null}
        </div>
      </div>

      <AnimatePresence>
        {toastMessage ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm rounded-[24px] border border-line/80 bg-surface px-5 py-4 text-sm text-text shadow-card"
          >
            {toastMessage}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
