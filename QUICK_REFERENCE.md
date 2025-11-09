# Quick Reference: Project Comparison Summary

## TL;DR

**web3news-mcp-server** needs:
1. ✅ Replace regex parsing → Use `fast-xml-parser`
2. ✅ Add Redis caching → Use Upstash (free tier)
3. ✅ Add rate limiting → Prevent abuse
4. ✅ Add retry logic → Handle transient errors

**web3news-aggregator** can learn from:
1. ✅ Folo's AI features (summarization, translation)
2. ✅ Folo's multi-platform approach
3. ✅ Better RSS parsing (from Folo)

**Folo** strengths to adopt:
1. ✅ AI-powered features
2. ✅ Robust RSS parsing
3. ✅ Multi-platform support
4. ✅ Community features

---

## Key Differences

| Aspect | web3news-mcp-server | web3news-aggregator | Folo |
|--------|---------------------|---------------------|------|
| **Purpose** | MCP server (backend) | Web3 news aggregator | AI RSS reader |
| **Platform** | Vercel serverless | React web app | Multi-platform |
| **RSS Parsing** | ⚠️ Regex (fragile) | ✅ Via MCP + fallback | ✅ Robust parser |
| **Caching** | ❌ None | ✅ IndexedDB | ✅ (Likely Redis) |
| **AI Features** | ❌ None | ❌ None | ✅ Yes |
| **Web3** | ❌ None | ✅ Yes | ❌ None |

---

## Immediate Actions

### For web3news-mcp-server (Priority 1)

```bash
# 1. Install dependencies
npm install fast-xml-parser @upstash/redis pino pino-pretty

# 2. Set up Upstash Redis (free)
# - Go to https://upstash.com
# - Create Redis database
# - Copy REST URL and token

# 3. Add to .env
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

**Code Changes**:
- Replace `parseRSSFeed` function with XML parser
- Add Redis caching layer
- Add rate limiting checks
- Add retry logic with exponential backoff

**Files to Modify**:
- `api/server.ts` (main changes)
- `package.json` (add dependencies)
- `.env.example` (add new vars)

---

## Code Snippets

### Replace Regex Parsing

```typescript
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
});

async function parseRSSFeed(url: string): Promise<{ title: string; items: any[] }> {
  const response = await fetch(url);
  const xmlText = await response.text();
  const feed = parser.parse(xmlText);
  
  const channel = feed.rss?.channel || feed.feed;
  const items = channel?.item || feed.feed?.entry || [];
  
  return {
    title: channel?.title || 'Unknown',
    items: items.slice(0, 50).map(parseItem),
  };
}
```

### Add Redis Caching

```typescript
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function parseRSSFeed(url: string, maxItems: number = 10) {
  const cacheKey = `rss:${Buffer.from(url).toString('base64').slice(0, 32)}:${maxItems}`;
  
  const cached = await redis.get(cacheKey);
  if (cached) return cached;
  
  const feed = await parseRSSFeedInternal(url, maxItems);
  await redis.setex(cacheKey, 300, feed); // 5 min cache
  
  return feed;
}
```

### Add Rate Limiting

```typescript
async function checkRateLimit(url: string): Promise<boolean> {
  const key = `ratelimit:${Buffer.from(url).toString('base64').slice(0, 32)}`;
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, 60); // 60 second window
  }
  
  return current <= 10; // 10 requests per minute
}
```

---

## Performance Improvements

### Before (Current)
- ❌ No caching → Every request hits RSS feed
- ❌ Regex parsing → Fragile, slow
- ❌ No rate limiting → Can exhaust quotas
- ❌ Single retry → Fails on transient errors
- ❌ Hardcoded 10 items → Limited results

### After (Improved)
- ✅ Redis caching → 90%+ cache hit rate
- ✅ XML parser → Robust, fast
- ✅ Rate limiting → Fair usage
- ✅ Retry logic → Handles transient errors
- ✅ Configurable limits → Up to 50 items

---

## Metrics to Track

1. **Cache Hit Rate**: Target >80%
2. **Average Response Time**: Target <500ms (cached), <2s (uncached)
3. **Error Rate**: Target <5%
4. **Rate Limit Hits**: Monitor for abuse
5. **Feed Health**: Track success/failure rates per source

---

## Next Steps

1. **Week 1**: Implement Priority 1 fixes (parsing, caching, rate limiting)
2. **Week 2**: Add performance improvements (parallel fetching, retry logic)
3. **Week 3**: Add features (validation, health monitoring)
4. **Week 4**: Improve DX (logging, tests, documentation)

---

## Resources

- **Folo GitHub**: https://github.com/RSSNext/Folo
- **fast-xml-parser**: https://github.com/NaturalIntelligence/fast-xml-parser
- **Upstash Redis**: https://upstash.com/docs/redis/overall/getstarted
- **MCP Protocol**: https://modelcontextprotocol.io

---

*Last Updated: 2025-01-XX*

