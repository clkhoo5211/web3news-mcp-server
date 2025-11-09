# MCP Server Configuration via GitHub Environment Variables

## Overview

Instead of hardcoding news sources in the MCP server code, you can now configure them via **GitHub Environment Variables**. This provides much better flexibility and allows you to update sources without code changes.

## Architecture Benefits

✅ **Single Source of Truth**: MCP server manages its own configuration  
✅ **Easy Updates**: Change sources via GitHub Secrets without touching code  
✅ **Separation of Concerns**: React app only needs one MCP server URL  
✅ **Flexible Deployment**: Different MCP server instances can have different configs  
✅ **Environment-Driven**: Configure via GitHub Secrets or Vercel environment variables  

## How It Works

### Current Flow:
```
React App → MCP Server URL (GitHub Secret) → MCP Server → Hardcoded Sources
```

### Improved Flow:
```
React App → MCP Server URL (GitHub Secret) → MCP Server → Sources from GitHub Secrets
```

## Configuration Options

### ✅ Option 1: Vercel Environment Variables (Recommended for Vercel Deployments)

**For Vercel deployments, use Vercel Environment Variables (not GitHub Secrets).**

1. Go to your **Vercel project dashboard**
2. Navigate to **Settings** → **Environment Variables**
3. Click **Add New**
4. **Key**: `NEWS_SOURCES_JSON`
5. **Value**: Minified JSON array from `VERIFIED_SOURCES.json`
6. **Environment**: Select Production, Preview, Development (as needed)
7. Click **Save**
8. **Redeploy** your project

**Why Vercel Environment Variables?**
- Vercel serverless functions read `process.env.NEWS_SOURCES_JSON` at runtime
- GitHub Secrets are only used by GitHub Actions workflows
- For native Vercel deployments, use Vercel Environment Variables directly

### Option 2: GitHub Secrets (Only if using GitHub Actions)

**Only use this if you have a `.github/workflows/deploy.yml` file that deploys via GitHub Actions.**

1. Go to your **MCP Server** GitHub repository (`web3news-mcp-server`)
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NEWS_SOURCES_JSON`
5. Value: JSON array of news sources (see format below)
6. Click **Add secret**
7. Update your workflow file to pass it to Vercel CLI

See `ENV_VAR_SETUP.md` for detailed instructions.

## News Sources Format

The `NEWS_SOURCES_JSON` environment variable should contain a JSON array:

```json
[
  {
    "name": "Google News - Top Stories",
    "url": "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en",
    "category": "general",
    "language": "en",
    "verified": true
  },
  {
    "name": "Google News - Technology",
    "url": "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en",
    "category": "tech",
    "language": "en",
    "verified": true
  },
  {
    "name": "CoinDesk",
    "url": "https://www.coindesk.com/arc/outboundfeeds/rss/",
    "category": "crypto",
    "language": "en",
    "verified": true
  }
]
```

### Field Descriptions

- **name**: Display name of the news source
- **url**: RSS feed URL
- **category**: One of: `general`, `tech`, `crypto`, `business`, `science`, `health`, `sports`, `entertainment`, `politics`, `environment`
- **language**: Language code (e.g., `en`, `zh`, `es`)
- **verified**: Boolean indicating if the source has been verified

## React App Configuration

The React app (`project-20251107-003428-web3news-aggregator`) only needs **one** environment variable:

### GitHub Secret:
- **Name**: `VITE_MCP_SERVER_URL`
- **Value**: `https://web3news-mcp-server.vercel.app/api/server`

That's it! The React app doesn't need to know about individual sources - the MCP server handles all that.

## Migration Steps

### Step 1: Export Current Sources

1. Copy the `NEWS_SOURCES` array from `api/newsSources.ts`
2. Convert to JSON format
3. Minify/compress if needed (GitHub Secrets have size limits)

### Step 2: Add to GitHub Secrets

1. Go to MCP server repository
2. Add `NEWS_SOURCES_JSON` secret with the JSON array
3. Redeploy MCP server (or wait for next deployment)

### Step 3: Verify

1. Check MCP server logs for: `✅ Loaded X news sources from environment variables`
2. Test MCP server endpoints
3. Verify React app can fetch news

## Benefits Over Hardcoded Approach

| Aspect | Hardcoded | Environment Variables |
|--------|-----------|----------------------|
| **Update Sources** | Requires code change + redeploy | Update GitHub Secret + redeploy |
| **Different Configs** | Need separate code branches | Different env vars per deployment |
| **React App Complexity** | Needs to know all sources | Only needs MCP server URL |
| **Flexibility** | Low | High |
| **Maintenance** | Code changes required | Configuration only |

## Example: Multiple MCP Server Instances

You can have different MCP server instances with different source configurations:

### Instance 1: General News
```json
NEWS_SOURCES_JSON = [
  {"name": "BBC", "url": "...", "category": "general", ...},
  {"name": "CNN", "url": "...", "category": "general", ...}
]
```

### Instance 2: Tech Focus
```json
NEWS_SOURCES_JSON = [
  {"name": "TechCrunch", "url": "...", "category": "tech", ...},
  {"name": "The Verge", "url": "...", "category": "tech", ...}
]
```

### Instance 3: Crypto Focus
```json
NEWS_SOURCES_JSON = [
  {"name": "CoinDesk", "url": "...", "category": "crypto", ...},
  {"name": "CoinTelegraph", "url": "...", "category": "crypto", ...}
]
```

Then your React app can connect to different instances based on user preferences or A/B testing!

## Fallback Behavior

If `NEWS_SOURCES_JSON` is not set or invalid:
- MCP server falls back to default hardcoded sources
- Logs warning: `⚠️ Using default news sources`
- Continues to function normally

This ensures backward compatibility and prevents breakage.

## Size Limits

- **GitHub Secrets**: 64 KB limit
- **Vercel Environment Variables**: 4 KB limit per variable

For large source lists:
- Use GitHub Secrets (recommended)
- Or split into multiple variables and combine in code
- Or use a JSON file hosted elsewhere and fetch on startup

## Testing

### Test Environment Variable Loading

```bash
# Set environment variable
export NEWS_SOURCES_JSON='[{"name":"Test","url":"https://example.com/rss","category":"tech","language":"en","verified":true}]'

# Run MCP server locally
npm run dev

# Check logs for: "✅ Loaded 1 news sources from environment variables"
```

### Verify in Production

1. Check Vercel function logs
2. Look for: `[MCP Server] ✅ Loaded X news sources from environment variables`
3. Test `get_news_by_category` tool
4. Verify sources match your configuration

## Troubleshooting

### Issue: Sources not loading from environment

**Check:**
1. Environment variable name is exactly `NEWS_SOURCES_JSON`
2. JSON is valid (use JSON validator)
3. Variable is set in correct environment (Production/Preview/Development)
4. MCP server has been redeployed after adding secret

### Issue: JSON too large

**Solutions:**
1. Use GitHub Secrets (64 KB limit)
2. Split sources into multiple categories
3. Use external JSON file and fetch on startup
4. Compress JSON (remove whitespace)

### Issue: Fallback to default sources

**Causes:**
- Environment variable not set
- Invalid JSON format
- Empty array

**Solution:**
- Check logs for error message
- Validate JSON format
- Ensure variable is set correctly

## Next Steps

1. ✅ Export current sources to JSON
2. ✅ Add `NEWS_SOURCES_JSON` to GitHub Secrets
3. ✅ Update MCP server code to read from env vars
4. ✅ Deploy MCP server
5. ✅ Verify sources are loaded correctly
6. ✅ Simplify React app config (only needs MCP server URL)

This architecture is much more flexible and maintainable! 🚀

