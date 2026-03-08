'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchStore } from '@/store/searchStore';
import { Article } from '@/lib/parsers/normalize';
import { fetchGoogleNews, fetchBingNews, fetchReddit, fetchHackerNews } from '@/lib/fetchers';
import { timeFilter, deduplicateArticles, sortArticles } from '@/lib/filters';
import SearchPanel from '@/components/SearchPanel';
import StatsBar from '@/components/StatsBar';
import ArticleCard from '@/components/ArticleCard';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { keywords, operator, timeRange, limit, dedupEnabled, layout } = useSearchStore();
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [dupesRemoved, setDupesRemoved] = useState(0);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchNews = useCallback(async () => {
    if (keywords.length === 0) {
      setArticles([]);
      return;
    }

    setIsRefreshing(true);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      // Build a combined query string for sources that just take one string
      const queryStr = keywords.join(operator === 'AND' ? ' ' : ' OR ');

      const results = await Promise.allSettled([
        fetchGoogleNews(queryStr, keywords, signal),
        fetchBingNews(queryStr, keywords, signal),
        fetchReddit(queryStr, keywords, signal),
        fetchHackerNews(queryStr, keywords, signal)
      ]);

      let allArticles: Article[] = [];
      results.forEach(res => {
        if (res.status === 'fulfilled') {
          allArticles = [...allArticles, ...res.value];
        }
      });

      // 1. Time Filter
      let filtered = timeFilter(allArticles, timeRange);

      // 2. AND Operator strict check (if needed, though rawScore can help, we can enforce it)
      if (operator === 'AND' && keywords.length > 1) {
        filtered = filtered.filter(a => {
            const lowerText = (a.title + ' ' + a.excerpt).toLowerCase();
            return keywords.every(kw => lowerText.includes(kw.toLowerCase()));
        });
      }

      // 3. Deduplicate
      let removed = 0;
      if (dedupEnabled) {
        const deduped = deduplicateArticles(filtered);
        filtered = deduped.unique;
        removed = deduped.removedCount;
      }
      setDupesRemoved(removed);

      // 4. Sort
      filtered = sortArticles(filtered, 'date');

      // 5. Limit
      filtered = filtered.slice(0, limit);

      setArticles(filtered);
      setLastSync(new Date());

    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error("Fetch pipeline error:", err);
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [keywords, operator, timeRange, limit, dedupEnabled]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return (
    <main className="flex flex-col min-h-screen">
      <SearchPanel onRefresh={fetchNews} isRefreshing={isRefreshing} />
      
      <StatsBar 
        articleCount={articles.length} 
        sourceCount={4} 
        lastSync={lastSync} 
        dupesRemoved={dupesRemoved} 
      />

      <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        {keywords.length === 0 ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-surface border border-border flex items-center justify-center mb-4">
              <span className="font-mono text-4xl text-textMuted">⌘K</span>
            </div>
            <h2 className="text-2xl font-headline text-textPrimary">Awaiting Instructions</h2>
            <p className="text-textMuted max-w-md">
              Enter keywords above to start aggregating intelligence from across the open web.
            </p>
          </div>
        ) : articles.length === 0 && !isRefreshing ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
            <h2 className="text-2xl font-headline text-textPrimary">No Signals Found</h2>
            <p className="text-textMuted max-w-md">
              Try adjusting your keywords, expanding the time range, or toggling the operator to OR.
            </p>
          </div>
        ) : (
          <div className={cn(
            "w-full",
            layout === 'grid' && "columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6",
            layout === 'list' && "flex flex-col space-y-4",
            layout === 'focus' && "flex flex-col"
          )}>
            <AnimatePresence>
              {articles.map((article) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={cn(layout === 'grid' && "break-inside-avoid")}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isRefreshing && articles.length > 0 && (
              <div className="w-full flex justify-center py-8">
                <div className="animate-pulse flex space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animation-delay-200"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animation-delay-400"></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
