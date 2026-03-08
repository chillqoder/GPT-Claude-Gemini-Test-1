export async function generateId(url: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(url);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function extractDomain(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return 'unknown';
  }
}

export function domainColor(domain: string): string {
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = domain.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 55%)`;
}

export function faviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}

export function stripHtml(html: string): string {
  if (typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
  return html.replace(/<[^>]*>/g, '');
}

export function truncate(str: string, min: number, max: number): string {
  const clean = stripHtml(str).trim();
  if (clean.length <= max) return clean;
  const truncated = clean.slice(0, max);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > min ? truncated.slice(0, lastSpace) : truncated) + '...';
}

export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export function normalizedSimilarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 0;
  return 1 - levenshteinDistance(a.toLowerCase(), b.toLowerCase()) / maxLen;
}

export function relativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

export function encodeSearchParams(params: {
  keywords: string[];
  timeRange: string;
  limit: number;
  booleanMode: 'AND' | 'OR';
  sources: string[];
}): string {
  const sp = new URLSearchParams();
  if (params.keywords.length) sp.set('q', params.keywords.join('+'));
  sp.set('range', params.timeRange);
  sp.set('limit', params.limit.toString());
  sp.set('mode', params.booleanMode);
  if (params.sources.length < 5) sp.set('sources', params.sources.join(','));
  return sp.toString();
}

export function decodeSearchParams(search: string): Partial<{
  keywords: string[];
  timeRange: string;
  limit: number;
  booleanMode: 'AND' | 'OR';
  sources: string[];
}> {
  const sp = new URLSearchParams(search);
  const result: Record<string, unknown> = {};
  const q = sp.get('q');
  if (q) result.keywords = q.split('+');
  const range = sp.get('range');
  if (range) result.timeRange = range;
  const limit = sp.get('limit');
  if (limit) result.limit = parseInt(limit, 10);
  const mode = sp.get('mode');
  if (mode === 'AND' || mode === 'OR') result.booleanMode = mode;
  const sources = sp.get('sources');
  if (sources) result.sources = sources.split(',');
  return result;
}
