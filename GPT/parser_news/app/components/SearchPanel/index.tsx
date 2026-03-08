"use client";

import { useState, type RefObject } from "react";
import {
  Grid3X3,
  History,
  List,
  LoaderCircle,
  RefreshCw,
  Search,
  Settings2,
  Star,
  X,
} from "lucide-react";

import { BOOLEAN_MODES, SOURCE_CATEGORIES, TIME_RANGES, type LayoutMode } from "@/lib/types";
import { useSearchStore } from "@/store/searchStore";

interface SearchPanelProps {
  inputRef: RefObject<HTMLInputElement | null>;
  loading: boolean;
  onRefresh: () => void;
  onSavePreset: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
}

const SOURCE_LABELS = {
  general: "General",
  tech: "Tech",
  finance: "Finance",
  reddit: "Reddit",
  hackernews: "HackerNews",
} as const;

const LAYOUT_LABELS: Record<LayoutMode, string> = {
  grid: "Grid",
  list: "List",
  focus: "Focus",
};

export function SearchPanel({
  inputRef,
  loading,
  onRefresh,
  onSavePreset,
  onOpenHistory,
  onOpenSettings,
}: SearchPanelProps) {
  const [draftKeyword, setDraftKeyword] = useState("");
  const {
    keywords,
    booleanMode,
    timeRange,
    articleLimit,
    sourceCategories,
    dedupeEnabled,
    language,
    layoutMode,
    sortMode,
    defaultKeywordPresets,
    addKeyword,
    removeKeyword,
    clearKeywords,
    setBooleanMode,
    setTimeRange,
    setArticleLimit,
    toggleSourceCategory,
    setDedupeEnabled,
    setLanguage,
    setLayoutMode,
    setSortMode,
  } = useSearchStore();

  const commitKeyword = () => {
    if (!draftKeyword.trim()) {
      return;
    }

    addKeyword(draftKeyword);
    setDraftKeyword("");
  };

  return (
    <div className="sticky top-0 z-30 space-y-4 pt-4 backdrop-blur-xl">
      <div className="glass-panel rounded-[32px] p-4 md:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-primary">
                PulseReader
              </p>
              <h1 className="mt-2 font-headline text-3xl text-text md:text-5xl">
                Personal intelligence terminal
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                Search open-web news feeds without a backend. Keywords define the signal.
                The pipeline handles the noise.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenHistory}
                className="inline-flex h-12 items-center gap-2 rounded-full border bg-white/5 px-4 text-sm"
              >
                <History className="h-4 w-4" />
                History
              </button>
              <button
                type="button"
                onClick={onOpenSettings}
                className="inline-flex h-12 items-center gap-2 rounded-full border bg-white/5 px-4 text-sm"
              >
                <Settings2 className="h-4 w-4" />
                Settings
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border bg-black/10 p-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
              <div className="flex flex-1 flex-wrap items-center gap-2 rounded-[24px] border bg-white/5 px-4 py-3">
                {keywords.map((keyword) => (
                  <span key={keyword} className="chip border-primary/20 bg-primary/10 text-text">
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/10"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  ref={inputRef}
                  value={draftKeyword}
                  onChange={(event) => setDraftKeyword(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === ",") {
                      event.preventDefault();
                      commitKeyword();
                    }

                    if (event.key === "Backspace" && !draftKeyword) {
                      const lastKeyword = keywords[keywords.length - 1];
                      if (lastKeyword) {
                        removeKeyword(lastKeyword);
                      }
                    }
                  }}
                  className="min-w-[180px] flex-1 bg-transparent text-base text-text placeholder:text-muted"
                  placeholder="Type keyword and press Enter"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onRefresh}
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 text-sm font-medium"
                >
                  {loading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Search
                </button>
                <button
                  type="button"
                  onClick={onRefresh}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border bg-white/5"
                  aria-label="Refresh results"
                >
                  <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                </button>
                <button
                  type="button"
                  onClick={onSavePreset}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border bg-white/5"
                  aria-label="Save current search"
                >
                  <Star className="h-4 w-4" />
                </button>
              </div>
            </div>

            {defaultKeywordPresets.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {defaultKeywordPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => addKeyword(preset)}
                    className="chip"
                    data-active={keywords.includes(preset)}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-4 rounded-[28px] border bg-black/10 p-4">
              <div className="flex flex-wrap items-center gap-2">
                {BOOLEAN_MODES.map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setBooleanMode(mode)}
                    className="chip"
                    data-active={booleanMode === mode}
                  >
                    {mode}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={clearKeywords}
                  className="chip ml-auto"
                  data-active={false}
                >
                  Clear
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {TIME_RANGES.map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setTimeRange(range)}
                    className="chip"
                    data-active={timeRange === range}
                  >
                    {range === "1h"
                      ? "Last 1h"
                      : range === "6h"
                        ? "Last 6h"
                        : range === "today"
                          ? "Today"
                          : "Last 7 days"}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {SOURCE_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleSourceCategory(category)}
                    className="chip"
                    data-active={sourceCategories.includes(category)}
                  >
                    {SOURCE_LABELS[category]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-[28px] border bg-black/10 p-4">
              <label className="grid gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                  Article limit
                </span>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={articleLimit}
                  onChange={(event) => setArticleLimit(Number(event.target.value))}
                />
                <span className="text-sm text-text">{articleLimit} articles</span>
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                    Language
                  </span>
                  <select
                    value={language}
                    onChange={(event) =>
                      setLanguage(event.target.value as typeof language)
                    }
                    className="rounded-2xl border bg-white/5 px-4 py-3"
                  >
                    <option value="en">English</option>
                    <option value="all">All</option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                    Sort
                  </span>
                  <select
                    value={sortMode}
                    onChange={(event) =>
                      setSortMode(event.target.value as typeof sortMode)
                    }
                    className="rounded-2xl border bg-white/5 px-4 py-3"
                  >
                    <option value="newest">Newest</option>
                    <option value="relevance">Relevance</option>
                  </select>
                </label>
              </div>

              <div className="flex items-center justify-between rounded-2xl border bg-white/5 px-4 py-3">
                <div>
                  <p className="text-sm text-text">Deduplicate titles</p>
                  <p className="text-xs text-muted">Levenshtein distance threshold 0.2</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDedupeEnabled(!dedupeEnabled)}
                  className={`relative h-7 w-12 rounded-full transition ${
                    dedupeEnabled ? "bg-accent" : "bg-slate-500/40"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      dedupeEnabled ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {(["grid", "list", "focus"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setLayoutMode(mode)}
                    className="chip"
                    data-active={layoutMode === mode}
                  >
                    {mode === "grid" ? <Grid3X3 className="h-3.5 w-3.5" /> : null}
                    {mode === "list" ? <List className="h-3.5 w-3.5" /> : null}
                    {mode === "focus" ? <Search className="h-3.5 w-3.5" /> : null}
                    {LAYOUT_LABELS[mode]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
