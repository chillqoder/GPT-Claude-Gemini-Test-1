import { Article } from '../parsers/normalize';

export type TimeRange = '1h' | '6h' | 'today' | '7d';

export function getTimeRangeStart(range: TimeRange): Date {
  const now = new Date();
  switch (range) {
    case '1h':
      return new Date(now.getTime() - 60 * 60 * 1000);
    case '6h':
      return new Date(now.getTime() - 6 * 60 * 60 * 1000);
    case 'today': {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      return start;
    }
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
}

export function filterByTimeRange(articles: Article[], range: TimeRange): Article[] {
  const start = getTimeRangeStart(range);
  return articles.filter(a => a.publishedAt >= start);
}

export function isStale(article: Article, range: TimeRange): boolean {
  const start = getTimeRangeStart(range);
  return article.publishedAt < start;
}
