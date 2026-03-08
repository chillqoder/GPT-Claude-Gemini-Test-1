import { Article } from '../parsers/normalize';
import { normalizedSimilarity } from '../utils';

export function deduplicateArticles(articles: Article[], threshold: number = 0.8): Article[] {
  const result: Article[] = [];

  for (const article of articles) {
    const isDupe = result.some(
      existing => normalizedSimilarity(existing.title, article.title) >= threshold
    );
    if (!isDupe) {
      result.push(article);
    }
  }

  return result;
}

export function countDuplicates(articles: Article[], threshold: number = 0.8): number {
  const deduped = deduplicateArticles(articles, threshold);
  return articles.length - deduped.length;
}
