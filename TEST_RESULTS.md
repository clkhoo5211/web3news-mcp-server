# Source Verification Test Results

## ✅ Sample Test Results (2025-11-09)

Tested via MCP server: `https://web3news-mcp-server.vercel.app/api/server`

### Individual Source Tests

| Source | Status | Notes |
|--------|--------|-------|
| Google News - Top Stories | ✅ **WORKING** | Returns articles successfully |
| TechCrunch | ✅ **WORKING** | Returns articles successfully |
| BBC News | ✅ **WORKING** | Returns articles successfully |
| CoinDesk | ✅ **WORKING** | Returns articles successfully |

### Category-Based Tests

| Category | Status | Notes |
|----------|--------|-------|
| Tech | ⚠️ **PARTIAL** | Some sources work (Yahoo Tech ✅), some fail (Google News Tech ❌) |

## ⚠️ Important Findings

1. **Individual RSS feeds work** - Direct `get_rss_feed` calls succeed
2. **Category fetches may have failures** - Some sources fail in category-based fetching
3. **Not all sources tested** - Only 4 out of 130 sources tested so far

## Recommended Testing Strategy

### Option 1: Test by Category (Faster)

Test categories instead of individual sources:

```bash
# Test all categories
for category in general tech business crypto science health sports entertainment politics environment; do
  echo "Testing $category..."
  curl -s -X POST https://web3news-mcp-server.vercel.app/api/server \
    -H "Content-Type: application/json" \
    -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/call\",\"params\":{\"name\":\"get_news_by_category\",\"arguments\":{\"category\":\"$category\",\"max_items_per_source\":1}}}" \
    --max-time 30 | jq -r '.result.content[0].text' | grep -E "^(##|Sources checked)" | head -5
  echo ""
done
```

### Option 2: Test Critical Sources Only

Test only the most important sources (top 20-30):

```bash
# Critical sources to test
CRITICAL_SOURCES=(
  "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en"
  "https://feeds.bbci.co.uk/news/rss.xml"
  "http://feeds.feedburner.com/TechCrunch/"
  "https://www.coindesk.com/arc/outboundfeeds/rss/"
  "https://feeds.bloomberg.com/markets/news.rss"
  "https://www.theverge.com/rss/index.xml"
  "https://cointelegraph.com/rss"
  "https://feeds.bbci.co.uk/sport/rss.xml"
)

for url in "${CRITICAL_SOURCES[@]}"; do
  echo "Testing: $url"
  curl -s -X POST https://web3news-mcp-server.vercel.app/api/server \
    -H "Content-Type: application/json" \
    -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/call\",\"params\":{\"name\":\"get_rss_feed\",\"arguments\":{\"feed_url\":\"$url\"}}}" \
    --max-time 15 | jq -r '.result.content[0].text // .error.message' | head -3
  echo ""
done
```

### Option 3: Use Existing Verified Sources

The sources in `newsSources.ts` are already marked as `verified: true` in code. These were likely tested during development. You can:

1. **Start with these 109 sources** from `newsSources.ts`
2. **Add React app sources incrementally**
3. **Monitor failures** and remove broken sources

## Current Recommendation

**Start with a subset** instead of all 130 sources:

1. **Use sources from `newsSources.ts`** (109 sources) - already in codebase
2. **Test category-based fetching** for each category
3. **Add to GitHub Secrets** with working sources only
4. **Monitor and expand** gradually

## Next Steps

1. ✅ Sample sources tested - MCP server works
2. ⏳ Test category-based fetching for all categories
3. ⏳ Create verified subset JSON (50-80 most reliable sources)
4. ⏳ Add verified subset to GitHub Secrets
5. ⏳ Expand gradually based on monitoring

## Testing Script

Use `verify_all_sources.sh` to test all sources (takes 10-20 minutes):

```bash
cd projects/web3news-mcp-server
./verify_all_sources.sh
```

This will create:
- `VERIFIED_SOURCES.json` - Only working sources
- `FAILED_SOURCES.txt` - Failed sources with reasons

Then use `VERIFIED_SOURCES.json` for GitHub Secrets instead of the full list.

