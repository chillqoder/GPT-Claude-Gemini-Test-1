import { parseRssArticles } from "@/lib/parsers/rssParser";
import { fetchTextWithFallback } from "@/lib/fetchers/proxy";
import { buildQueryString } from "@/lib/utils";
import type { Article, BooleanMode, TimeRange } from "@/lib/types";

function mapTimeRangeToBingSuffix(timeRange: TimeRange): string {
  switch (timeRange) {
    case "1h":
      return ' ("past hour")';
    case "6h":
      return ' ("past 6 hours")';
    case "today":
      return ' ("today")';
    case "7d":
      return ' ("past week")';
    default:
      return "";
  }
}

export async function fetchBingNewsArticles(options: {
  keywords: string[];
  booleanMode: BooleanMode;
  timeRange: TimeRange;
  signal?: AbortSignal;
}): Promise<Article[]> {
  const query = `${buildQueryString(options.keywords, options.booleanMode)}${mapTimeRangeToBingSuffix(
    options.timeRange,
  )}`.trim();
  const url = `https://www.bing.com/news/search?q=${encodeURIComponent(
    query,
  )}&format=RSS&setlang=en-US`;

  const xml = await fetchTextWithFallback(url, options.signal);

  return parseRssArticles(xml, {
    category: "general",
    queryKeywords: options.keywords,
    booleanMode: options.booleanMode,
    sourceLabel: "Bing News",
  });
}
