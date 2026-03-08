import type { CachePayload, SearchResultPayload } from "@/lib/types";

const CACHE_PREFIX = "pulse-reader-cache:";
const TTL_MS = 5 * 60 * 1000;

export function readSearchCache(key: string): SearchResultPayload | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(`${CACHE_PREFIX}${key}`);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as CachePayload;
    if (parsed.expiresAt < Date.now()) {
      window.sessionStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }

    return parsed.payload;
  } catch {
    window.sessionStorage.removeItem(`${CACHE_PREFIX}${key}`);
    return null;
  }
}

export function writeSearchCache(key: string, payload: SearchResultPayload): void {
  if (typeof window === "undefined") {
    return;
  }

  const value: CachePayload = {
    expiresAt: Date.now() + TTL_MS,
    payload,
  };

  window.sessionStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(value));
}

export function clearSearchCache(): void {
  if (typeof window === "undefined") {
    return;
  }

  const keys = Object.keys(window.sessionStorage);
  for (const key of keys) {
    if (key.startsWith(CACHE_PREFIX)) {
      window.sessionStorage.removeItem(key);
    }
  }
}
