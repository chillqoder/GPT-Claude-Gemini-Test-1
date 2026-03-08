import { fetchBingNewsArticles } from "@/lib/fetchers/bingNews";
import { fetchGoogleNewsArticles } from "@/lib/fetchers/googleNews";
import { fetchHackerNewsArticles } from "@/lib/fetchers/hackernews";
import { fetchRedditArticles } from "@/lib/fetchers/reddit";
import { deduplicateArticles } from "@/lib/filters/dedup";
import { sortArticles } from "@/lib/filters/sort";
import { isWithinTimeRange, markTimespanHours } from "@/lib/filters/timeFilter";
import { RateLimitError, type Article, type SearchResultPayload, type SearchSnapshot, type SourceStatus } from "@/lib/types";
import { isProbablyEnglish, mergeArticlesById } from "@/lib/utils";

interface SourceDefinition {
  id: string;
  label: string;
  category: SourceStatus["category"];
  fetcher: (signal: AbortSignal) => Promise<Article[]>;
}

interface RunSearchOptions {
  snapshot: SearchSnapshot;
  signal: AbortSignal;
  onProgress?: (payload: SearchResultPayload) => void;
}

function buildSourceDefinitions(snapshot: SearchSnapshot): SourceDefinition[] {
  const sources: SourceDefinition[] = [];

  if (snapshot.sourceCategories.includes("general")) {
    sources.push({
      id: "google-general",
      label: "Google News",
      category: "general",
      fetcher: (signal) =>
        fetchGoogleNewsArticles({
          keywords: snapshot.keywords,
          booleanMode: snapshot.booleanMode,
          timeRange: snapshot.timeRange,
          lens: "general",
          signal,
        }),
    });
    sources.push({
      id: "bing-general",
      label: "Bing News",
      category: "general",
      fetcher: (signal) =>
        fetchBingNewsArticles({
          keywords: snapshot.keywords,
          booleanMode: snapshot.booleanMode,
          timeRange: snapshot.timeRange,
          signal,
        }),
    });
  }

  if (snapshot.sourceCategories.includes("tech")) {
    sources.push({
      id: "google-tech",
      label: "Tech Lens",
      category: "tech",
      fetcher: (signal) =>
        fetchGoogleNewsArticles({
          keywords: snapshot.keywords,
          booleanMode: snapshot.booleanMode,
          timeRange: snapshot.timeRange,
          lens: "tech",
          signal,
        }),
    });
  }

  if (snapshot.sourceCategories.includes("finance")) {
    sources.push({
      id: "google-finance",
      label: "Finance Lens",
      category: "finance",
      fetcher: (signal) =>
        fetchGoogleNewsArticles({
          keywords: snapshot.keywords,
          booleanMode: snapshot.booleanMode,
          timeRange: snapshot.timeRange,
          lens: "finance",
          signal,
        }),
    });
  }

  if (snapshot.sourceCategories.includes("reddit")) {
    sources.push({
      id: "reddit",
      label: "Reddit",
      category: "reddit",
      fetcher: (signal) =>
        fetchRedditArticles({
          keywords: snapshot.keywords,
          booleanMode: snapshot.booleanMode,
          signal,
        }),
    });
  }

  if (snapshot.sourceCategories.includes("hackernews")) {
    sources.push({
      id: "hackernews",
      label: "Hacker News",
      category: "hackernews",
      fetcher: (signal) =>
        fetchHackerNewsArticles({
          keywords: snapshot.keywords,
          booleanMode: snapshot.booleanMode,
          signal,
        }),
    });
  }

  return sources;
}

function createInitialStatuses(definitions: SourceDefinition[]): SourceStatus[] {
  return definitions.map((definition) => ({
    id: definition.id,
    label: definition.label,
    category: definition.category,
    state: "loading",
    articleCount: 0,
  }));
}

function applyPipeline(
  articles: Article[],
  snapshot: SearchSnapshot,
  statuses: SourceStatus[],
): SearchResultPayload {
  const merged = mergeArticlesById(articles);
  const timeFiltered = merged.filter((article) =>
    isWithinTimeRange(article.publishedAt, snapshot.timeRange),
  );
  const languageFiltered =
    snapshot.language === "en"
      ? timeFiltered.filter((article) =>
          isProbablyEnglish(`${article.title} ${article.excerpt}`),
        )
      : timeFiltered;
  const preSorted = sortArticles(languageFiltered, "newest");
  const dedupedResult = snapshot.dedupeEnabled
    ? deduplicateArticles(preSorted)
    : { deduped: preSorted, dupesRemoved: 0 };
  const sorted = sortArticles(dedupedResult.deduped, snapshot.sortMode);
  const sliced = sorted.slice(0, snapshot.articleLimit);
  const successfulStatuses = statuses.filter((status) => status.state === "success");
  const partialFailure =
    statuses.some((status) => status.state === "error" || status.state === "rate_limited") &&
    successfulStatuses.length > 0;

  return {
    articles: sliced,
    statuses,
    stats: {
      found: sliced.length,
      sources: successfulStatuses.filter((status) => status.articleCount > 0).length,
      timespanHours: markTimespanHours(sliced),
      lastSyncAt: new Date().toISOString(),
      dupesRemoved: dedupedResult.dupesRemoved,
    },
    fromCache: false,
    partialFailure,
  };
}

export async function runSearch({
  snapshot,
  signal,
  onProgress,
}: RunSearchOptions): Promise<SearchResultPayload> {
  const definitions = buildSourceDefinitions(snapshot);
  let statuses = createInitialStatuses(definitions);
  let collectedArticles: Article[] = [];

  const publishProgress = () => {
    onProgress?.(applyPipeline(collectedArticles, snapshot, statuses));
  };

  publishProgress();

  const tasks = definitions.map(async (definition) => {
    try {
      const articles = await definition.fetcher(signal);
      collectedArticles = [...collectedArticles, ...articles];
      statuses = statuses.map((status) =>
        status.id === definition.id
          ? {
              ...status,
              state: "success",
              articleCount: articles.length,
            }
          : status,
      );
    } catch (error) {
      const rateLimited = error instanceof RateLimitError;
      statuses = statuses.map((status) =>
        status.id === definition.id
          ? {
              ...status,
              state: rateLimited ? "rate_limited" : "error",
              message: error instanceof Error ? error.message : "Unknown fetch error",
            }
          : status,
      );
    }

    publishProgress();
  });

  await Promise.allSettled(tasks);

  return applyPipeline(collectedArticles, snapshot, statuses);
}
