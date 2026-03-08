export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  imageUrl: string | null;
  sourceName: string;
}

export function parseRSS(xml: string, sourceName: string): RSSItem[] {
  if (typeof window === 'undefined') return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const items: RSSItem[] = [];

  // Check for RSS 2.0
  const rssItems = doc.querySelectorAll('item');
  if (rssItems.length > 0) {
    rssItems.forEach(item => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';

      // Try to get image from enclosure, media:content, or media:thumbnail
      let imageUrl: string | null = null;
      const enclosure = item.querySelector('enclosure[type^="image"]');
      if (enclosure) {
        imageUrl = enclosure.getAttribute('url');
      }
      if (!imageUrl) {
        const mediaContent = item.getElementsByTagName('media:content')[0];
        if (mediaContent) {
          imageUrl = mediaContent.getAttribute('url');
        }
      }
      if (!imageUrl) {
        const mediaThumbnail = item.getElementsByTagName('media:thumbnail')[0];
        if (mediaThumbnail) {
          imageUrl = mediaThumbnail.getAttribute('url');
        }
      }
      // Try to extract image from description HTML
      if (!imageUrl && description) {
        const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/);
        if (imgMatch) imageUrl = imgMatch[1];
      }

      items.push({ title, link, description, pubDate, imageUrl, sourceName });
    });
    return items;
  }

  // Check for Atom
  const entries = doc.querySelectorAll('entry');
  entries.forEach(entry => {
    const title = entry.querySelector('title')?.textContent || '';
    const linkEl = entry.querySelector('link[rel="alternate"]') || entry.querySelector('link');
    const link = linkEl?.getAttribute('href') || '';
    const summary = entry.querySelector('summary')?.textContent || entry.querySelector('content')?.textContent || '';
    const published = entry.querySelector('published')?.textContent || entry.querySelector('updated')?.textContent || '';

    items.push({
      title,
      link,
      description: summary,
      pubDate: published,
      imageUrl: null,
      sourceName,
    });
  });

  return items;
}
