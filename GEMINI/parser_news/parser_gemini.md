# Project Brief: PulseReader — Frontend-Only News Intelligence App
**Role:** Senior Frontend Engineer & Product Architect
**Objective:** Build a zero-backend, client-side news aggregation application using Next.js that fetches, parses, and displays real-time news from the open web based on user-defined keywords — with no API keys, no server, no database.
**Core Philosophy:** "Radical Transparency" — the user defines the signal; the app finds the noise and filters it out. A news reader that respects your attention.

---

## 1. CORE ARCHITECTURE DECISION (CRITICAL)

### The No-Backend Constraint
The app must retrieve news articles **entirely from the client side** using publicly available, CORS-friendly endpoints. No Next.js API routes for data fetching. No Express. No Puppeteer. No paid APIs.

**Approved data sources (free, no auth required):**

| Source | Method | Endpoint Pattern |
| :--- | :--- | :--- |
| **RSS Feeds** | XML fetch + DOMParser | Any RSS/Atom feed URL |
| **Google News RSS** | Fetch XML | `https://news.google.com/rss/search?q={keyword}&hl=en` |
| **Bing News RSS** | Fetch XML | `https://www.bing.com/news/search?q={keyword}&format=RSS` |
| **HackerNews API** | JSON fetch | `https://hacker-news.firebaseio.com/v0/` |
| **Reddit JSON** | Fetch `.json` | `https://www.reddit.com/search.json?q={keyword}&sort=new` |
| **CORS Proxy** | Proxy wrapper | `https://api.allorigins.win/get?url={encoded_url}` |
| **RSS2JSON** | Free tier, no key | `https://api.rss2json.com/v1/api.json?rss_url={url}` |

> **CORS Strategy:** For feeds blocked by CORS, route through `allorigins.win` or `corsproxy.io`. Implement fallback chain: direct fetch → allorigins → corsproxy. Never block the UI on a single failed proxy.

---

## 2. DESIGN SYSTEM

### Palette
| Element | Color | Hex |
| :--- | :--- | :--- |
| **Background** | Deep Graphite | `#0F1117` |
| **Surface** | Elevated Card | `#1A1D27` |
| **Primary** | Electric Blue | `#3B82F6` |
| **Accent** | Signal Green | `#22C55E` |
| **Warning** | Amber | `#F59E0B` |
| **Text Primary** | Off-White | `#F1F5F9` |
| **Text Muted** | Slate | `#64748B` |
| **Border** | Subtle Line | `#2D3748` |

### Typography
* **Display:** `Inter` — Clean, dense, information-forward.
* **Headlines:** `Newsreader` or `Georgia` — Editorial weight for article titles.
* **UI/Metadata:** `JetBrains Mono` — Timestamps, source labels, counters. Machine precision.
* **Body Text:** `Inter` at `15px/1.7` — Comfortable long-form reading.

---

## 3. FEATURE SPECIFICATION

### A. SEARCH & FILTER PANEL
* **Keyword Input:** Multi-tag input — user types a word and hits Enter to add it as a pill. Supports up to 8 keywords. Boolean logic toggle: `AND` / `OR`.
* **Time Range Selector:** Segmented control — `Last 1h` / `Last 6h` / `Today` / `Last 7 days`. Default: `Today`.
* **Article Limit:** Slider or number input — `10` to `100` articles. Default: `20`.
* **Source Filters:** Toggleable chips for source categories: `General` / `Tech` / `Finance` / `Reddit` / `HackerNews`. All enabled by default.
* **Deduplication Toggle:** When on, fingerprint article titles (Levenshtein distance < 0.2 = duplicate) and show only the first occurrence.
* **Language Filter:** Dropdown — `English`, `All`. Default: `English`.

### B. ARTICLE CARD
Each result card must display:

```
┌─────────────────────────────────────────────────────┐
│ [THUMBNAIL IMAGE — 16:9, lazy loaded, fallback SVG] │
├─────────────────────────────────────────────────────┤
│ SOURCE LABEL · MONO 10px          TIMESTAMP · RELATIVE│
│                                                      │
│ Article Headline in Newsreader 18px, 2 lines max     │
│                                                      │
│ Body excerpt, 2–3 lines, muted color, Inter 14px...  │
│                                                      │
│ [↗ READ ORIGINAL]                  [🔖] [SHARE ↗]   │
└─────────────────────────────────────────────────────┘
```

* **Image handling:** Extract `<enclosure>` or `<media:content>` from RSS. Fallback: OG image via meta tag scrape through proxy. Final fallback: generated placeholder with source initials.
* **Timestamp:** Show relative time (`2 hours ago`) with ISO tooltip on hover.
* **Source badge:** Colored dot — unique color per domain, deterministic (hash of domain name).
* **Read link:** Opens original article in new tab with `rel="noopener noreferrer"`.

### C. LAYOUT MODES
* **Grid View (default):** 3-column masonry on desktop, 2-column tablet, 1-column mobile.
* **List View:** Full-width rows, image left 120px, text right. Compact. Toggle via icon button top-right.
* **Focus View:** Single-column, large typography, maximum reading comfort.
* Persist layout choice in `localStorage`.

### D. REAL-TIME REFRESH ENGINE
* **Auto-refresh:** Configurable interval — `Off` / `5 min` / `15 min` / `30 min`. Shows countdown ring in top-right.
* **Manual refresh:** Prominent refresh button with spin animation during fetch.
* **Delta indicator:** After refresh, new articles appear with `NEW` badge (Signal Green) that fades after 10 seconds.
* **Stale detection:** Articles older than selected time range are visually dimmed to `opacity: 0.4`.

### E. SEARCH HISTORY & SAVED SEARCHES
* Last 10 searches persisted in `localStorage`.
* "Star" button to pin a search as a saved preset.
* Saved presets shown in a left sidebar drawer.
* One-click to re-run any saved search.

### F. AGGREGATION PIPELINE (Client-side logic)

```
User Input
    ↓
Build query URLs for each source (Google RSS, Bing RSS, Reddit, HN)
    ↓
Parallel fetch via Promise.allSettled() — never block on one failure
    ↓
Parse XML (DOMParser) / JSON for each response
    ↓
Normalize to unified Article schema:
  { id, title, excerpt, url, imageUrl, source, publishedAt, keywords[] }
    ↓
Filter: publishedAt within selected time range
    ↓
Deduplicate: title fingerprinting if toggle enabled
    ↓
Sort: newest first (default) or by relevance score
    ↓
Slice to article limit
    ↓
Render
```

### G. STATISTICS BAR
Below the search panel, a live stats row in `JetBrains Mono`:
```
FOUND: 47 articles  ·  SOURCES: 6  ·  TIMESPAN: 18h  ·  LAST SYNC: 2 min ago  ·  DUPES REMOVED: 12
```

### H. ERROR & EMPTY STATES
* **All sources failed:** Full-panel message with source status grid — each source shown as green/red indicator. Suggest checking keywords or trying broader terms.
* **No results:** Animated empty state, suggest related keywords.
* **Partial failure:** Toast notification — `"3/6 sources unreachable. Results may be incomplete."` Non-blocking.
* **Rate limited:** Detect 429 responses, show cooldown timer before retry.

### I. SETTINGS PANEL (Side drawer)
* Default keyword presets (user-defined)
* Default time range
* Default article limit
* Font size adjustment (3 sizes)
* Dark/Light mode toggle
* Clear all cached data
* Export current results as JSON or CSV

---

## 4. TECHNICAL REQUIREMENTS

### Stack
* **Framework:** Next.js 14+ with App Router. All data-fetching logic in client components only (`'use client'`).
* **Styling:** Tailwind CSS v3.
* **State:** Zustand for global search/filter state.
* **Data Fetching:** Native `fetch` + `Promise.allSettled`. No axios.
* **XML Parsing:** Browser native `DOMParser` — no `xml2js`, no server-side packages.
* **Date handling:** `date-fns` for formatting and range filtering.
* **Virtualization:** `@tanstack/react-virtual` for rendering 100+ cards without jank.
* **Animations:** Framer Motion for card entrance animations and panel transitions.
* **Icons:** Lucide React.

### Performance Constraints
* **First Contentful Paint:** < 1.2s (shell renders instantly; articles load async).
* **No layout shift:** Reserve card dimensions before image load (`aspect-ratio: 16/9`).
* **Debounce:** Keyword input debounced at `300ms`.
* **Cache:** Article results cached in `sessionStorage` keyed by `{query}:{timeRange}:{limit}`. TTL: 5 minutes.
* **Abort Controller:** All fetches wrapped with `AbortController`. Cancel in-flight requests on new search.

### Article Normalization Schema
```typescript
interface Article {
  id: string;              // SHA-256 of URL
  title: string;
  excerpt: string;         // 150–300 chars, HTML stripped
  url: string;             // Original article URL
  imageUrl: string | null; // Resolved thumbnail
  source: {
    name: string;          // Domain name, cleaned
    domain: string;        // e.g. "techcrunch.com"
    favicon: string;       // Google favicon API URL
  };
  publishedAt: Date;       // Parsed from RSS pubDate / ISO string
  keywords: string[];      // Which search keywords matched
  rawScore: number;        // Keyword frequency in title+excerpt
}
```

### CORS Proxy Fallback Chain
```typescript
const PROXY_CHAIN = [
  (url: string) => url,                                              // Direct
  (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

async function fetchWithFallback(url: string): Promise<string> {
  for (const proxy of PROXY_CHAIN) {
    try {
      const res = await fetch(proxy(url), { signal: AbortSignal.timeout(8000) });
      if (res.ok) return await res.text();
    } catch {}
  }
  throw new Error(`All proxies failed for: ${url}`);
}
```

---

## 5. PAGE & ROUTE STRUCTURE

```
app/
├── page.tsx                  # Main search + results view
├── layout.tsx                # Root layout, fonts, global providers
├── globals.css               # Tailwind base + custom utilities
├── components/
│   ├── SearchPanel/          # Keyword input, filters, time range
│   ├── ArticleCard/          # Card with image, title, excerpt, links
│   ├── ArticleGrid/          # Masonry/list/focus layout switcher
│   ├── StatsBar/             # Live aggregation statistics
│   ├── RefreshEngine/        # Auto-refresh timer + manual trigger
│   ├── SettingsDrawer/       # Config panel
│   ├── HistorySidebar/       # Saved searches + history
│   ├── ErrorStates/          # Empty, failed, partial states
│   └── SourceStatusGrid/     # Per-source health indicators
├── lib/
│   ├── fetchers/
│   │   ├── googleNews.ts     # Google News RSS parser
│   │   ├── bingNews.ts       # Bing News RSS parser
│   │   ├── reddit.ts         # Reddit JSON fetcher
│   │   ├── hackernews.ts     # HN Algolia search API
│   │   └── proxy.ts          # Fallback proxy chain
│   ├── parsers/
│   │   ├── rssParser.ts      # DOMParser-based RSS → Article[]
│   │   └── normalize.ts      # Unified Article schema mapper
│   ├── filters/
│   │   ├── timeFilter.ts     # Date range filtering
│   │   ├── dedup.ts          # Title similarity deduplication
│   │   └── sort.ts           # Sort by date / relevance
│   ├── cache.ts              # sessionStorage TTL cache
│   └── utils.ts              # SHA-256, domain extraction, etc.
└── store/
    └── searchStore.ts        # Zustand store for search state
```

---

## 6. UX BEHAVIOR RULES

* The search input is **always visible** — sticky top bar, never hidden.
* Results appear **progressively** — each source renders its cards as it resolves. Don't wait for all sources.
* **No spinners blocking content.** Use skeleton cards (animated gray rectangles) while loading.
* The app works **offline for cached results** — detect offline state, show last cached results with a banner.
* Every search is **shareable** — keywords and filters are encoded in the URL query string (`?q=bitcoin+ethereum&range=today&limit=20`).
* **Keyboard navigation:** `Cmd+K` focuses search, `Escape` clears, `R` triggers manual refresh.

---

## 7. EXECUTION DIRECTIVES

> **Do not build a news app. Build a personal intelligence terminal.** The user is a researcher, a trader, a journalist, or a curious human — they need signal, not noise. Every design decision must serve the goal of getting to the most relevant article, from the most credible source, as fast as possible.

> **The no-backend constraint is not a limitation. It is the feature.** This app runs entirely in the browser. It can be deployed as a static site. It requires no server costs, no API keys to manage, no rate limits to negotiate. Own that.

> **Progressive enhancement over perfection.** If one source fails, others carry the load. If the image doesn't load, the card still communicates. If the proxy is down, a clear status message explains why. Resilience is a design principle, not an afterthought.