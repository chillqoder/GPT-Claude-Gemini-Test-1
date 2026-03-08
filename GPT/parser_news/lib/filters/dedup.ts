import type { Article } from "@/lib/types";

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(left: string, right: string): number {
  const rows = left.length + 1;
  const cols = right.length + 1;
  const matrix = Array.from({ length: rows }, () => Array<number>(cols).fill(0));

  for (let row = 0; row < rows; row += 1) {
    matrix[row][0] = row;
  }

  for (let col = 0; col < cols; col += 1) {
    matrix[0][col] = col;
  }

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      const substitutionCost = left[row - 1] === right[col - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + substitutionCost,
      );
    }
  }

  return matrix[left.length][right.length];
}

export function deduplicateArticles(articles: Article[]): {
  deduped: Article[];
  dupesRemoved: number;
} {
  const kept: Article[] = [];
  let dupesRemoved = 0;

  for (const candidate of articles) {
    const normalizedCandidate = normalizeTitle(candidate.title);
    const isDuplicate = kept.some((existing) => {
      const normalizedExisting = normalizeTitle(existing.title);
      const distance = levenshtein(normalizedExisting, normalizedCandidate);
      const normalizedDistance =
        distance / Math.max(normalizedExisting.length, normalizedCandidate.length, 1);
      return normalizedDistance <= 0.2;
    });

    if (isDuplicate) {
      dupesRemoved += 1;
      continue;
    }

    kept.push(candidate);
  }

  return {
    deduped: kept,
    dupesRemoved,
  };
}
