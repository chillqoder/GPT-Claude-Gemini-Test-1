import { Article } from '../parsers/normalize';

export type SortMode = 'date' | 'relevance';

export function sortArticles(articles: Article[], mode: SortMode): Article[] {
  const sorted = [...articles];
  switch (mode) {
    case 'date':
      return sorted.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    case 'relevance':
      return sorted.sort((a, b) => b.rawScore - a.rawScore);
  }
}
