# web3news-mcp-server Improvement Plan

Based on comparison with Folo and web3news-aggregator, here are prioritized improvements.

## Priority 1: Critical Fixes (Do First)

### 1.1 Replace Regex-Based RSS Parsing

**Current Issue**: Regex parsing is fragile and doesn't handle all RSS variants properly.

**Solution**: Use `fast-xml-parser` library.

```typescript
// Install: npm install fast-xml-parser
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  ignoreNameSpace: false,
  parseAttributeValue: true,
  trimValues: true,
  parseTrueNumberOnly: false,
  arrayMode: false,
});

async function parseRSSFeed(url: string): Promise<{ title: string; items: any[] }> {
  const response = await fetch(url);
  const xmlText = await response.text();
  
  const feed = parser.parse(xmlText);
  
  // Handle both RSS 2.0 and Atom formats
  const channel = feed.rss?.channel || feed.feed;
  const title = channel?.title || feed.feed?.title || 'Unknown';
  
  // Handle both <item> (RSS) and <entry> (Atom)
  const items = channel?.item || feed.feed?.entry || [];
  
  return {
    title: typeof title === 'string' ? title : title?.['#text'] || 'Unknown',
    items: items.slice(0, 50).map((item: any) => ({
      title: item.title?.['#text'] || item.title || 'No title',
      link: item.link?.['#text'] || item.link?.['@_href'] || item.link || '#',
      pubDate: item.pubDate?.['#text'] || item.pubDate || item.published?.['#text'] || item.published || 'Unknown date',
      description: item.description?.['#text'] || item.description || item.summary?.['#text'] || item.summary || '',
      content: item['content:encoded']?.['#text'] || item.content?.['#text'] || item.content || '',
    })),
  };
}
```

**Benefits**:
- ✅ Handles all RSS variants (RSS 2.0, Atom, RDF)
- ✅ Proper CDATA handling
- ✅ Namespace support
- ✅ More reliable

**Files to Modify**:
- `api/server.ts` - Replace `parseRSSFeed` function

---

### 1.2 Add Redis Caching

**Current Issue**: No caching means every request hits RSS feeds directly, causing rate limits.

**Solution**: Use Upstash Redis (free tier available).

```typescript
// Install: npm install @upstash/redis
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Cache key format: rss:{url_hash}:{max_items}
function getCacheKey(url: string, maxItems: number): string {
  const urlHash = Buffer.from(url).toString('base64').slice(0, 32);
  return `rss:${urlHash}:${maxItems}`;
}

async function parseRSSFeed(url: string, maxItems: number = 10): Promise<{ title: string; items: any[] }> {
  const cacheKey = getCacheKey(url, maxItems);
  
  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log(`[Cache HIT] ${url}`);
    return cached as { title: string; items: any[] };
  }
  
  // Fetch fresh data
  console.log(`[Cache MISS] ${url}`);
  const feed = await parseRSSFeedInternal(url, maxItems);
  
  // Cache for 5 minutes (RSS feeds update frequently)
  await redis.setex(cacheKey, 300, feed); // 300 seconds = 5 minutes
  
  return feed;
}
```

**Environment Variables**:
```bash
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

**Benefits**:
- ✅ Reduces RSS feed requests by 90%+
- ✅ Faster response times
- ✅ Prevents rate limiting
- ✅ Free tier: 10k requests/day

**Files to Modify**:
- `api/server.ts` - Add caching layer
- `package.json` - Add `@upstash/redis` dependency
- `.env.example` - Add Redis variables

---

### 1.3 Implement Rate Limiting

**Current Issue**: No rate limiting means one client can exhaust RSS feed quotas.

**Solution**: Per-source rate limiting with Redis.

```typescript
async function checkRateLimit(sourceUrl: string): Promise<boolean> {
  const key = `ratelimit:${Buffer.from(sourceUrl).toString('base64').slice(0, 32)}`;
  const current = await redis.incr(key);
  
  if (current === 1) {
    // First request, set expiration
    await redis.expire(key, 60); // 60 second window
  }
  
  const limit = 10; // 10 requests per minute per source
  return current <= limit;
}

async function parseRSSFeed(url: string, maxItems: number = 10): Promise<{ title: string; items: any[] }> {
  // Check rate limit
  const allowed = await checkRateLimit(url);
  if (!allowed) {
    throw new Error('Rate limit exceeded. Please try again in a minute.');
  }
  
  // ... rest of parsing logic
}
```

**Benefits**:
- ✅ Prevents abuse
- ✅ Protects RSS feed providers
- ✅ Fair usage distribution

**Files to Modify**:
- `api/server.ts` - Add rate limiting checks

---

## Priority 2: Performance Improvements

### 2.1 Increase Item Limit

**Current Issue**: Hardcoded to 10 items per feed.

**Solution**: Make it configurable per request.

```typescript
// In get_rss_feed tool
const maxItems = args?.max_items || 10; // Default 10, but allow up to 50

// In get_news_by_category tool
const maxItemsPerSource = args?.max_items_per_source || 5; // Allow up to 20
```

**Files to Modify**:
- `api/server.ts` - Update tool handlers

---

### 2.2 Add Retry Logic with Exponential Backoff

**Current Issue**: Single fetch attempt, fails on transient errors.

**Solution**: Retry with exponential backoff.

```typescript
async function fetchWithRetry(
  url: string,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<Response> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Web3News-MCP-Server/1.0',
        },
        signal: AbortSignal.timeout(15000), // 15 second timeout
      });
      
      if (response.ok) {
        return response;
      }
      
      // Don't retry on 4xx errors (client errors)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Retry on 5xx errors (server errors)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error: any) {
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = initialDelay * Math.pow(2, attempt);
      console.log(`[Retry ${attempt + 1}/${maxRetries}] Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Max retries exceeded');
}
```

**Files to Modify**:
- `api/server.ts` - Add retry logic to `parseRSSFeed`

---

### 2.3 Parallel Fetching with Concurrency Limit

**Current Issue**: `get_news_by_category` fetches from 5 sources sequentially.

**Solution**: Parallel fetching with concurrency limit.

```typescript
async function fetchInParallel<T>(
  items: T[],
  fn: (item: T) => Promise<any>,
  concurrency: number = 5
): Promise<PromiseSettledResult<any>[]> {
  const results: PromiseSettledResult<any>[] = [];
  
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map(item => fn(item))
    );
    results.push(...batchResults);
  }
  
  return results;
}

// Usage in get_news_by_category
const sourcesToFetch = sources.slice(0, 10); // Increase to 10 sources
const results = await fetchInParallel(
  sourcesToFetch,
  async (source) => {
    const feed = await parseRSSFeed(source.url, maxItemsPerSource);
    return {
      source: source.name,
      success: true,
      items: feed.items,
    };
  },
  5 // Max 5 concurrent requests
);
```

**Benefits**:
- ✅ Faster category fetching
- ✅ Better resource utilization
- ✅ Prevents overwhelming servers

**Files to Modify**:
- `api/server.ts` - Update `get_news_by_category` handler

---

## Priority 3: Feature Enhancements

### 3.1 Add Feed Validation

**Current Issue**: No validation of RSS feed URLs or formats.

**Solution**: Validate feeds before caching.

```typescript
function validateRSSFeed(feed: { title: string; items: any[] }): boolean {
  if (!feed.title || feed.title === 'Unknown') {
    return false;
  }
  
  if (!Array.isArray(feed.items) || feed.items.length === 0) {
    return false;
  }
  
  // Validate items have required fields
  const validItems = feed.items.filter(item => 
    item.title && item.link && item.link !== '#'
  );
  
  return validItems.length > 0;
}

async function parseRSSFeed(url: string, maxItems: number = 10): Promise<{ title: string; items: any[] }> {
  const feed = await parseRSSFeedInternal(url, maxItems);
  
  if (!validateRSSFeed(feed)) {
    throw new Error('Invalid RSS feed format');
  }
  
  return feed;
}
```

**Files to Modify**:
- `api/server.ts` - Add validation function

---

### 3.2 Add Feed Health Monitoring

**Current Issue**: No tracking of which feeds are working/failing.

**Solution**: Track feed health in Redis.

```typescript
async function recordFeedHealth(url: string, success: boolean): Promise<void> {
  const key = `feedhealth:${Buffer.from(url).toString('base64').slice(0, 32)}`;
  
  if (success) {
    await redis.incr(`${key}:success`);
    await redis.expire(`${key}:success`, 86400); // 24 hours
  } else {
    await redis.incr(`${key}:failures`);
    await redis.expire(`${key}:failures`, 86400);
  }
}

// New tool: get_feed_health
if (name === 'get_feed_health') {
  const sourceName = args?.source_name;
  const source = getSourceByName(sourceName);
  
  if (!source) {
    // Error response
  }
  
  const key = `feedhealth:${Buffer.from(source.url).toString('base64').slice(0, 32)}`;
  const successes = await redis.get(`${key}:success`) || 0;
  const failures = await redis.get(`${key}:failures`) || 0;
  
  const health = {
    source: sourceName,
    url: source.url,
    successRate: successes / (successes + failures) * 100,
    totalRequests: successes + failures,
  };
  
  // Return health data
}
```

**Files to Modify**:
- `api/server.ts` - Add health tracking and new tool

---

### 3.3 Add Feed Discovery

**Current Issue**: Users must know exact source names.

**Solution**: Add search/filter capabilities.

```typescript
// Enhance list_news_sources tool
if (name === 'list_news_sources') {
  const category = args?.category;
  const language = args?.language;
  const search = args?.search; // New: search by name
  
  let sources = NEWS_SOURCES;
  
  if (category) {
    sources = sources.filter(s => s.category === category);
  }
  
  if (language) {
    sources = sources.filter(s => s.language === language);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    sources = sources.filter(s => 
      s.name.toLowerCase().includes(searchLower) ||
      s.url.toLowerCase().includes(searchLower)
    );
  }
  
  // Return filtered sources
}
```

**Files to Modify**:
- `api/server.ts` - Enhance `list_news_sources` tool

---

## Priority 4: Developer Experience

### 4.1 Add Logging Framework

**Current Issue**: Basic console.log statements.

**Solution**: Use structured logging.

```typescript
// Install: npm install pino
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

// Usage
logger.info({ url, sourceName }, 'Fetching RSS feed');
logger.error({ error, url }, 'Failed to fetch RSS feed');
```

**Files to Modify**:
- `api/server.ts` - Replace console.log with logger
- `package.json` - Add `pino` and `pino-pretty`

---

### 4.2 Add Error Types

**Current Issue**: Generic error messages.

**Solution**: Create specific error types.

```typescript
class RSSFeedError extends Error {
  constructor(
    message: string,
    public readonly url: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'RSSFeedError';
  }
}

class RateLimitError extends Error {
  constructor(public readonly sourceUrl: string) {
    super('Rate limit exceeded');
    this.name = 'RateLimitError';
  }
}

class InvalidFeedError extends Error {
  constructor(public readonly url: string) {
    super('Invalid RSS feed format');
    this.name = 'InvalidFeedError';
  }
}
```

**Files to Modify**:
- `api/server.ts` - Add error classes and use them

---

### 4.3 Add Tests

**Current Issue**: No tests.

**Solution**: Add unit and integration tests.

```typescript
// tests/parseRSSFeed.test.ts
import { describe, it, expect } from 'vitest';
import { parseRSSFeed } from '../api/server';

describe('parseRSSFeed', () => {
  it('should parse RSS 2.0 feed', async () => {
    const feed = await parseRSSFeed('https://feeds.bbci.co.uk/news/rss.xml');
    expect(feed.title).toBeDefined();
    expect(feed.items.length).toBeGreaterThan(0);
  });
  
  it('should handle invalid URLs', async () => {
    await expect(parseRSSFeed('https://invalid-url.com/rss')).rejects.toThrow();
  });
  
  it('should respect maxItems limit', async () => {
    const feed = await parseRSSFeed('https://feeds.bbci.co.uk/news/rss.xml', 5);
    expect(feed.items.length).toBeLessThanOrEqual(5);
  });
});
```

**Files to Create**:
- `tests/parseRSSFeed.test.ts`
- `tests/mcpProtocol.test.ts`
- `vitest.config.ts`

---

## Implementation Checklist

### Phase 1: Critical Fixes (Week 1)
- [ ] Replace regex parsing with `fast-xml-parser`
- [ ] Add Upstash Redis caching
- [ ] Implement rate limiting
- [ ] Add retry logic

### Phase 2: Performance (Week 2)
- [ ] Increase item limits (configurable)
- [ ] Add parallel fetching with concurrency limit
- [ ] Optimize cache keys
- [ ] Add request timeouts

### Phase 3: Features (Week 3)
- [ ] Add feed validation
- [ ] Add health monitoring
- [ ] Enhance source discovery
- [ ] Add feed health tool

### Phase 4: Developer Experience (Week 4)
- [ ] Add structured logging
- [ ] Add error types
- [ ] Write tests
- [ ] Update documentation

---

## Dependencies to Add

```json
{
  "dependencies": {
    "fast-xml-parser": "^4.3.0",
    "@upstash/redis": "^1.25.0",
    "pino": "^8.17.0",
    "pino-pretty": "^10.3.0"
  },
  "devDependencies": {
    "vitest": "^1.2.0",
    "@types/node": "^20.0.0"
  }
}
```

---

## Environment Variables to Add

```bash
# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Logging
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_REQUESTS_PER_MINUTE=10
RATE_LIMIT_WINDOW_SECONDS=60

# Caching
CACHE_TTL_SECONDS=300
```

---

## Testing Strategy

1. **Unit Tests**: Test parsing logic, validation, error handling
2. **Integration Tests**: Test MCP protocol, Redis caching, rate limiting
3. **Load Tests**: Test concurrent requests, rate limiting, caching effectiveness
4. **E2E Tests**: Test full flow from client request to response

---

## Monitoring & Observability

1. **Metrics to Track**:
   - Request count per tool
   - Cache hit rate
   - Average response time
   - Error rate by source
   - Rate limit hits

2. **Alerts**:
   - High error rate (>10%)
   - Low cache hit rate (<50%)
   - Rate limit violations
   - Feed health degradation

---

## Migration Plan

1. **Deploy new version alongside old** (canary deployment)
2. **Monitor error rates** and performance
3. **Gradually shift traffic** to new version
4. **Keep old version** as fallback for 1 week
5. **Remove old version** once stable

---

*Last Updated: 2025-01-XX*

