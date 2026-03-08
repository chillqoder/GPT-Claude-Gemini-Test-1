import { RateLimitError } from "@/lib/types";

type ProxyMode = "direct" | "allorigins" | "corsproxy";

const PROXY_CHAIN: Array<{
  id: ProxyMode;
  buildUrl: (url: string) => string;
}> = [
  {
    id: "direct",
    buildUrl: (url) => url,
  },
  {
    id: "allorigins",
    buildUrl: (url) =>
      `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
  },
  {
    id: "corsproxy",
    buildUrl: (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  },
];

function createTimedSignal(signal?: AbortSignal, timeoutMs = 8000): AbortSignal {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort, { once: true });
  controller.signal.addEventListener(
    "abort",
    () => {
      window.clearTimeout(timeoutId);
      signal?.removeEventListener("abort", abort);
    },
    { once: true },
  );

  return controller.signal;
}

async function parseTextResponse(response: Response, proxyId: ProxyMode): Promise<string> {
  if (proxyId === "allorigins") {
    const payload = (await response.json()) as { contents?: string };
    if (payload.contents) {
      return payload.contents;
    }
    throw new Error("Proxy returned no contents");
  }

  return response.text();
}

async function parseJsonResponse<T>(
  response: Response,
  proxyId: ProxyMode,
): Promise<T> {
  if (proxyId === "allorigins") {
    const payload = (await response.json()) as { contents?: string };
    if (!payload.contents) {
      throw new Error("Proxy returned no contents");
    }
    return JSON.parse(payload.contents) as T;
  }

  return (await response.json()) as T;
}

async function fetchViaChain<T>(
  url: string,
  parser: (response: Response, proxyId: ProxyMode) => Promise<T>,
  signal?: AbortSignal,
): Promise<T> {
  let rateLimitError: RateLimitError | null = null;

  for (const proxy of PROXY_CHAIN) {
    try {
      const response = await fetch(proxy.buildUrl(url), {
        signal: createTimedSignal(signal),
        headers: proxy.id === "direct" ? { Accept: "*/*" } : undefined,
        cache: "no-store",
      });

      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after");
        rateLimitError = new RateLimitError(
          `Rate limited via ${proxy.id}`,
          retryAfter ? Number(retryAfter) : null,
        );
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await parser(response, proxy.id);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }
    }
  }

  if (rateLimitError) {
    throw rateLimitError;
  }

  throw new Error(`All proxy attempts failed for ${url}`);
}

export async function fetchTextWithFallback(
  url: string,
  signal?: AbortSignal,
): Promise<string> {
  return fetchViaChain(url, parseTextResponse, signal);
}

export async function fetchJsonWithFallback<T>(
  url: string,
  signal?: AbortSignal,
): Promise<T> {
  return fetchViaChain<T>(url, parseJsonResponse, signal);
}
