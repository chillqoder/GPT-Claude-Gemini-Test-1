const PROXY_CHAIN = [
  (url: string) => url,
  (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

export async function fetchWithFallback(
  url: string,
  signal?: AbortSignal
): Promise<string> {
  for (const proxy of PROXY_CHAIN) {
    try {
      const proxyUrl = proxy(url);
      const res = await fetch(proxyUrl, {
        signal: signal ?? AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;
      const text = await res.text();
      // allorigins wraps response in JSON
      if (proxyUrl.includes('allorigins.win')) {
        try {
          const json = JSON.parse(text);
          return json.contents || text;
        } catch {
          return text;
        }
      }
      return text;
    } catch {
      continue;
    }
  }
  throw new Error(`All proxies failed for: ${url}`);
}
