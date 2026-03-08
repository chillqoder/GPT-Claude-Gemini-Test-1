import { fetchJsonWithFallback } from "@/lib/fetchers/proxy";
import { normalizeArticle } from "@/lib/parsers/normalize";
import { buildQueryString, trimExcerpt } from "@/lib/utils";
import type { Article, BooleanMode } from "@/lib/types";

interface RedditResponse {
  data: {
    children: Array<{
      data: {
        title: string;
        selftext: string;
        permalink: string;
        url: string;
        created_utc: number;
        thumbnail?: string;
        subreddit_name_prefixed: string;
      };
    }>;
  };
}

function normalizeThumbnail(thumbnail?: string): string | null {
  if (!thumbnail || ["self", "default", "image", "nsfw"].includes(thumbnail)) {
    return null;
  }
  return thumbnail;
}

export async function fetchRedditArticles(options: {
  keywords: string[];
  booleanMode: BooleanMode;
  signal?: AbortSignal;
}): Promise<Article[]> {
  const query = buildQueryString(options.keywords, options.booleanMode);
  const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(
    query,
  )}&sort=new&limit=25&type=link`;
  const payload = await fetchJsonWithFallback<RedditResponse>(url, options.signal);

  const normalized = await Promise.all(
    payload.data.children.map(({ data }) =>
      normalizeArticle({
        title: data.title,
        excerpt: trimExcerpt(data.selftext || data.subreddit_name_prefixed, 180),
        url: data.url || `https://www.reddit.com${data.permalink}`,
        imageUrl: normalizeThumbnail(data.thumbnail),
        sourceName: data.subreddit_name_prefixed,
        sourceDomain: "reddit.com",
        category: "reddit",
        publishedAt: new Date(data.created_utc * 1000).toISOString(),
        queryKeywords: options.keywords,
        booleanMode: options.booleanMode,
      }),
    ),
  );

  return normalized.filter((article): article is Article => Boolean(article));
}
