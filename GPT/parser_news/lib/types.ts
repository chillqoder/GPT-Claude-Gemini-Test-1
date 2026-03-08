export const SOURCE_CATEGORIES = [
  "general",
  "tech",
  "finance",
  "reddit",
  "hackernews",
] as const;

export const TIME_RANGES = ["1h", "6h", "today", "7d"] as const;
export const LAYOUT_MODES = ["grid", "list", "focus"] as const;
export const BOOLEAN_MODES = ["AND", "OR"] as const;
export const LANGUAGE_OPTIONS = ["en", "all"] as const;
export const SORT_MODES = ["newest", "relevance"] as const;

export type SourceCategory = (typeof SOURCE_CATEGORIES)[number];
export type TimeRange = (typeof TIME_RANGES)[number];
export type LayoutMode = (typeof LAYOUT_MODES)[number];
export type BooleanMode = (typeof BOOLEAN_MODES)[number];
export type LanguageOption = (typeof LANGUAGE_OPTIONS)[number];
export type SortMode = (typeof SORT_MODES)[number];
export type ThemeMode = "dark" | "light";
export type FontSize = "sm" | "md" | "lg";

export interface ArticleSource {
  name: string;
  domain: string;
  favicon: string;
  color: string;
  category: SourceCategory;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  imageUrl: string | null;
  source: ArticleSource;
  publishedAt: string;
  keywords: string[];
  rawScore: number;
}

export interface SourceStatus {
  id: string;
  label: string;
  category: SourceCategory;
  state: "idle" | "loading" | "success" | "error" | "rate_limited";
  articleCount: number;
  message?: string;
}

export interface SearchPreset {
  id: string;
  label: string;
  keywords: string[];
  booleanMode: BooleanMode;
  timeRange: TimeRange;
  articleLimit: number;
  sourceCategories: SourceCategory[];
  dedupeEnabled: boolean;
  language: LanguageOption;
  sortMode: SortMode;
}

export interface SearchHistoryEntry {
  id: string;
  label: string;
  lastUsedAt: string;
  preset: SearchPreset;
}

export interface SearchStats {
  found: number;
  sources: number;
  timespanHours: number;
  lastSyncAt: string | null;
  dupesRemoved: number;
}

export interface SearchSnapshot {
  keywords: string[];
  booleanMode: BooleanMode;
  timeRange: TimeRange;
  articleLimit: number;
  sourceCategories: SourceCategory[];
  dedupeEnabled: boolean;
  language: LanguageOption;
  layoutMode: LayoutMode;
  refreshInterval: number;
  fontSize: FontSize;
  theme: ThemeMode;
  sortMode: SortMode;
}

export interface SearchResultPayload {
  articles: Article[];
  statuses: SourceStatus[];
  stats: SearchStats;
  fromCache: boolean;
  partialFailure: boolean;
}

export interface CachePayload {
  expiresAt: number;
  payload: SearchResultPayload;
}

export interface ProxyAttemptError {
  proxyId: string;
  status?: number;
  message: string;
}

export class RateLimitError extends Error {
  retryAfterSeconds: number | null;

  constructor(message: string, retryAfterSeconds: number | null) {
    super(message);
    this.name = "RateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}
