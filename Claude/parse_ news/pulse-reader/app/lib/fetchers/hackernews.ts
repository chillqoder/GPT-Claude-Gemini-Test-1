import { RSSItem } from '../parsers/rssParser';

interface HNHit {
  objectID: string;
  title: string;
  url: string;
  author: string;
  created_at: string;
  story_text?: string;
  _highlightResult?: {
    title?: { value: string };
    story_text?: { value: string };
  };
}

export async function fetchHackerNews(
  keywords: string[],
  signal?: AbortSignal
): Promise<RSSItem[]> {
  const query = keywords.map(k => encodeURIComponent(k)).join('%20');
  const url = `https://hn.algolia.com/api/v1/search_by_date?query=${query}&tags=story&hitsPerPage=25`;
  const res = await fetch(url, {
    signal: signal ?? AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`HN returned ${res.status}`);
  const json = await res.json();
  const hits: HNHit[] = json?.hits || [];

  return hits.map(hit => ({
    title: hit.title || '',
    link: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
    description: hit.story_text || '',
    pubDate: hit.created_at,
    imageUrl: null,
    sourceName: 'Hacker News',
  }));
}
