import { fetchWithFallback } from './proxy';
import { parseRSS, RSSItem } from '../parsers/rssParser';

export async function fetchBingNews(
  keywords: string[],
  signal?: AbortSignal
): Promise<RSSItem[]> {
  const query = keywords.map(k => encodeURIComponent(k)).join('+');
  const url = `https://www.bing.com/news/search?q=${query}&format=RSS`;
  const xml = await fetchWithFallback(url, signal);
  return parseRSS(xml, 'Bing News');
}
