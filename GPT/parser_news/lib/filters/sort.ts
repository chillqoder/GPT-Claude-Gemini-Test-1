import type { Article, SortMode } from "@/lib/types";

export function sortArticles(articles: Article[], mode: SortMode): Article[] {
  const sorted = [...articles];

  if (mode === "relevance") {
    sorted.sort((left, right) => {
      if (right.rawScore !== left.rawScore) {
        return right.rawScore - left.rawScore;
      }

      return (
        new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
      );
    });
    return sorted;
  }

  sorted.sort(
    (left, right) =>
      new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
  );
  return sorted;
}
