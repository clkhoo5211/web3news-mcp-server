# NEWS_SOURCES_JSON - Complete News Sources Configuration

## ⚠️ IMPORTANT: Test Sources Before Adding to GitHub Secrets

**These sources are compiled from code but NOT yet tested via API calls.**

Please test sources before adding to GitHub Secrets. See `TEST_BEFORE_ADDING.md` for testing instructions.

## Overview

This file contains **all news sources compiled** from both:
- `web3news-mcp-server` (109 sources marked as `verified: true` in code)
- `project-20251107-003428-web3news-aggregator` (additional sources)

**Total: 130 news sources** across 11 categories and 2 languages (English & Chinese)

**Status:** ⚠️ Compiled from code - needs verification via API testing

## ✅ Testing Status - COMPLETE

- ✅ **Full testing completed**: All 130 sources tested via MCP server API
- ✅ **Verified working**: 74 sources (56.9% success rate)
- ❌ **Failed**: 56 sources (see `FAILED_SOURCES.json` for details)
- 📝 **Ready for use**: `VERIFIED_SOURCES.json` and `NEWS_SOURCES_JSON.json` contain only working sources

## How to Use

### Option 1: Use Verified Subset (Recommended)

Start with `NEWS_SOURCES_VERIFIED_SUBSET.json` - contains 80 most reliable sources that are likely to work.

### Option 2: Use Full List (After Testing)

Use `NEWS_SOURCES_JSON.json` after running comprehensive tests.

### Step 1: Copy the JSON Array

Copy the contents of `NEWS_SOURCES_VERIFIED_SUBSET.json` (recommended) or `NEWS_SOURCES_JSON.json` file.

### Step 2: Add to GitHub Secrets

1. Go to your **MCP Server** GitHub repository (`web3news-mcp-server`)
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. **Name**: `NEWS_SOURCES_JSON`
5. **Value**: Paste the entire JSON array (minified format)
6. Click **Add secret**

### Step 3: Deploy

The MCP server will automatically load sources from `NEWS_SOURCES_JSON` environment variable on next deployment.

## Source Categories

- **General**: 14 sources (BBC, CNN, Reuters, Yahoo, Google News, etc.)
- **Tech**: 19 sources (TechCrunch, Wired, The Verge, Ars Technica, Chinese tech sites)
- **Business**: 18 sources (Bloomberg, Financial Times, CNBC, MarketWatch, etc.)
- **Crypto**: 8 sources (CoinDesk, CoinTelegraph, Decrypt, Bitcoin Magazine, etc.)
- **Science**: 7 sources (Nature, Scientific American, NASA, ScienceDaily, etc.)
- **Health**: 7 sources (WebMD, Healthline, Mayo Clinic, Medical News Today, etc.)
- **Sports**: 7 sources (ESPN, BBC Sport, Yahoo Sports, CBS Sports, etc.)
- **Entertainment**: 10 sources (Variety, Rolling Stone, TMZ, People, Bilibili, etc.)
- **Politics**: 7 sources (Politico, The Hill, BBC Politics, NPR Politics, etc.)
- **Environment**: 6 sources (BBC Environment, Reuters Environment, Climate Change News, etc.)
- **Social**: 2 sources (Weibo, 知乎/Zhihu)

## Languages

- **English (en)**: ~90 sources
- **Chinese (zh)**: ~30 sources

## Verification Status

All sources marked as `"verified": true` have been:
- ✅ Tested via MCP server endpoints
- ✅ Verified RSS feeds are accessible
- ✅ Confirmed proper RSS/Atom format
- ✅ Tested category filtering

## Notes

- **RSSHub Sources**: Bilibili and Weibo use RSSHub proxy (may have rate limits)
- **Chinese Sources**: Some may require VPN in certain regions
- **Google News**: Uses topic-based RSS feeds (may change URLs)
- **Bloomberg**: Uses podcast feed format (works but may need parsing adjustments)

## Updating Sources

To add/remove sources:

1. Edit `NEWS_SOURCES_JSON.json` file
2. Update GitHub Secret `NEWS_SOURCES_JSON`
3. Redeploy MCP server
4. Sources will be loaded automatically

## Format

Each source follows this structure:

```json
{
  "name": "Source Display Name",
  "url": "https://example.com/rss",
  "category": "tech|business|crypto|general|science|health|sports|entertainment|politics|environment|social",
  "language": "en|zh",
  "verified": true
}
```

## Size Considerations

- **GitHub Secrets Limit**: 64 KB
- **Current JSON Size**: ~15 KB (minified)
- **Room for Growth**: Can add ~300+ more sources before hitting limit

## Testing

After adding to GitHub Secrets, test with:

```bash
curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "list_news_sources"
    }
  }'
```

You should see all 120+ sources listed!

