# Vercel Environment Variables Setup for web3news-mcp-server

## 📋 Required Environment Variables

### ✅ Currently Required (Minimum Setup)

#### 1. `NEWS_SOURCES_JSON` (Required)

**Purpose**: JSON array of news sources to use instead of hardcoded sources

**Type**: String (minified JSON)

**How to Get Value**:
```bash
# Option 1: Use the existing verified sources
cd projects/web3news-mcp-server
cat NEWS_SOURCES_JSON.json | jq -c '.' > /tmp/sources_minified.json
# Copy contents of /tmp/sources_minified.json

# Option 2: Use VERIFIED_SOURCES.json
cat VERIFIED_SOURCES.json | jq -c '.' > /tmp/sources_minified.json

# Option 3: Use the pre-minified file
cat NEWS_SOURCES_JSON_MINIFIED.txt
```

**Format**:
```json
[{"name":"Google News - Top Stories","url":"https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en","category":"general","language":"en","verified":true},{"name":"BBC News - Top Stories","url":"https://feeds.bbci.co.uk/news/rss.xml","category":"general","language":"en","verified":true}]
```

**Size Limit**: 
- Vercel: **4 KB per variable** (if larger, use GitHub Secrets or external storage)
- If your JSON is > 4 KB, see "Large JSON Handling" section below

**How to Add in Vercel**:
1. Go to [vercel.com](https://vercel.com) → Your Project → **Settings** → **Environment Variables**
2. Click **Add New**
3. **Key**: `NEWS_SOURCES_JSON`
4. **Value**: Paste the minified JSON (single line, no breaks)
5. **Environment**: Select all that apply:
   - ✅ **Production**
   - ✅ **Preview** 
   - ✅ **Development**
6. Click **Save**
7. **Redeploy** your project

**Verification**:
After redeploying, check Vercel function logs:
```
[MCP Server] ✅ Loaded 825 news sources from environment variables
```

**Fallback**: If not set, MCP server uses default hardcoded sources from `api/newsSources.ts`

---

## 🔧 Optional Environment Variables (For Future Improvements)

These are **NOT required** for current functionality, but will be needed if you implement the improvements from `IMPROVEMENT_PLAN.md`:

### 2. `UPSTASH_REDIS_REST_URL` (Optional - For Caching)

**Purpose**: Redis REST API URL for caching RSS feed responses

**When Needed**: When implementing Redis caching (Phase 1 of Improvement Plan)

**How to Get**:
1. Sign up at [upstash.com](https://upstash.com) (free tier available)
2. Create a Redis database
3. Copy the REST URL

**Format**: `https://your-redis.upstash.io`

**Example**: `https://your-redis-12345.upstash.io`

---

### 3. `UPSTASH_REDIS_REST_TOKEN` (Optional - For Caching)

**Purpose**: Redis REST API token for authentication

**When Needed**: When implementing Redis caching (Phase 1 of Improvement Plan)

**How to Get**: From Upstash dashboard (same as above)

**Format**: Long alphanumeric string

**Security**: ⚠️ Keep this secret! Never commit to Git.

---

### 4. `LOG_LEVEL` (Optional - For Logging)

**Purpose**: Set logging verbosity level

**When Needed**: When implementing structured logging (Phase 4 of Improvement Plan)

**Values**: `debug`, `info`, `warn`, `error`

**Default**: `info` (if not set)

**Example**: `info`

---

### 5. `RATE_LIMIT_REQUESTS_PER_MINUTE` (Optional - For Rate Limiting)

**Purpose**: Maximum requests per minute per RSS source

**When Needed**: When implementing rate limiting (Phase 1 of Improvement Plan)

**Default**: `10` (if not set)

**Example**: `10`

---

### 6. `RATE_LIMIT_WINDOW_SECONDS` (Optional - For Rate Limiting)

**Purpose**: Time window for rate limiting in seconds

**When Needed**: When implementing rate limiting (Phase 1 of Improvement Plan)

**Default**: `60` (if not set)

**Example**: `60`

---

### 7. `CACHE_TTL_SECONDS` (Optional - For Caching)

**Purpose**: Cache time-to-live in seconds

**When Needed**: When implementing Redis caching (Phase 1 of Improvement Plan)

**Default**: `300` (5 minutes, if not set)

**Example**: `300`

---

## 📊 Quick Setup Checklist

### Minimum Setup (Current Functionality)

- [ ] Add `NEWS_SOURCES_JSON` to Vercel Environment Variables
- [ ] Copy minified JSON from `NEWS_SOURCES_JSON_MINIFIED.txt` or `VERIFIED_SOURCES.json`
- [ ] Set for Production, Preview, Development environments
- [ ] Redeploy project
- [ ] Verify in logs: `✅ Loaded X news sources from environment variables`

### Full Setup (With Improvements)

- [ ] All of the above, plus:
- [ ] Set up Upstash Redis account
- [ ] Add `UPSTASH_REDIS_REST_URL`
- [ ] Add `UPSTASH_REDIS_REST_TOKEN`
- [ ] Add `LOG_LEVEL` (optional, defaults to `info`)
- [ ] Add `RATE_LIMIT_REQUESTS_PER_MINUTE` (optional, defaults to `10`)
- [ ] Add `RATE_LIMIT_WINDOW_SECONDS` (optional, defaults to `60`)
- [ ] Add `CACHE_TTL_SECONDS` (optional, defaults to `300`)

---

## 🚨 Large JSON Handling (> 4 KB)

Vercel environment variables have a **4 KB limit**. If your `NEWS_SOURCES_JSON` exceeds this:

### Option 1: Use Default Sources (Recommended)

**Don't set `NEWS_SOURCES_JSON`** - the MCP server will use the hardcoded sources from `api/newsSources.ts` (which includes all 825+ sources including RSSHub sources).

**Pros**: 
- ✅ No size limit
- ✅ Sources are version-controlled
- ✅ Easy to update via code

**Cons**:
- ⚠️ Requires code change to update sources

### Option 2: Split into Multiple Variables

```bash
# Split sources by category
NEWS_SOURCES_JSON_GENERAL=[...general sources...]
NEWS_SOURCES_JSON_TECH=[...tech sources...]
NEWS_SOURCES_JSON_CRYPTO=[...crypto sources...]
# etc.

# Then combine in code:
const allSources = [
  ...JSON.parse(process.env.NEWS_SOURCES_JSON_GENERAL || '[]'),
  ...JSON.parse(process.env.NEWS_SOURCES_JSON_TECH || '[]'),
  ...JSON.parse(process.env.NEWS_SOURCES_JSON_CRYPTO || '[]'),
];
```

### Option 3: External JSON File

Host JSON file elsewhere (GitHub Gist, S3, etc.) and fetch on startup:

```typescript
// In server.ts
const sourcesUrl = process.env.NEWS_SOURCES_URL || 'https://gist.githubusercontent.com/.../raw/sources.json';
const response = await fetch(sourcesUrl);
NEWS_SOURCES = await response.json();
```

### Option 4: Use GitHub Secrets (If Using GitHub Actions)

GitHub Secrets have a **64 KB limit** (much larger than Vercel's 4 KB).

See `MCP_ENV_CONFIG_GUIDE.md` for GitHub Secrets setup.

---

## 🔍 Verification Steps

### Step 1: Check Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Verify `NEWS_SOURCES_JSON` is listed
3. Check that it's enabled for the correct environments

### Step 2: Check Deployment Logs

1. Go to **Deployments** → Latest deployment
2. Click **Functions** → `api/server`
3. Look for log message:
   ```
   [MCP Server] ✅ Loaded 825 news sources from environment variables
   ```
   OR
   ```
   [MCP Server] ✅ Loaded 825 default news sources
   ```
   (if using fallback)

### Step 3: Test MCP Server

```bash
# Test via curl
curl -X POST "https://your-mcp-server.vercel.app/api/server" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "list_news_sources",
      "arguments": {}
    }
  }'
```

Expected response should list all sources.

### Step 4: Test Category Fetching

```bash
curl -X POST "https://your-mcp-server.vercel.app/api/server" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "get_news_by_category",
      "arguments": {
        "category": "tech"
      }
    }
  }'
```

---

## 📝 Environment Variable Summary Table

| Variable | Required | Purpose | Default | Size Limit |
|----------|----------|---------|---------|------------|
| `NEWS_SOURCES_JSON` | ✅ Yes | News sources configuration | Uses `api/newsSources.ts` | 4 KB (Vercel) |
| `UPSTASH_REDIS_REST_URL` | ❌ No | Redis caching URL | None | N/A |
| `UPSTASH_REDIS_REST_TOKEN` | ❌ No | Redis auth token | None | N/A |
| `LOG_LEVEL` | ❌ No | Logging verbosity | `info` | N/A |
| `RATE_LIMIT_REQUESTS_PER_MINUTE` | ❌ No | Rate limit threshold | `10` | N/A |
| `RATE_LIMIT_WINDOW_SECONDS` | ❌ No | Rate limit window | `60` | N/A |
| `CACHE_TTL_SECONDS` | ❌ No | Cache TTL | `300` | N/A |

---

## 🛠️ CLI Setup (Alternative)

If you have Vercel CLI installed:

```bash
cd projects/web3news-mcp-server

# Minify JSON
cat NEWS_SOURCES_JSON.json | jq -c '.' > /tmp/sources.json

# Add to Vercel (interactive)
vercel env add NEWS_SOURCES_JSON production
# Paste the JSON when prompted

# Or non-interactive
cat /tmp/sources.json | vercel env add NEWS_SOURCES_JSON production

# Add to other environments
vercel env add NEWS_SOURCES_JSON preview
vercel env add NEWS_SOURCES_JSON development

# List all environment variables
vercel env ls

# Pull environment variables locally
vercel env pull .env.local
```

---

## ⚠️ Important Notes

1. **Vercel vs GitHub Secrets**:
   - **Vercel Environment Variables**: Used by Vercel serverless functions at runtime
   - **GitHub Secrets**: Only used by GitHub Actions workflows
   - For Vercel deployments, use **Vercel Environment Variables** (not GitHub Secrets)

2. **JSON Format**:
   - Must be **minified** (single line, no line breaks)
   - Must be valid JSON array
   - Must start with `[` and end with `]`

3. **Redeployment Required**:
   - Environment variables are loaded at function startup
   - Changes require redeployment to take effect
   - Use "Redeploy" button in Vercel dashboard

4. **Size Limits**:
   - Vercel: 4 KB per variable
   - If larger, use default sources or external storage

5. **Security**:
   - Never commit environment variables to Git
   - Use `.env.local` for local development (gitignored)
   - Keep Redis tokens and API keys secret

---

## 📚 Related Documentation

- `ENV_VAR_SETUP.md` - Detailed setup guide
- `VERCEL_ENV_SETUP.md` - Vercel-specific instructions
- `MCP_ENV_CONFIG_GUIDE.md` - GitHub Secrets alternative
- `IMPROVEMENT_PLAN.md` - Optional improvements requiring additional env vars

---

## ✅ Quick Start (Copy-Paste Ready)

### For Vercel Dashboard:

1. **Key**: `NEWS_SOURCES_JSON`
2. **Value**: Copy from `NEWS_SOURCES_JSON_MINIFIED.txt` or `VERIFIED_SOURCES.json` (minified)
3. **Environments**: Production, Preview, Development
4. **Save** → **Redeploy**

That's it! The MCP server will now use your configured sources.

---

*Last Updated: 2025-01-XX*
*Current Status: Only `NEWS_SOURCES_JSON` required for basic functionality*

