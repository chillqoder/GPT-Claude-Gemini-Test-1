import { RSSItem } from './rssParser';
import { extractDomain, faviconUrl, stripHtml, truncate, generateId } from '../utils';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  imageUrl: string | null;
  source: {
    name: string;
    domain: string;
    favicon: string;
  };
  publishedAt: Date;
  keywords: string[];
  rawScore: number;
}

export async function normalizeRSSItem(
  item: RSSItem,
  searchKeywords: string[]
): Promise<Article> {
  const domain = extractDomain(item.link);
  const title = stripHtml(item.title).trim();
  const excerpt = truncate(item.description, 100, 300);
  const id = await generateId(item.link);

  // Calculate relevance score
  const titleLower = title.toLowerCase();
  const excerptLower = excerpt.toLowerCase();
  let rawScore = 0;
  const matchedKeywords: string[] = [];
  for (const kw of searchKeywords) {
    const kwLower = kw.toLowerCase();
    const titleMatches = (titleLower.match(new RegExp(kwLower, 'g')) || []).length;
    const excerptMatches = (excerptLower.match(new RegExp(kwLower, 'g')) || []).length;
    if (titleMatches > 0 || excerptMatches > 0) {
      matchedKeywords.push(kw);
    }
    rawScore += titleMatches * 3 + excerptMatches;
  }

  return {
    id,
    title,
    excerpt,
    url: item.link,
    imageUrl: item.imageUrl,
    source: {
      name: item.sourceName || domain,
      domain,
      favicon: faviconUrl(domain),
    },
    publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
    keywords: matchedKeywords,
    rawScore,
  };
}

export async function normalizeItems(
  items: RSSItem[],
  searchKeywords: string[]
): Promise<Article[]> {
  return Promise.all(items.map(item => normalizeRSSItem(item, searchKeywords)));
}
