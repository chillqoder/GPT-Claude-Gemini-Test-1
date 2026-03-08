import { parseRssArticles } from "@/lib/parsers/rssParser";
import { fetchTextWithFallback } from "@/lib/fetchers/proxy";
import { buildQueryString } from "@/lib/utils";
import type { Article, BooleanMode, TimeRange } from "@/lib/types";

type GoogleLens = "general" | "tech" | "finance";

const LENS_SUFFIX: Record<GoogleLens, string> = {
  general: "",
  tech: ' ("technology" OR "software" OR "startup" OR "AI")',
  finance: ' ("stocks" OR "markets" OR "earnings" OR "economy")',
};

function mapTimeRangeToGoogleWhen(timeRange: TimeRange): string {
  switch (timeRange) {
    case "1h":
      return " when:1h";
    case "6h":
      return " when:6h";
    case "today":
      return " when:1d";
    case "7d":
      return " when:7d";
    default:
      return "";
  }
}

export async function fetchGoogleNewsArticles(options: {
  keywords: string[];
  booleanMode: BooleanMode;
  timeRange: TimeRange;
  lens: GoogleLens;
  signal?: AbortSignal;
}): Promise<Article[]> {
  const baseQuery = buildQueryString(options.keywords, options.booleanMode);
  const query = `${baseQuery}${LENS_SUFFIX[options.lens]}${mapTimeRangeToGoogleWhen(
    options.timeRange,
  )}`.trim();
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(
    query,
  )}&hl=en-US&gl=US&ceid=US:en`;

  const xml = await fetchTextWithFallback(url, options.signal);
  const sourceLabel =
    options.lens === "general"
      ? "Google News"
      : options.lens === "tech"
        ? "Tech Lens"
        : "Finance Lens";

  return parseRssArticles(xml, {
    category: options.lens === "general" ? "general" : options.lens,
    queryKeywords: options.keywords,
    booleanMode: options.booleanMode,
    sourceLabel,
  });
}
