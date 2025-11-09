# NEWS_SOURCES_JSON_MINIFIED.txt Update Summary

## ✅ RSSHub Sources Added

All 25 RSSHub sources extracted from Folo have been added to `NEWS_SOURCES_JSON_MINIFIED.txt`.

### What Was Added:

**RSSHub Sources (25 total)**:
- **Bilibili** (4 sources): 热门视频, 科技区, 游戏区, 知识区
- **Weibo** (1 source): 热搜榜
- **Zhihu** (2 sources): 每日精选, 热榜
- **Twitter** (3 sources): Trending, Web3 search, AI search
- **YouTube** (1 source): Trending
- **Reddit** (5 sources): r/technology, r/cryptocurrency, r/programming, r/science, r/worldnews
- **GitHub** (6 sources): Trending (Today, JavaScript, TypeScript, Python, Rust, Go)
- **Google News** (3 sources): Web3 search, AI search, Blockchain search

### Updated Statistics:

- **Previous sources**: 74
- **RSSHub sources added**: 25
- **Total sources**: 99
- **File size**: 12.15 KB
- **Vercel limit**: 4 KB

---

## ⚠️ Important: Vercel Size Limit

**The minified JSON is 12.15 KB, which exceeds Vercel's 4 KB limit per environment variable.**

### Options:

#### Option 1: Use Default Sources (Recommended)

**Don't set `NEWS_SOURCES_JSON` environment variable** - the MCP server will automatically use all sources from `api/newsSources.ts` (which includes all 825+ sources including RSSHub sources).

**Pros**:
- ✅ No size limit
- ✅ All sources available (825+ including RSSHub)
- ✅ Sources are version-controlled
- ✅ Easy to update via code

**Cons**:
- ⚠️ Requires code change to update sources

**This is the recommended approach** since the code already has all sources hardcoded.

#### Option 2: Use External Storage

Host the JSON file elsewhere and fetch it:
- GitHub Gist
- S3 bucket
- CDN
- GitHub Raw URL

Then set `NEWS_SOURCES_URL` environment variable instead.

#### Option 3: Split into Multiple Variables

Split sources by category into multiple environment variables:
- `NEWS_SOURCES_JSON_GENERAL`
- `NEWS_SOURCES_JSON_TECH`
- `NEWS_SOURCES_JSON_CRYPTO`
- etc.

Then combine in code.

---

## 📋 Current File Contents

The `NEWS_SOURCES_JSON_MINIFIED.txt` file now contains:

- ✅ All 74 original sources from `NEWS_SOURCES_JSON.json`
- ✅ All 25 RSSHub sources from Folo
- ✅ Total: 99 sources
- ✅ Minified JSON format (single line)

**Categories included**:
- general, tech, business, crypto, science, health, sports, entertainment, politics, environment, **social**, **education**

**Languages included**:
- en (English)
- zh (Chinese)

---

## 🚀 Usage Recommendations

### For Vercel Deployment:

**Recommended**: Don't set `NEWS_SOURCES_JSON` environment variable

The MCP server will use default sources from `api/newsSources.ts` which includes:
- All 800+ original sources
- All 25 RSSHub sources
- Total: 825+ sources

**Why this is better**:
- No size limit issues
- All sources available
- Version-controlled
- Easy to maintain

### If You Must Use Environment Variable:

1. **Split by category** (see Option 3 above)
2. **Use external storage** (see Option 2 above)
3. **Use subset only** - Create a smaller JSON with only essential sources

---

## 📝 File Status

- ✅ `NEWS_SOURCES_JSON_MINIFIED.txt` - Updated with RSSHub sources (12.15 KB)
- ✅ `NEWS_SOURCES_JSON.json` - Updated with RSSHub sources (formatted)
- ⚠️ **Too large for Vercel environment variable** (4 KB limit)

---

## 🔍 Verification

To verify RSSHub sources are included:

```bash
cd projects/web3news-mcp-server

# Count RSSHub sources
node -e "
const fs = require('fs');
const sources = JSON.parse(fs.readFileSync('NEWS_SOURCES_JSON_MINIFIED.txt', 'utf8'));
const rsshub = sources.filter(s => s.url.includes('rsshub.app'));
console.log('RSSHub sources:', rsshub.length);
rsshub.forEach(s => console.log('-', s.name));
"
```

Expected output: 25 RSSHub sources listed.

---

*Last Updated: 2025-01-XX*
*Status: ✅ RSSHub sources added, but file exceeds Vercel limit - use default sources instead*

