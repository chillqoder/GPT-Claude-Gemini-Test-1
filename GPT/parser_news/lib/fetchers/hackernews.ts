import { fetchJsonWithFallback } from "@/lib/fetchers/proxy";
import { normalizeArticle } from "@/lib/parsers/normalize";
import { buildQueryString, trimExcerpt } from "@/lib/utils";
import type { Article, BooleanMode } from "@/lib/types";

interface HackerNewsResponse {
  hits: Array<{
    objectID: string;
    title: string | null;
    story_title: string | null;
    url: string | null;
    story_url: string | null;
    created_at: string;
    author: string;
    story_text?: string | null;
    comment_text?: string | null;
  }>;
}

export async function fetchHackerNewsArticles(options: {
  keywords: string[];
  booleanMode: BooleanMode;
  signal?: AbortSignal;
}): Promise<Article[]> {
  const query = buildQueryString(options.keywords, options.booleanMode);
  const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(
    query,
  )}&tags=story&hitsPerPage=25`;
  const payload = await fetchJsonWithFallback<HackerNewsResponse>(url, options.signal);

  const normalized = await Promise.all(
    payload.hits.map((hit) =>
      normalizeArticle({
        title: hit.story_title || hit.title || "",
        excerpt: trimExcerpt(hit.story_text || hit.comment_text || `by ${hit.author}`, 180),
        url: hit.story_url || hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
        sourceName: "Hacker News",
        sourceDomain: "news.ycombinator.com",
        imageUrl: null,
        category: "hackernews",
        publishedAt: hit.created_at,
        queryKeywords: options.keywords,
        booleanMode: options.booleanMode,
      }),
    ),
  );

  return normalized.filter((article): article is Article => Boolean(article));
}
