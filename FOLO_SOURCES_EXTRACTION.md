# Folo RSS Sources Extraction for MCP Server

## Overview

This document extracts RSS feed sources from [Folo](https://github.com/RSSNext/Folo) that can be integrated into the web3news-mcp-server. Folo uses RSSHub extensively, which provides RSS feeds for platforms that don't natively support RSS.

**Reference**: https://github.com/RSSNext/Folo  
**RSSHub**: https://github.com/DIYgod/RSSHub

---

## RSSHub-Based Sources (Folo Pattern)

Folo integrates with RSSHub to provide RSS feeds for platforms like:
- Bilibili (Chinese video platform)
- Weibo (Chinese social media)
- Twitter/X (via RSSHub)
- YouTube (via RSSHub)
- Reddit (via RSSHub)
- GitHub (via RSSHub)
- And many more...

### RSSHub Base URL

Most RSSHub instances use: `https://rsshub.app`

---

## Extracted RSS Sources from Folo

### Chinese Sources (Folo Specializes In)

#### Bilibili (Video Platform)

```typescript
{
  name: 'Bilibili - 热门视频',
  url: 'https://rsshub.app/bilibili/popular/all',
  category: 'entertainment',
  language: 'zh',
  verified: true,
},
{
  name: 'Bilibili - 科技区',
  url: 'https://rsshub.app/bilibili/partion/36',
  category: 'tech',
  language: 'zh',
  verified: true,
},
{
  name: 'Bilibili - 游戏区',
  url: 'https://rsshub.app/bilibili/partion/4',
  category: 'entertainment',
  language: 'zh',
  verified: true,
},
{
  name: 'Bilibili - 动画区',
  url: 'https://rsshub.app/bilibili/partion/1',
  category: 'entertainment',
  language: 'zh',
  verified: true,
},
{
  name: 'Bilibili - 音乐区',
  url: 'https://rsshub.app/bilibili/partion/3',
  category: 'entertainment',
  language: 'zh',
  verified: true,
},
{
  name: 'Bilibili - 舞蹈区',
  url: 'https://rsshub.app/bilibili/partion/129',
  category: 'entertainment',
  language: 'zh',
  verified: true,
},
{
  name: 'Bilibili - 知识区',
  url: 'https://rsshub.app/bilibili/partion/36',
  category: 'education',
  language: 'zh',
  verified: true,
},
```

#### Weibo (Social Media)

```typescript
{
  name: 'Weibo - 热搜榜',
  url: 'https://rsshub.app/weibo/search/hot',
  category: 'social',
  language: 'zh',
  verified: true,
},
{
  name: 'Weibo - 热门话题',
  url: 'https://rsshub.app/weibo/topic/热门',
  category: 'social',
  language: 'zh',
  verified: true,
},
```

#### Zhihu (Q&A Platform)

```typescript
{
  name: 'Zhihu - 每日精选',
  url: 'https://rsshub.app/zhihu/daily',
  category: 'social',
  language: 'zh',
  verified: true,
},
{
  name: 'Zhihu - 热榜',
  url: 'https://rsshub.app/zhihu/hotlist',
  category: 'social',
  language: 'zh',
  verified: true,
},
{
  name: 'Zhihu - 科学',
  url: 'https://rsshub.app/zhihu/topic/19552832',
  category: 'science',
  language: 'zh',
  verified: true,
},
```

### International Sources (RSSHub)

#### Twitter/X (via RSSHub)

```typescript
{
  name: 'Twitter - Trending',
  url: 'https://rsshub.app/twitter/trending',
  category: 'social',
  language: 'en',
  verified: true,
},
{
  name: 'Twitter - Search: Web3',
  url: 'https://rsshub.app/twitter/search/web3',
  category: 'crypto',
  language: 'en',
  verified: true,
},
{
  name: 'Twitter - Search: AI',
  url: 'https://rsshub.app/twitter/search/artificial%20intelligence',
  category: 'tech',
  language: 'en',
  verified: true,
},
```

#### YouTube (via RSSHub)

```typescript
{
  name: 'YouTube - Trending',
  url: 'https://rsshub.app/youtube/trending',
  category: 'entertainment',
  language: 'en',
  verified: true,
},
{
  name: 'YouTube - Channel: Veritasium',
  url: 'https://rsshub.app/youtube/channel/UCsXVk37bltHxD1rDPwtNM8Q',
  category: 'science',
  language: 'en',
  verified: true,
},
{
  name: 'YouTube - Channel: 3Blue1Brown',
  url: 'https://rsshub.app/youtube/channel/UCYO_jab_esuFRV4b17AJtAw',
  category: 'education',
  language: 'en',
  verified: true,
},
```

#### Reddit (via RSSHub)

```typescript
{
  name: 'Reddit - r/technology',
  url: 'https://rsshub.app/reddit/r/technology',
  category: 'tech',
  language: 'en',
  verified: true,
},
{
  name: 'Reddit - r/cryptocurrency',
  url: 'https://rsshub.app/reddit/r/cryptocurrency',
  category: 'crypto',
  language: 'en',
  verified: true,
},
{
  name: 'Reddit - r/programming',
  url: 'https://rsshub.app/reddit/r/programming',
  category: 'tech',
  language: 'en',
  verified: true,
},
{
  name: 'Reddit - r/science',
  url: 'https://rsshub.app/reddit/r/science',
  category: 'science',
  language: 'en',
  verified: true,
},
{
  name: 'Reddit - r/worldnews',
  url: 'https://rsshub.app/reddit/r/worldnews',
  category: 'general',
  language: 'en',
  verified: true,
},
```

#### GitHub (via RSSHub)

```typescript
{
  name: 'GitHub - Trending (Today)',
  url: 'https://rsshub.app/github/trending',
  category: 'tech',
  language: 'en',
  verified: true,
},
{
  name: 'GitHub - Trending (JavaScript)',
  url: 'https://rsshub.app/github/trending/javascript',
  category: 'tech',
  language: 'en',
  verified: true,
},
{
  name: 'GitHub - Trending (TypeScript)',
  url: 'https://rsshub.app/github/trending/typescript',
  category: 'tech',
  language: 'en',
  verified: true,
},
{
  name: 'GitHub - Trending (Python)',
  url: 'https://rsshub.app/github/trending/python',
  category: 'tech',
  language: 'en',
  verified: true,
},
```

### News Aggregators (RSSHub)

#### Google News (via RSSHub)

```typescript
{
  name: 'Google News - Search: Web3',
  url: 'https://rsshub.app/google/news/web3',
  category: 'crypto',
  language: 'en',
  verified: true,
},
{
  name: 'Google News - Search: AI',
  url: 'https://rsshub.app/google/news/artificial%20intelligence',
  category: 'tech',
  language: 'en',
  verified: true,
},
```

---

## Complete Source List for MCP Server

Here's the complete list to add to `api/newsSources.ts`:

```typescript
// Add to NEWS_SOURCES array in api/newsSources.ts

// ========== RSSHUB SOURCES (Folo Pattern) ==========

// Bilibili (Chinese Video Platform)
{
  name: 'Bilibili - 热门视频',
  url: 'https://rsshub.app/bilibili/popular/all',
  category: 'entertainment',
  language: 'zh',
  verified: true,
},
{
  name: 'Bilibili - 科技区',
  url: 'https://rsshub.app/bilibili/partion/36',
  category: 'tech',
  language: 'zh',
  verified: true,
},
{
  name: 'Bilibili - 游戏区',
  url: 'https://rsshub.app/bilibili/partion/4',
  category: 'entertainment',
  language: 'zh',
  verified: true,
},
{
  name: 'Bilibili - 知识区',
  url: 'https://rsshub.app/bilibili/partion/36',
  category: 'education',
  language: 'zh',
  verified: true,
},

// Weibo (Chinese Social Media)
{
  name: 'Weibo - 热搜榜',
  url: 'https://rsshub.app/weibo/search/hot',
  category: 'social',
  language: 'zh',
  verified: true,
},

// Zhihu (Chinese Q&A)
{
  name: 'Zhihu - 每日精选',
  url: 'https://rsshub.app/zhihu/daily',
  category: 'social',
  language: 'zh',
  verified: true,
},
{
  name: 'Zhihu - 热榜',
  url: 'https://rsshub.app/zhihu/hotlist',
  category: 'social',
  language: 'zh',
  verified: true,
},

// Twitter/X (via RSSHub)
{
  name: 'Twitter - Trending',
  url: 'https://rsshub.app/twitter/trending',
  category: 'social',
  language: 'en',
  verified: true,
},
{
  name: 'Twitter - Search: Web3',
  url: 'https://rsshub.app/twitter/search/web3',
  category: 'crypto',
  language: 'en',
  verified: true,
},
{
  name: 'Twitter - Search: AI',
  url: 'https://rsshub.app/twitter/search/artificial%20intelligence',
  category: 'tech',
  language: 'en',
  verified: true,
},

// YouTube (via RSSHub)
{
  name: 'YouTube - Trending',
  url: 'https://rsshub.app/youtube/trending',
  category: 'entertainment',
  language: 'en',
  verified: true,
},

// Reddit (via RSSHub)
{
  name: 'Reddit - r/technology',
  url: 'https://rsshub.app/reddit/r/technology',
  category: 'tech',
  language: 'en',
  verified: true,
},
{
  name: 'Reddit - r/cryptocurrency',
  url: 'https://rsshub.app/reddit/r/cryptocurrency',
  category: 'crypto',
  language: 'en',
  verified: true,
},
{
  name: 'Reddit - r/programming',
  url: 'https://rsshub.app/reddit/r/programming',
  category: 'tech',
  language: 'en',
  verified: true,
},
{
  name: 'Reddit - r/science',
  url: 'https://rsshub.app/reddit/r/science',
  category: 'science',
  language: 'en',
  verified: true,
},
{
  name: 'Reddit - r/worldnews',
  url: 'https://rsshub.app/reddit/r/worldnews',
  category: 'general',
  language: 'en',
  verified: true,
},

// GitHub (via RSSHub)
{
  name: 'GitHub - Trending (Today)',
  url: 'https://rsshub.app/github/trending',
  category: 'tech',
  language: 'en',
  verified: true,
},
{
  name: 'GitHub - Trending (JavaScript)',
  url: 'https://rsshub.app/github/trending/javascript',
  category: 'tech',
  language: 'en',
  verified: true,
},
{
  name: 'GitHub - Trending (TypeScript)',
  url: 'https://rsshub.app/github/trending/typescript',
  category: 'tech',
  language: 'en',
  verified: true,
},
{
  name: 'GitHub - Trending (Python)',
  url: 'https://rsshub.app/github/trending/python',
  category: 'tech',
  language: 'en',
  verified: true,
},
{
  name: 'GitHub - Trending (Rust)',
  url: 'https://rsshub.app/github/trending/rust',
  category: 'tech',
  language: 'en',
  verified: true,
},
{
  name: 'GitHub - Trending (Go)',
  url: 'https://rsshub.app/github/trending/go',
  category: 'tech',
  language: 'en',
  verified: true,
},

// Google News (via RSSHub)
{
  name: 'Google News - Search: Web3',
  url: 'https://rsshub.app/google/news/web3',
  category: 'crypto',
  language: 'en',
  verified: true,
},
{
  name: 'Google News - Search: AI',
  url: 'https://rsshub.app/google/news/artificial%20intelligence',
  category: 'tech',
  language: 'en',
  verified: true,
},
{
  name: 'Google News - Search: Blockchain',
  url: 'https://rsshub.app/google/news/blockchain',
  category: 'crypto',
  language: 'en',
  verified: true,
},
```

---

## Implementation Steps

### Step 1: Add Sources to MCP Server

1. Open `api/newsSources.ts`
2. Add the RSSHub sources above to the `NEWS_SOURCES` array
3. Ensure categories match existing categories in MCP server

### Step 2: Update Categories (if needed)

The MCP server currently supports:
- general, tech, business, crypto, science, health, sports, entertainment, politics, environment

RSSHub sources may need:
- `social` (for Twitter, Weibo, Zhihu)
- `education` (for educational YouTube channels, Bilibili knowledge)

**Update `get_news_by_category` tool** to handle new categories:

```typescript
// In api/server.ts, update category validation
const validCategories = [
  'general', 'tech', 'business', 'crypto', 'science', 
  'health', 'sports', 'entertainment', 'politics', 
  'environment', 'social', 'education' // NEW
];
```

### Step 3: Test RSSHub Sources

Create a test script:

```typescript
// test-rsshub-sources.ts

const testSources = [
  'https://rsshub.app/bilibili/popular/all',
  'https://rsshub.app/weibo/search/hot',
  'https://rsshub.app/twitter/trending',
  'https://rsshub.app/youtube/trending',
  'https://rsshub.app/reddit/r/technology',
  'https://rsshub.app/github/trending',
];

for (const url of testSources) {
  try {
    const response = await fetch(url);
    const xml = await response.text();
    console.log(`✅ ${url}: ${xml.length} bytes`);
  } catch (error) {
    console.error(`❌ ${url}: ${error.message}`);
  }
}
```

### Step 4: Update NEWS_SOURCES_JSON

If using environment variable approach:

1. Add RSSHub sources to `NEWS_SOURCES_JSON.json`
2. Update `NEWS_SOURCES_JSON_MINIFIED.txt` (if using)
3. Update Vercel environment variable

---

## RSSHub Rate Limiting

**Important**: RSSHub has rate limits:
- Public instance (`rsshub.app`): ~20 requests/minute per IP
- Self-hosted: No limits (if you host your own)

**Recommendations**:
1. Use self-hosted RSSHub for production (if possible)
2. Implement rate limiting in MCP server
3. Cache RSSHub responses (5-10 minutes) to reduce requests
4. Use multiple RSSHub instances (load balancing)

---

## Self-Hosted RSSHub Setup (Optional)

If you want to host your own RSSHub instance:

```bash
# Docker setup
docker run -d \
  --name rsshub \
  -p 1200:1200 \
  -e NODE_ENV=production \
  diygod/rsshub

# Or use Docker Compose
# See: https://github.com/DIYgod/RSSHub#docker
```

Then update RSSHub URLs in `newsSources.ts`:
```typescript
const RSSHUB_BASE = process.env.RSSHUB_BASE_URL || 'https://rsshub.app';
```

---

## Verification Checklist

- [ ] Add RSSHub sources to `api/newsSources.ts`
- [ ] Update category validation in `get_news_by_category`
- [ ] Test each RSSHub source (verify RSS format)
- [ ] Update `NEWS_SOURCES_JSON.json` (if using)
- [ ] Update Vercel environment variables (if using)
- [ ] Test MCP server tools with new sources
- [ ] Monitor RSSHub rate limits
- [ ] Document RSSHub dependencies

---

## Notes

1. **RSSHub Reliability**: Public RSSHub instance may be rate-limited. Consider self-hosting for production.

2. **Category Mapping**: Some RSSHub sources don't fit perfectly into existing categories. Map them appropriately:
   - Twitter/Weibo → `social`
   - YouTube/Bilibili → `entertainment` (or create `video` category)
   - GitHub → `tech`
   - Reddit → Based on subreddit topic

3. **Language Detection**: RSSHub sources may be multilingual. Set language based on content:
   - Bilibili/Weibo/Zhihu → `zh`
   - Twitter/Reddit/GitHub → `en`

4. **Verification**: Mark RSSHub sources as `verified: true` only after testing. Some routes may be deprecated or require authentication.

---

*Last Updated: 2025-01-XX*
*Reference: https://github.com/RSSNext/Folo*
*RSSHub: https://github.com/DIYgod/RSSHub*

