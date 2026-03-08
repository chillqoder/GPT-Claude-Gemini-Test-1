import {
  buildFaviconUrl,
  extractDomain,
  findMatchedKeywords,
  formatDomainLabel,
  scoreContent,
  sha256,
  stringToColor,
  trimExcerpt,
} from "@/lib/utils";
import type { Article, BooleanMode, SourceCategory } from "@/lib/types";

interface NormalizeInput {
  title: string;
  excerpt: string;
  url: string;
  imageUrl?: string | null;
  sourceName?: string;
  sourceDomain?: string;
  category: SourceCategory;
  publishedAt: string | Date | null | undefined;
  queryKeywords: string[];
  booleanMode: BooleanMode;
}

export async function normalizeArticle(input: NormalizeInput): Promise<Article | null> {
  const title = input.title.trim();
  const url = input.url.trim();

  if (!title || !url) {
    return null;
  }

  const matchedKeywords = findMatchedKeywords(
    title,
    input.excerpt,
    input.queryKeywords,
    input.booleanMode,
  );

  if (input.queryKeywords.length > 0 && matchedKeywords.length === 0) {
    return null;
  }

  const domain = (input.sourceDomain || extractDomain(url)).toLowerCase();
  const sourceName = input.sourceName || formatDomainLabel(domain);
  const publishedAt = new Date(input.publishedAt ?? Date.now());

  return {
    id: await sha256(url),
    title,
    excerpt: trimExcerpt(input.excerpt),
    url,
    imageUrl: input.imageUrl ?? null,
    source: {
      name: sourceName,
      domain,
      favicon: buildFaviconUrl(domain),
      color: stringToColor(domain),
      category: input.category,
    },
    publishedAt: publishedAt.toISOString(),
    keywords: matchedKeywords,
    rawScore: scoreContent(title, input.excerpt, input.queryKeywords),
  };
}
