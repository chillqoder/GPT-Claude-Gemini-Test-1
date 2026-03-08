import {
  LAYOUT_MODES,
  SORT_MODES,
  SOURCE_CATEGORIES,
  TIME_RANGES,
  type SearchSnapshot,
} from "@/lib/types";
import { clamp, parseKeywordsParam } from "@/lib/utils";

export function parseSnapshotFromParams(
  params: URLSearchParams,
): Partial<SearchSnapshot> {
  const partial: Partial<SearchSnapshot> = {};
  const keywords = parseKeywordsParam(params.get("q"));
  const logic = params.get("logic");
  const range = params.get("range");
  const limit = params.get("limit");
  const lang = params.get("lang");
  const dedupe = params.get("dedupe");
  const layout = params.get("layout");
  const sort = params.get("sort");
  const sources = params.get("sources");

  if (keywords.length > 0) {
    partial.keywords = keywords;
  }

  if (logic === "and" || logic === "or") {
    partial.booleanMode = logic.toUpperCase() as SearchSnapshot["booleanMode"];
  }

  if (range && TIME_RANGES.includes(range as SearchSnapshot["timeRange"])) {
    partial.timeRange = range as SearchSnapshot["timeRange"];
  }

  if (limit && !Number.isNaN(Number(limit))) {
    partial.articleLimit = clamp(Number(limit), 10, 100);
  }

  if (lang === "en" || lang === "all") {
    partial.language = lang;
  }

  if (dedupe === "true" || dedupe === "false") {
    partial.dedupeEnabled = dedupe === "true";
  }

  if (layout && LAYOUT_MODES.includes(layout as SearchSnapshot["layoutMode"])) {
    partial.layoutMode = layout as SearchSnapshot["layoutMode"];
  }

  if (sort && SORT_MODES.includes(sort as SearchSnapshot["sortMode"])) {
    partial.sortMode = sort as SearchSnapshot["sortMode"];
  }

  if (sources) {
    const selected = sources
      .split(",")
      .map((entry) => entry.trim())
      .filter((entry): entry is SearchSnapshot["sourceCategories"][number] =>
        SOURCE_CATEGORIES.includes(entry as SearchSnapshot["sourceCategories"][number]),
      );

    if (selected.length > 0) {
      partial.sourceCategories = selected;
    }
  }

  return partial;
}
