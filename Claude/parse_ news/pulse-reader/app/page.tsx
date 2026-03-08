'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Settings, History, Zap } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useSearchStore, SavedSearch } from './store/searchStore';
import { Article, normalizeItems } from './lib/parsers/normalize';
import { fetchGoogleNews } from './lib/fetchers/googleNews';
import { fetchBingNews } from './lib/fetchers/bingNews';
import { fetchReddit } from './lib/fetchers/reddit';
import { fetchHackerNews } from './lib/fetchers/hackernews';
import { filterByTimeRange } from './lib/filters/timeFilter';
import { deduplicateArticles, countDuplicates } from './lib/filters/dedup';
import { sortArticles } from './lib/filters/sort';
import { getCached, setCache, buildCacheKey } from './lib/cache';
import { encodeSearchParams } from './lib/utils';
import SearchPanel from './components/SearchPanel';
import ArticleGrid from './components/ArticleGrid';
import StatsBar from './components/StatsBar';
import RefreshEngine from './components/RefreshEngine';
import SettingsDrawer from './components/SettingsDrawer';
import HistorySidebar from './components/HistorySidebar';
import { AllFailedState, NoResultsState, PartialFailureToast, OfflineBanner } from './components/ErrorStates';

export default function Home() {
  const store = useSearchStore();
  const abortRef = useRef<AbortController | null>(null);
  const [showPartialToast, setShowPartialToast] = useState(false);
  const [failedInfo, setFailedInfo] = useState({ failed: 0, total: 0 });
  const [isOffline, setIsOffline] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
      }
      if (e.key === 'Escape') {
        document.querySelector<HTMLInputElement>('input[type="text"]')?.blur();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Online/offline detection
  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    setIsOffline(!navigator.onLine);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  // Sync URL with search params
  useEffect(() => {
    if (store.keywords.length > 0) {
      const qs = encodeSearchParams({
        keywords: store.keywords,
        timeRange: store.timeRange,
        limit: store.articleLimit,
        booleanMode: store.booleanMode,
        sources: store.enabledSources,
      });
      window.history.replaceState(null, '', `?${qs}`);
    }
  }, [store.keywords, store.timeRange, store.articleLimit, store.booleanMode, store.enabledSources]);

  const executeSearch = useCallback(async () => {
    const {
      keywords, timeRange, articleLimit, enabledSources,
      deduplicationEnabled, sortMode, booleanMode,
    } = useSearchStore.getState();
    if (keywords.length === 0) return;

    // Check cache
    const cacheKey = buildCacheKey(keywords, timeRange, articleLimit);
    const cached = getCached<Article[]>(cacheKey);
    if (cached) {
      const articles = cached.map(a => ({ ...a, publishedAt: new Date(a.publishedAt) }));
      store.setArticles(articles);
      store.setLastSyncTime(new Date());
      store.setLoading(false);
      setHasSearched(true);
      return;
    }

    // Abort previous
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    store.prepareForNewSearch();
    setHasSearched(true);
    setShowPartialToast(false);

    // Save to history
    store.addToHistory({
      id: cacheKey,
      keywords: [...keywords],
      timeRange,
      limit: articleLimit,
      booleanMode,
      sources: [...enabledSources],
      timestamp: Date.now(),
      pinned: false,
    });

    // Build source fetch list
    type SourceFetch = { name: string; fetch: () => Promise<Article[]> };
    const sources: SourceFetch[] = [];

    if (enabledSources.includes('General')) {
      sources.push({
        name: 'General',
        fetch: async () => {
          store.setSourceStatus('General', 'loading');
          const items = await fetchGoogleNews(keywords, signal);
          return normalizeItems(items, keywords);
        },
      });
    }

    if (enabledSources.includes('Tech')) {
      sources.push({
        name: 'Tech',
        fetch: async () => {
          store.setSourceStatus('Tech', 'loading');
          const items = await fetchBingNews(keywords, signal);
          return normalizeItems(items, keywords);
        },
      });
    }

    if (enabledSources.includes('Reddit')) {
      sources.push({
        name: 'Reddit',
        fetch: async () => {
          store.setSourceStatus('Reddit', 'loading');
          const items = await fetchReddit(keywords, signal);
          return normalizeItems(items, keywords);
        },
      });
    }

    if (enabledSources.includes('HackerNews')) {
      sources.push({
        name: 'HackerNews',
        fetch: async () => {
          store.setSourceStatus('HackerNews', 'loading');
          const items = await fetchHackerNews(keywords, signal);
          return normalizeItems(items, keywords);
        },
      });
    }

    // Progressive rendering: resolve each source independently
    let allArticles: Article[] = [];

    const results = await Promise.allSettled(
      sources.map(async src => {
        try {
          const articles = await src.fetch();
          store.setSourceStatus(src.name, 'success', articles.length);
          allArticles = [...allArticles, ...articles];

          // Progressive render: apply filters and update
          let processed = filterByTimeRange([...allArticles], timeRange);
          if (deduplicationEnabled) {
            processed = deduplicateArticles(processed);
          }
          processed = sortArticles(processed, sortMode);
          store.setArticles(processed.slice(0, articleLimit));

          return articles;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Unknown error';
          store.setSourceStatus(src.name, 'error', 0, msg);
          throw err;
        }
      })
    );

    // Final processing
    const totalRaw = allArticles.length;
    store.setTotalRawCount(totalRaw);

    let finalArticles = filterByTimeRange(allArticles, timeRange);

    if (deduplicationEnabled) {
      const dupes = countDuplicates(finalArticles);
      store.setDupesRemoved(dupes);
      finalArticles = deduplicateArticles(finalArticles);
    }

    finalArticles = sortArticles(finalArticles, sortMode);
    finalArticles = finalArticles.slice(0, articleLimit);

    // Mark new articles
    const prevIds = useSearchStore.getState().previousArticleIds;
    const newIds = new Set(finalArticles.map(a => a.id).filter(id => !prevIds.has(id)));
    store.setArticles(finalArticles);
    store.setLastSyncTime(new Date());
    store.setLoading(false);

    // Update new article indicators
    useSearchStore.setState({ newArticleIds: newIds });

    // Fade NEW badges after 10s
    if (newIds.size > 0) {
      setTimeout(() => useSearchStore.setState({ newArticleIds: new Set() }), 10000);
    }

    // Cache results
    setCache(cacheKey, finalArticles);

    // Check partial failure
    const failedCount = results.filter(r => r.status === 'rejected').length;
    if (failedCount > 0 && failedCount < sources.length) {
      setFailedInfo({ failed: failedCount, total: sources.length });
      setShowPartialToast(true);
      setTimeout(() => setShowPartialToast(false), 6000);
    }
  }, [store]);

  const handleLoadSearch = useCallback((search: SavedSearch) => {
    store.setKeywords(search.keywords);
    store.setTimeRange(search.timeRange);
    store.setArticleLimit(search.limit);
    store.setBooleanMode(search.booleanMode);
    store.setHistoryOpen(false);
    setTimeout(() => executeSearch(), 100);
  }, [store, executeSearch]);

  const allFailed = hasSearched && !store.isLoading &&
    store.sourceStatuses.every(s => s.status === 'error' || s.status === 'idle') &&
    store.sourceStatuses.some(s => s.status === 'error') &&
    store.articles.length === 0;

  const noResults = hasSearched && !store.isLoading &&
    !allFailed && store.articles.length === 0;

  return (
    <div className={`min-h-screen ${store.darkMode ? '' : 'light-mode'}`}>
      {isOffline && <OfflineBanner />}

      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0F1117]/95 backdrop-blur-sm border-b border-[#2D3748]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-[#3B82F6]" />
              <h1 className="text-lg font-semibold text-[#F1F5F9] tracking-tight">PulseReader</h1>
              <span className="text-[10px] font-mono text-[#64748B] bg-[#1A1D27] px-1.5 py-0.5 rounded border border-[#2D3748]">
                v1.0
              </span>
            </div>

            <div className="flex items-center gap-1">
              <RefreshEngine onRefresh={executeSearch} />
              <button
                onClick={() => store.setHistoryOpen(true)}
                className="p-2 text-[#64748B] hover:text-[#F1F5F9] transition-colors"
                title="Search History"
              >
                <History size={18} />
              </button>
              <button
                onClick={() => store.setSettingsOpen(true)}
                className="p-2 text-[#64748B] hover:text-[#F1F5F9] transition-colors"
                title="Settings"
              >
                <Settings size={18} />
              </button>
            </div>
          </div>

          <SearchPanel onSearch={executeSearch} />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Bar */}
        {hasSearched && (
          <div className="mb-4">
            <StatsBar />
          </div>
        )}

        {/* Content */}
        {allFailed ? (
          <AllFailedState />
        ) : noResults ? (
          <NoResultsState />
        ) : hasSearched ? (
          <ArticleGrid articles={store.articles} loading={store.isLoading} />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Zap size={56} className="text-[#3B82F6]/30 mb-6" />
            <h2 className="text-2xl font-semibold text-[#F1F5F9] mb-2">Your Intelligence Terminal</h2>
            <p className="text-sm text-[#64748B] max-w-md">
              Enter keywords above and hit Search. Results stream in from multiple sources in real-time.
            </p>
            <div className="mt-6 flex items-center gap-4 text-[10px] font-mono text-[#64748B]">
              <span className="px-2 py-1 border border-[#2D3748] rounded">Cmd+K to focus</span>
              <span className="px-2 py-1 border border-[#2D3748] rounded">Esc to clear</span>
            </div>
          </div>
        )}
      </main>

      {/* Drawers */}
      <SettingsDrawer />
      <HistorySidebar onLoadSearch={handleLoadSearch} />

      {/* Partial Failure Toast */}
      <AnimatePresence>
        {showPartialToast && (
          <PartialFailureToast failedCount={failedInfo.failed} totalCount={failedInfo.total} />
        )}
      </AnimatePresence>
    </div>
  );
}
