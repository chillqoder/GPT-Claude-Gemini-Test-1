import { RSSItem } from '../parsers/rssParser';

interface RedditPost {
  data: {
    title: string;
    url: string;
    selftext: string;
    permalink: string;
    created_utc: number;
    thumbnail: string;
    subreddit: string;
    preview?: {
      images?: Array<{
        source?: { url: string };
      }>;
    };
  };
}

export async function fetchReddit(
  keywords: string[],
  signal?: AbortSignal
): Promise<RSSItem[]> {
  const query = keywords.map(k => encodeURIComponent(k)).join('+');
  const url = `https://www.reddit.com/search.json?q=${query}&sort=new&limit=25`;
  const res = await fetch(url, {
    signal: signal ?? AbortSignal.timeout(8000),
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Reddit returned ${res.status}`);
  const json = await res.json();
  const posts: RedditPost[] = json?.data?.children || [];

  return posts.map(post => {
    const d = post.data;
    let imageUrl: string | null = null;
    if (d.preview?.images?.[0]?.source?.url) {
      imageUrl = d.preview.images[0].source.url.replace(/&amp;/g, '&');
    } else if (d.thumbnail && d.thumbnail.startsWith('http')) {
      imageUrl = d.thumbnail;
    }

    return {
      title: d.title,
      link: d.url.startsWith('/') ? `https://www.reddit.com${d.url}` : d.url,
      description: d.selftext || '',
      pubDate: new Date(d.created_utc * 1000).toISOString(),
      imageUrl,
      sourceName: `r/${d.subreddit}`,
    };
  });
}
