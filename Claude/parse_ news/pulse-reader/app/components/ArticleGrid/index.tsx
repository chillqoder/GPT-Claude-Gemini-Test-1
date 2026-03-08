'use client';

import { useRef } from 'react';
import { LayoutGrid, List, BookOpen } from 'lucide-react';
import { useSearchStore, LayoutMode } from '../../store/searchStore';
import { Article } from '../../lib/parsers/normalize';
import { isStale } from '../../lib/filters/timeFilter';
import ArticleCard from '../ArticleCard';

const LAYOUT_ICONS: { mode: LayoutMode; icon: typeof LayoutGrid; label: string }[] = [
  { mode: 'grid', icon: LayoutGrid, label: 'Grid' },
  { mode: 'list', icon: List, label: 'List' },
  { mode: 'focus', icon: BookOpen, label: 'Focus' },
];

function SkeletonCard({ layout }: { layout: LayoutMode }) {
  if (layout === 'list') {
    return (
      <div className="flex gap-4 bg-[#1A1D27] border border-[#2D3748] rounded-lg overflow-hidden animate-pulse">
        <div className="w-[120px] h-[90px] bg-[#2D3748]" />
        <div className="flex-1 py-3 pr-3 space-y-2">
          <div className="h-3 bg-[#2D3748] rounded w-1/4" />
          <div className="h-4 bg-[#2D3748] rounded w-3/4" />
          <div className="h-3 bg-[#2D3748] rounded w-1/2" />
        </div>
      </div>
    );
  }
  return (
    <div className="bg-[#1A1D27] border border-[#2D3748] rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-video bg-[#2D3748]" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-[#2D3748] rounded w-1/3" />
        <div className="h-4 bg-[#2D3748] rounded w-full" />
        <div className="h-4 bg-[#2D3748] rounded w-2/3" />
        <div className="h-3 bg-[#2D3748] rounded w-1/2" />
      </div>
    </div>
  );
}

interface ArticleGridProps {
  articles: Article[];
  loading: boolean;
}

export default function ArticleGrid({ articles, loading }: ArticleGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { layoutMode, setLayoutMode, timeRange, newArticleIds } = useSearchStore();

  const gridClass =
    layoutMode === 'grid'
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
      : layoutMode === 'list'
      ? 'flex flex-col gap-3'
      : 'flex flex-col gap-6 max-w-2xl mx-auto';

  return (
    <div>
      {/* Layout Switcher */}
      <div className="flex items-center justify-end gap-1 mb-4">
        {LAYOUT_ICONS.map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => setLayoutMode(mode)}
            title={label}
            className={`p-2 rounded-md transition-colors ${
              layoutMode === mode
                ? 'bg-[#3B82F6]/20 text-[#3B82F6]'
                : 'text-[#64748B] hover:text-[#F1F5F9]'
            }`}
          >
            <Icon size={18} />
          </button>
        ))}
      </div>

      {/* Articles */}
      <div ref={containerRef} className={gridClass}>
        {loading && articles.length === 0
          ? Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} layout={layoutMode} />
            ))
          : articles.map((article, i) => (
              <ArticleCard
                key={article.id}
                article={article}
                layout={layoutMode}
                isNew={newArticleIds.has(article.id)}
                isStale={isStale(article, timeRange)}
                index={i}
              />
            ))}
      </div>

      {/* Loading more indicator */}
      {loading && articles.length > 0 && (
        <div className="flex justify-center py-6">
          <div className="flex items-center gap-2 text-[#64748B] text-sm">
            <div className="w-4 h-4 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
            Fetching more sources...
          </div>
        </div>
      )}
    </div>
  );
}
