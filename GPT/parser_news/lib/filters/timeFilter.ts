import {
  differenceInHours,
  isAfter,
  startOfDay,
  subDays,
  subHours,
} from "date-fns";

import type { Article, TimeRange } from "@/lib/types";

export function getRangeStart(timeRange: TimeRange, now = new Date()): Date {
  switch (timeRange) {
    case "1h":
      return subHours(now, 1);
    case "6h":
      return subHours(now, 6);
    case "today":
      return startOfDay(now);
    case "7d":
      return subDays(now, 7);
    default:
      return subDays(now, 1);
  }
}

export function isWithinTimeRange(
  isoDate: string,
  timeRange: TimeRange,
  now = new Date(),
): boolean {
  return isAfter(new Date(isoDate), getRangeStart(timeRange, now));
}

export function markTimespanHours(articles: Article[]): number {
  if (articles.length < 2) {
    return articles.length === 1 ? 1 : 0;
  }

  const sorted = [...articles].sort(
    (left, right) =>
      new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
  );

  return Math.max(
    1,
    differenceInHours(
      new Date(sorted[0].publishedAt),
      new Date(sorted[sorted.length - 1].publishedAt),
    ),
  );
}

export function isStale(
  isoDate: string,
  timeRange: TimeRange,
  now = new Date(),
): boolean {
  return !isWithinTimeRange(isoDate, timeRange, now);
}
