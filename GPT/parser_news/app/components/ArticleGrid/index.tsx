"use client";

import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { ArticleCard } from "@/app/components/ArticleCard";
import type { Article, LayoutMode, TimeRange } from "@/lib/types";

interface ArticleGridProps {
  articles: Article[];
  layoutMode: LayoutMode;
  timeRange: TimeRange;
  loading: boolean;
  limit: number;
  newArticleIds: string[];
  onToast: (message: string) => void;
}

function chunkArticles(articles: Article[], size: number): Article[][] {
  const rows: Article[][] = [];
  for (let index = 0; index < articles.length; index += size) {
    rows.push(articles.slice(index, index + size));
  }
  return rows;
}

function getColumns(width: number, mode: LayoutMode): number {
  if (mode === "focus" || mode === "list") {
    return 1;
  }

  if (width >= 1280) {
    return 3;
  }

  if (width >= 768) {
    return 2;
  }

  return 1;
}

function SkeletonCard({ layoutMode }: { layoutMode: LayoutMode }) {
  return (
    <div
      className={`surface-panel overflow-hidden rounded-[28px] ${
        layoutMode === "list"
          ? "grid min-h-[160px] grid-cols-[120px_minmax(0,1fr)]"
          : "flex min-h-[360px] flex-col"
      }`}
    >
      <div className={`skeleton ${layoutMode === "list" ? "h-full" : "aspect-[16/9]"}`} />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="skeleton h-4 w-32 rounded-full" />
        <div className="skeleton h-8 rounded-2xl" />
        <div className="skeleton h-20 rounded-3xl" />
        <div className="mt-auto flex gap-3">
          <div className="skeleton h-10 w-32 rounded-full" />
          <div className="skeleton h-10 w-10 rounded-full" />
          <div className="skeleton h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ArticleGrid({
  articles,
  layoutMode,
  timeRange,
  loading,
  limit,
  newArticleIds,
  onToast,
}: ArticleGridProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!parentRef.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const nextWidth = entries[0]?.contentRect.width ?? 0;
      setWidth(nextWidth);
    });

    observer.observe(parentRef.current);
    setWidth(parentRef.current.clientWidth);

    return () => observer.disconnect();
  }, []);

  const columns = getColumns(width, layoutMode);
  const rows = chunkArticles(articles, columns);
  const loadingRows = Math.max(3, Math.ceil(Math.min(limit, 12) / columns));
  const count = articles.length === 0 && loading ? loadingRows : rows.length;

  const rowVirtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => {
      if (layoutMode === "list") {
        return 188;
      }
      if (layoutMode === "focus") {
        return 520;
      }
      return 450;
    },
    overscan: 4,
  });

  return (
    <div
      ref={parentRef}
      className="rounded-[32px] border border-line/70 bg-black/10 p-3 md:p-4"
      style={{ height: "min(72vh, calc(100vh - 320px))", overflow: "auto" }}
    >
      <div
        className="relative"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index] ?? [];
          const top = virtualRow.start;

          return (
            <div
              key={virtualRow.key}
              ref={rowVirtualizer.measureElement}
              className={`absolute left-0 top-0 grid w-full gap-4 ${
                columns === 1 ? "grid-cols-1" : columns === 2 ? "grid-cols-2" : "grid-cols-3"
              }`}
              style={{
                transform: `translateY(${top}px)`,
              }}
            >
              {articles.length === 0 && loading
                ? Array.from({ length: columns }).map((_, index) => (
                    <SkeletonCard key={`${virtualRow.index}-${index}`} layoutMode={layoutMode} />
                  ))
                : row.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      layoutMode={layoutMode}
                      timeRange={timeRange}
                      isNew={newArticleIds.includes(article.id)}
                      onToast={onToast}
                    />
                  ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
