import { fetchWithFallback } from './proxy';
import { parseRSS, RSSItem } from '../parsers/rssParser';

export async function fetchGoogleNews(
  keywords: string[],
  signal?: AbortSignal
): Promise<RSSItem[]> {
  const query = keywords.map(k => encodeURIComponent(k)).join('+');
  const url = `https://news.google.com/rss/search?q=${query}&hl=en&gl=US&ceid=US:en`;
  const xml = await fetchWithFallback(url, signal);
  return parseRSS(xml, 'Google News');
}
