import { stripHtml } from "@/lib/utils";
import { normalizeArticle } from "@/lib/parsers/normalize";
import type { Article, BooleanMode, SourceCategory } from "@/lib/types";

interface ParseRssOptions {
  category: SourceCategory;
  queryKeywords: string[];
  booleanMode: BooleanMode;
  sourceLabel: string;
}

function readText(item: Element, selectors: string[]): string {
  for (const selector of selectors) {
    const match = item.querySelector(selector);
    if (match?.textContent?.trim()) {
      return match.textContent.trim();
    }
  }
  return "";
}

function readAttr(item: Element, selector: string, attribute: string): string {
  const match = item.querySelector(selector);
  return match?.getAttribute(attribute)?.trim() ?? "";
}

function firstImage(item: Element): string | null {
  const mediaSelectors = [
    ["media\\:content", "url"],
    ["media\\:thumbnail", "url"],
    ["enclosure", "url"],
  ] as const;

  for (const [selector, attribute] of mediaSelectors) {
    const value = readAttr(item, selector, attribute);
    if (value) {
      return value;
    }
  }

  const description = readText(item, ["description", "content"]);
  const match = description.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ?? null;
}

function readSourceMeta(item: Element, fallbackUrl: string): {
  sourceName?: string;
  sourceDomain?: string;
} {
  const sourceNode = item.querySelector("source");
  const sourceName = sourceNode?.textContent?.trim() ?? undefined;
  const sourceUrl = sourceNode?.getAttribute("url")?.trim() ?? fallbackUrl;

  try {
    const parsed = new URL(sourceUrl);
    return {
      sourceName,
      sourceDomain: parsed.hostname.replace(/^www\./, ""),
    };
  } catch {
    return {
      sourceName,
    };
  }
}

export async function parseRssArticles(
  xml: string,
  options: ParseRssOptions,
): Promise<Article[]> {
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(xml, "text/xml");
  const items = Array.from(documentNode.querySelectorAll("item, entry"));

  const normalized = await Promise.all(
    items.map(async (item) => {
      const title = readText(item, ["title"]);
      const url =
        readText(item, ["link"]) ||
        readAttr(item, "link", "href") ||
        readText(item, ["id"]);
      const excerpt = stripHtml(readText(item, ["description", "content", "summary"]));
      const publishedAt = readText(item, ["pubDate", "published", "updated"]);
      const imageUrl = firstImage(item);
      const sourceMeta = readSourceMeta(item, url);

      return normalizeArticle({
        title,
        excerpt,
        url,
        imageUrl,
        sourceName: sourceMeta.sourceName ?? options.sourceLabel,
        sourceDomain: sourceMeta.sourceDomain,
        category: options.category,
        publishedAt,
        queryKeywords: options.queryKeywords,
        booleanMode: options.booleanMode,
      });
    }),
  );

  return normalized.filter((article): article is Article => Boolean(article));
}
