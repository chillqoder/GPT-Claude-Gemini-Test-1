import { Article } from '../parsers/normalize';

export function timeFilter(articles: Article[], timeRange: string): Article[] {
  const now = new Date();
  return articles.filter(a => {
    const diffHours = (now.getTime() - a.publishedAt.getTime()) / (1000 * 60 * 60);
    switch (timeRange) {
      case '1h': return diffHours <= 1;
      case '6h': return diffHours <= 6;
      case 'today': return diffHours <= 24;
      case '7d': return diffHours <= 24 * 7;
      default: return true;
    }
  });
}

function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

export function deduplicateArticles(articles: Article[]): { unique: Article[], removedCount: number } {
  const unique: Article[] = [];
  let removedCount = 0;
  
  for (const article of articles) {
    let isDuplicate = false;
    for (const u of unique) {
      const distance = levenshtein(article.title.toLowerCase(), u.title.toLowerCase());
      const maxLen = Math.max(article.title.length, u.title.length);
      const ratio = distance / maxLen;
      if (ratio < 0.2) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      unique.push(article);
    } else {
      removedCount++;
    }
  }
  
  return { unique, removedCount };
}

export function sortArticles(articles: Article[], by: 'date' | 'relevance' = 'date'): Article[] {
  return [...articles].sort((a, b) => {
    if (by === 'relevance' && a.rawScore !== b.rawScore) {
      return b.rawScore - a.rawScore;
    }
    return b.publishedAt.getTime() - a.publishedAt.getTime();
  });
}
