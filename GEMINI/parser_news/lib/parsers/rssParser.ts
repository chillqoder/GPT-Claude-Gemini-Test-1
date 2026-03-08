import { Article } from './normalize';
import { extractDomain, hashString } from '../utils';

export async function parseRssToArticles(
  xmlText: string, 
  sourceCategory: string,
  keywords: string[]
): Promise<Article[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let items: any[] = [];
  try {
    const json = JSON.parse(xmlText);
    if (json.items) items = json.items;
  } catch {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    const nodes = Array.from(doc.querySelectorAll('item'));
    items = nodes.map(node => {
      const titleNode = node.querySelector('title');
      const descNode = node.querySelector('description');
      const linkNode = node.querySelector('link');
      const pubDateNode = node.querySelector('pubDate');
      const contentNode = node.querySelector('content\\:encoded') || node.querySelector('content');
      
      return {
        title: titleNode?.textContent || '',
        description: descNode?.textContent || '',
        link: linkNode?.textContent || '',
        pubDate: pubDateNode?.textContent || new Date().toISOString(),
        content: contentNode?.textContent || ''
      };
    });
  }

  const articles: Article[] = [];
  for (const item of items) {
    const title = item.title || '';
    const link = item.link || '';
    if (!link || !title) continue;
    
    const tmp = document.createElement("div");
    tmp.innerHTML = item.description || item.content || '';
    const excerpt = tmp.textContent || tmp.innerText || '';

    let imageUrl = null;
    if (item.thumbnail) imageUrl = item.thumbnail;
    if (!imageUrl && item.enclosure && item.enclosure.link) imageUrl = item.enclosure.link;
    if (!imageUrl) {
        const imgMatch = (item.description || item.content || '').match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) imageUrl = imgMatch[1];
    }

    const domain = extractDomain(link);
    let pubDate = new Date(item.pubDate || Date.now());
    if (isNaN(pubDate.getTime())) pubDate = new Date();

    let rawScore = 0;
    const lowerTitle = title.toLowerCase();
    const lowerExcerpt = excerpt.toLowerCase();
    const matchedKeywords: string[] = [];
    
    keywords.forEach(kw => {
        const lowerKw = kw.toLowerCase();
        if (lowerTitle.includes(lowerKw)) {
            rawScore += 2;
            if(!matchedKeywords.includes(kw)) matchedKeywords.push(kw);
        } else if (lowerExcerpt.includes(lowerKw)) {
            rawScore += 1;
            if(!matchedKeywords.includes(kw)) matchedKeywords.push(kw);
        }
    });

    const id = await hashString(link);

    articles.push({
      id,
      title: title.trim(),
      excerpt: excerpt.trim().slice(0, 300) + (excerpt.length > 300 ? '...' : ''),
      url: link,
      imageUrl,
      source: {
        name: domain,
        domain,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
      },
      publishedAt: pubDate,
      keywords: matchedKeywords,
      rawScore
    });
  }

  return articles;
}
