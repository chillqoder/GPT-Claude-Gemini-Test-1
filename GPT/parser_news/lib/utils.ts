import { formatDistanceToNowStrict } from "date-fns";

import type {
  Article,
  BooleanMode,
  SearchPreset,
  SearchSnapshot,
  SourceCategory,
} from "@/lib/types";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function stripHtml(input: string): string {
  return input
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function trimExcerpt(input: string, maxLength = 220): string {
  const text = stripHtml(input);
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return "unknown.source";
  }
}

export function formatDomainLabel(domain: string): string {
  return domain
    .replace(/\.[a-z]+$/i, "")
    .split(/[.\-]/)
    .filter(Boolean)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join(" ");
}

export function hashString(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function stringToColor(input: string): string {
  const hue = hashString(input) % 360;
  return `hsl(${hue} 78% 58%)`;
}

export function buildFaviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(domain)}`;
}

export async function sha256(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function scoreContent(
  title: string,
  excerpt: string,
  keywords: string[],
): number {
  const haystack = `${title} ${excerpt}`.toLowerCase();

  return keywords.reduce((score, keyword) => {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matches = haystack.match(new RegExp(escaped, "gi"));
    return score + (matches?.length ?? 0);
  }, 0);
}

export function findMatchedKeywords(
  title: string,
  excerpt: string,
  keywords: string[],
  booleanMode: BooleanMode,
): string[] {
  const haystack = `${title} ${excerpt}`.toLowerCase();
  const matched = keywords.filter((keyword) =>
    haystack.includes(keyword.toLowerCase()),
  );

  if (booleanMode === "AND" && matched.length !== keywords.length) {
    return [];
  }

  return matched;
}

export function isProbablyEnglish(text: string): boolean {
  if (!text) {
    return true;
  }

  const sample = text.slice(0, 180);
  const latin = (sample.match(/[A-Za-z]/g) ?? []).length;
  const totalLetters = (sample.match(/\p{L}/gu) ?? []).length;

  if (totalLetters === 0) {
    return true;
  }

  return latin / totalLetters > 0.65;
}

export function buildQueryString(
  keywords: string[],
  booleanMode: BooleanMode,
): string {
  const cleaned = keywords.map((keyword) => keyword.trim()).filter(Boolean);

  if (cleaned.length === 0) {
    return "";
  }

  return booleanMode === "AND" ? cleaned.join(" ") : cleaned.join(" OR ");
}

export function createPresetLabel(keywords: string[]): string {
  return keywords.join(" + ") || "Untitled search";
}

export function createSearchPreset(snapshot: SearchSnapshot): SearchPreset {
  const label = createPresetLabel(snapshot.keywords);

  return {
    id: `preset-${Date.now()}`,
    label,
    keywords: snapshot.keywords,
    booleanMode: snapshot.booleanMode,
    timeRange: snapshot.timeRange,
    articleLimit: snapshot.articleLimit,
    sourceCategories: snapshot.sourceCategories,
    dedupeEnabled: snapshot.dedupeEnabled,
    language: snapshot.language,
    sortMode: snapshot.sortMode,
  };
}

export function relativeTime(isoDate: string): string {
  return `${formatDistanceToNowStrict(new Date(isoDate), {
    addSuffix: true,
  })}`;
}

export function formatSearchShareParams(snapshot: SearchSnapshot): URLSearchParams {
  const params = new URLSearchParams();

  if (snapshot.keywords.length > 0) {
    params.set("q", snapshot.keywords.join("|"));
  }

  params.set("logic", snapshot.booleanMode.toLowerCase());
  params.set("range", snapshot.timeRange);
  params.set("limit", String(snapshot.articleLimit));
  params.set("lang", snapshot.language);
  params.set("layout", snapshot.layoutMode);
  params.set("dedupe", String(snapshot.dedupeEnabled));
  params.set("sort", snapshot.sortMode);
  params.set("sources", snapshot.sourceCategories.join(","));

  return params;
}

export function parseKeywordsParam(input: string | null): string[] {
  if (!input) {
    return [];
  }

  return input
    .split("|")
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .slice(0, 8);
}

export function downloadBlob(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function articlesToCsv(articles: Article[]): string {
  const rows = [
    ["title", "source", "publishedAt", "url", "keywords", "score", "excerpt"],
    ...articles.map((article) => [
      article.title,
      article.source.domain,
      article.publishedAt,
      article.url,
      article.keywords.join(" | "),
      String(article.rawScore),
      article.excerpt,
    ]),
  ];

  return rows
    .map((row) =>
      row
        .map((value) => `"${value.replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");
}

export function buildSearchCacheKey(snapshot: SearchSnapshot): string {
  return [
    "pulse-reader",
    snapshot.keywords.join(","),
    snapshot.booleanMode,
    snapshot.timeRange,
    snapshot.articleLimit,
    snapshot.sourceCategories.join(","),
    snapshot.dedupeEnabled,
    snapshot.language,
    snapshot.sortMode,
  ].join(":");
}

export function uniqCategories(categories: SourceCategory[]): SourceCategory[] {
  return Array.from(new Set(categories));
}

export function mergeArticlesById(articles: Article[]): Article[] {
  const byId = new Map<string, Article>();
  for (const article of articles) {
    if (!byId.has(article.id)) {
      byId.set(article.id, article);
    }
  }
  return Array.from(byId.values());
}

export function makePlaceholderSvg(label: string, color: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
      <defs>
        <linearGradient id="g" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#0F1117" stop-opacity="0.95" />
        </linearGradient>
      </defs>
      <rect width="1200" height="675" fill="url(#g)" rx="32" />
      <text x="80" y="130" fill="#F1F5F9" font-family="Arial" font-size="32" opacity="0.8">${label}</text>
      <text x="80" y="360" fill="#F1F5F9" font-family="Arial" font-weight="700" font-size="160">${label
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 3)}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
