export const PROXY_CHAIN = [
  (url: string) => url,
  (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
  (url: string) => `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}` // specific for rss
];

export async function fetchWithFallback(url: string, signal?: AbortSignal, isRss = false): Promise<string> {
  let lastError = new Error("No proxies attempted");
  
  for (let i = 0; i < PROXY_CHAIN.length; i++) {
    const proxy = PROXY_CHAIN[i];
    
    // Skip rss2json for non-rss fetches
    if (!isRss && proxy.toString().includes('rss2json')) continue;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const abortSignal = signal || controller.signal;
      
      const res = await fetch(proxy(url), { signal: abortSignal });
      clearTimeout(timeoutId);
      
      if (res.ok) {
        if (proxy.toString().includes('allorigins.win')) {
            const json = await res.json();
            return json.contents;
        }
        if (proxy.toString().includes('rss2json')) {
            return await res.text(); // Returns JSON representation of RSS
        }
        return await res.text();
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') throw err; // Pass through manual aborts
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }
  throw new Error(`All proxies failed for: ${url} - ${lastError.message}`);
}
