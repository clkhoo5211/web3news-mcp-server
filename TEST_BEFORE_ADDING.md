# News Sources Verification Guide

## ⚠️ Important: Test Before Adding to GitHub Secrets

Before adding `NEWS_SOURCES_JSON` to GitHub Secrets, you should **verify that all sources actually work**.

## Quick Test (Sample Sources)

Test a few sources first to make sure the MCP server is working:

```bash
# Test 1: Google News
curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "get_rss_feed",
      "arguments": {
        "feed_url": "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en"
      }
    }
  }'

# Test 2: TechCrunch
curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "get_rss_feed",
      "arguments": {
        "feed_url": "http://feeds.feedburner.com/TechCrunch/"
      }
    }
  }'

# Test 3: BBC News
curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "get_rss_feed",
      "arguments": {
        "feed_url": "https://feeds.bbci.co.uk/news/rss.xml"
      }
    }
  }'
```

## Comprehensive Test (All Sources)

Run the verification script to test all sources:

```bash
cd projects/web3news-mcp-server
./verify_all_sources.sh
```

This will:
1. Test each RSS feed via MCP server
2. Create `VERIFIED_SOURCES.json` with only working sources
3. Create `FAILED_SOURCES.txt` with failed sources and reasons
4. Show summary statistics

**Note:** This may take 10-20 minutes for 130 sources (with delays to avoid rate limiting).

## Manual Testing (Recommended Approach)

Since testing all 130 sources can take time, here's a better approach:

### Step 1: Test by Category

Test one source from each category to verify the system works:

```bash
# General
curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_rss_feed","arguments":{"feed_url":"https://feeds.bbci.co.uk/news/rss.xml"}}}'

# Tech
curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_rss_feed","arguments":{"feed_url":"http://feeds.feedburner.com/TechCrunch/"}}}'

# Business
curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_rss_feed","arguments":{"feed_url":"https://feeds.bloomberg.com/markets/news.rss"}}}'

# Crypto
curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"get_rss_feed","arguments":{"feed_url":"https://www.coindesk.com/arc/outboundfeeds/rss/"}}}'
```

### Step 2: Use Category-Based Testing

Test categories instead of individual sources (faster):

```bash
# Test tech category (tests all tech sources at once)
curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_news_by_category","arguments":{"category":"tech","max_items_per_source":2}}}'
```

### Step 3: Add Sources Gradually

Instead of adding all 130 sources at once:

1. **Start with verified sources** from `newsSources.ts` (already marked as verified)
2. **Add sources incrementally** - add 10-20 at a time
3. **Monitor MCP server logs** for failures
4. **Remove failed sources** from the JSON

## Current Status

**Sources in NEWS_SOURCES_JSON.json:**
- ✅ Compiled from existing `newsSources.ts` (109 sources marked as `verified: true`)
- ✅ Added unique sources from React app
- ⚠️ **NOT YET TESTED** - These are compiled from code, not verified via actual API calls

## Recommended Workflow

1. **Start Small**: Add 20-30 most important sources first
2. **Test**: Use category-based testing to verify
3. **Monitor**: Check MCP server logs after deployment
4. **Expand**: Add more sources gradually
5. **Maintain**: Remove sources that consistently fail

## Testing Individual Sources

To test a specific source URL:

```bash
SOURCE_URL="https://example.com/rss"

curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d "{
    \"jsonrpc\": \"2.0\",
    \"id\": 1,
    \"method\": \"tools/call\",
    \"params\": {
      \"name\": \"get_rss_feed\",
      \"arguments\": {
        \"feed_url\": \"$SOURCE_URL\"
      }
    }
  }" | jq '.result.content[0].text' | head -50
```

## Expected Results

✅ **Success**: Response contains `"Entry"` or article titles  
❌ **Failure**: Response contains error message or empty content

## Next Steps

1. ✅ Review `NEWS_SOURCES_JSON.json` - sources compiled from code
2. ⏳ **Test sample sources** - verify MCP server works
3. ⏳ **Add to GitHub Secrets** - after verification
4. ⏳ **Deploy and monitor** - check logs for failures
5. ⏳ **Update JSON** - remove failed sources

## Notes

- Some sources may fail due to CORS, rate limiting, or URL changes
- RSSHub sources (Bilibili, Weibo) may have rate limits
- Google News URLs may change over time
- Chinese sources may require VPN in some regions
- Test in production environment (Vercel) for accurate results

