"use client";
/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";
import { BookmarkPlus, ExternalLink, Share2 } from "lucide-react";

import type { Article, LayoutMode, TimeRange } from "@/lib/types";
import { isStale } from "@/lib/filters/timeFilter";
import { makePlaceholderSvg, relativeTime } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  layoutMode: LayoutMode;
  timeRange: TimeRange;
  isNew: boolean;
  onToast: (message: string) => void;
}

async function shareArticle(article: Article, onToast: (message: string) => void) {
  if (navigator.share) {
    await navigator.share({
      title: article.title,
      text: article.excerpt,
      url: article.url,
    });
    return;
  }

  await navigator.clipboard.writeText(article.url);
  onToast("Article link copied to clipboard.");
}

export function ArticleCard({
  article,
  layoutMode,
  timeRange,
  isNew,
  onToast,
}: ArticleCardProps) {
  const stale = isStale(article.publishedAt, timeRange);
  const placeholder = makePlaceholderSvg(article.source.name, article.source.color);
  const image = article.imageUrl || placeholder;
  const listMode = layoutMode === "list";
  const focusMode = layoutMode === "focus";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: stale ? 0.45 : 1, y: 0 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className={`group surface-panel overflow-hidden rounded-[28px] ${
        listMode
          ? "grid min-h-[160px] grid-cols-[120px_minmax(0,1fr)]"
          : "flex min-h-[360px] flex-col"
      } ${focusMode ? "md:min-h-[420px]" : ""}`}
    >
      <div
        className={`relative overflow-hidden bg-slate-900/50 ${
          listMode ? "h-full" : "aspect-[16/9]"
        }`}
      >
        <img
          src={image}
          alt={article.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        {isNew ? (
          <span className="absolute left-4 top-4 rounded-full border border-accent/30 bg-accent/20 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
            New
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.24em] text-muted">
          <div className="flex min-w-0 items-center gap-2 font-mono">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: article.source.color }}
            />
            <img
              src={article.source.favicon}
              alt=""
              className="h-4 w-4 rounded-full"
              loading="lazy"
            />
            <span className="truncate">{article.source.name}</span>
          </div>
          <time
            title={new Date(article.publishedAt).toISOString()}
            className="shrink-0 font-mono"
          >
            {relativeTime(article.publishedAt)}
          </time>
        </div>

        <h3
          className={`font-headline leading-tight text-text ${
            focusMode ? "text-3xl md:text-[2.2rem]" : "text-xl"
          }`}
        >
          {article.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted">
          {article.excerpt || "No excerpt available for this article."}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {article.keywords.map((keyword) => (
            <span key={keyword} className="chip border-transparent text-[10px] text-muted">
              {keyword}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-text transition hover:bg-primary/20"
          >
            <ExternalLink className="h-4 w-4" />
            Read original
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(article.url);
                onToast("Article URL copied.");
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white/5 transition hover:bg-white/10"
              aria-label="Copy article link"
            >
              <BookmarkPlus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={async () => {
                await shareArticle(article, onToast);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white/5 transition hover:bg-white/10"
              aria-label="Share article"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
