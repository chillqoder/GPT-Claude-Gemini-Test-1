import { fetchWithFallback } from './proxy';
import { parseRssToArticles } from '../parsers/rssParser';
import { Article } from '../parsers/normalize';

export async function fetchGoogleNews(keyword: string, keywords: string[], signal?: AbortSignal): Promise<Article[]> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}&hl=en-US&gl=US&ceid=US:en`;
  try {
    const xml = await fetchWithFallback(url, signal, true);
    return await parseRssToArticles(xml, 'General', keywords);
  } catch (error) {
    console.error('Google News fetch failed:', error);
    return [];
  }
}

export async function fetchBingNews(keyword: string, keywords: string[], signal?: AbortSignal): Promise<Article[]> {
  const url = `https://www.bing.com/news/search?q=${encodeURIComponent(keyword)}&format=RSS`;
  try {
    const xml = await fetchWithFallback(url, signal, true);
    return await parseRssToArticles(xml, 'General', keywords);
  } catch (error) {
    console.error('Bing News fetch failed:', error);
    return [];
  }
}

export async function fetchReddit(keyword: string, keywords: string[], signal?: AbortSignal): Promise<Article[]> {
  const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&sort=new`;
  try {
    const jsonStr = await fetchWithFallback(url, signal);
    const json = JSON.parse(jsonStr);
    const articles: Article[] = [];
    
    for (const child of json.data?.children || []) {
      const data = child.data;
      if (!data) continue;
      
      const { hashString } = await import('../utils');
      const id = await hashString(data.url);
      
      let rawScore = 0;
      keywords.forEach(kw => {
          if (data.title.toLowerCase().includes(kw.toLowerCase())) rawScore += 2;
      });

      articles.push({
        id,
        title: data.title,
        excerpt: (data.selftext || '').slice(0, 300),
        url: `https://reddit.com${data.permalink}`,
        imageUrl: data.thumbnail && data.thumbnail.startsWith('http') ? data.thumbnail : null,
        source: {
          name: 'Reddit',
          domain: 'reddit.com',
          favicon: 'https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png'
        },
        publishedAt: new Date(data.created_utc * 1000),
        keywords: keywords.filter(k => data.title.toLowerCase().includes(k.toLowerCase())),
        rawScore
      });
    }
    return articles;
  } catch (error) {
    console.error('Reddit fetch failed:', error);
    return [];
  }
}

export async function fetchHackerNews(keyword: string, keywords: string[], signal?: AbortSignal): Promise<Article[]> {
  const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(keyword)}&tags=story`;
  try {
    const jsonStr = await fetchWithFallback(url, signal);
    const json = JSON.parse(jsonStr);
    const articles: Article[] = [];
    
    for (const hit of json.hits || []) {
      const { hashString, extractDomain } = await import('../utils');
      const itemUrl = hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`;
      const id = await hashString(itemUrl);
      const domain = extractDomain(itemUrl);
      
      let rawScore = 0;
      keywords.forEach(kw => {
          if ((hit.title||'').toLowerCase().includes(kw.toLowerCase())) rawScore += 2;
      });

      articles.push({
        id,
        title: hit.title || 'No Title',
        excerpt: '',
        url: itemUrl,
        imageUrl: null,
        source: {
          name: 'HackerNews',
          domain: domain || 'news.ycombinator.com',
          favicon: 'https://news.ycombinator.com/y18.svg'
        },
        publishedAt: new Date(hit.created_at),
        keywords: keywords.filter(k => (hit.title||'').toLowerCase().includes(k.toLowerCase())),
        rawScore
      });
    }
    return articles;
  } catch (error) {
    console.error('HN fetch failed:', error);
    return [];
  }
}
