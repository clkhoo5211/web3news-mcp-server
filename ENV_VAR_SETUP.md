# NEWS_SOURCES_JSON Setup Guide

## ✅ Answer: Vercel Environment Variable (Not GitHub Secret)

Since your repo is **imported from GitHub to Vercel**, Vercel uses its **native GitHub integration** which auto-deploys on push.

**For this setup, use Vercel Environment Variables (not GitHub Secrets).**

## Why?

- **GitHub Secrets** → Used by GitHub Actions workflows during CI/CD builds
- **Vercel Environment Variables** → Used by Vercel serverless functions at runtime
- Since your MCP server runs on Vercel and reads `process.env.NEWS_SOURCES_JSON` at runtime, it needs to be set in **Vercel**

## ✅ Correct Setup: Vercel Environment Variable

### Step 1: Go to Vercel Dashboard

1. Visit [vercel.com](https://vercel.com) and sign in
2. Select your **web3news-mcp-server** project
3. Navigate to **Settings** → **Environment Variables**

### Step 2: Add Environment Variable

1. Click **Add New**
2. **Key**: `NEWS_SOURCES_JSON`
3. **Value**: Copy the minified JSON from `VERIFIED_SOURCES.json`
   ```bash
   # Minify the JSON first
   cd projects/web3news-mcp-server
   cat VERIFIED_SOURCES.json | jq -c '.' > NEWS_SOURCES_JSON_MINIFIED.txt
   # Then copy the contents
   ```
4. **Environment**: Select all that apply:
   - ✅ **Production** (for production deployments)
   - ✅ **Preview** (for preview deployments)  
   - ✅ **Development** (for local development)
5. Click **Save**

### Step 3: Redeploy

After adding the environment variable:

**Option A: Via Dashboard**
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**

**Option B: Via Git Push**
```bash
# Make a small change and push
git commit --allow-empty -m "Trigger redeploy with NEWS_SOURCES_JSON"
git push
```

### Step 4: Verify

Check Vercel function logs:
1. Go to **Deployments** → Click on latest deployment
2. Click **Functions** → `api/server`
3. Look for log message:
   ```
   [MCP Server] ✅ Loaded 74 news sources from environment variables
   ```

## ❌ When to Use GitHub Secrets

**Only if you're deploying via GitHub Actions:**

If you have a `.github/workflows/deploy.yml` file that deploys to Vercel, then:
1. Add `NEWS_SOURCES_JSON` as GitHub Secret
2. Reference it in workflow: `${{ secrets.NEWS_SOURCES_JSON }}`
3. Pass it to Vercel CLI: `vercel env add NEWS_SOURCES_JSON ${{ secrets.NEWS_SOURCES_JSON }}`

But for **native Vercel deployments** (most common), use **Vercel Environment Variables** directly.

## 📋 Quick Reference

| Deployment Method | Where to Set | How Code Accesses |
|------------------|--------------|-------------------|
| **Vercel Native** ✅ | Vercel Dashboard → Environment Variables | `process.env.NEWS_SOURCES_JSON` |
| **GitHub Actions** | GitHub Secrets → Workflow → Vercel CLI | `process.env.NEWS_SOURCES_JSON` |

## 🔍 Check Your Deployment Method

```bash
cd projects/web3news-mcp-server

# Check if you have GitHub Actions
ls -la .github/workflows/ 2>/dev/null

# If empty or doesn't exist → Using Vercel native → Use Vercel Environment Variables
# If exists → Check workflow file to see if it sets env vars
```

## 💡 Recommended: Vercel Environment Variables

**For most Vercel deployments:**
1. ✅ Set in **Vercel Dashboard** → **Environment Variables**
2. ✅ No code changes needed
3. ✅ Works immediately after redeploy
4. ✅ Can be different per environment (Production/Preview/Development)

## 📝 JSON Format

The value should be a **minified JSON array** (no line breaks):

```json
[{"name":"Google News - Top Stories","url":"https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en","category":"general","language":"en","verified":true},{"name":"BBC News - Top Stories","url":"https://feeds.bbci.co.uk/news/rss.xml","category":"general","language":"en","verified":true}]
```

**Size Limit:** Vercel environment variables have a **64 KB limit**

## 🚀 Quick Setup (CLI)

If you have Vercel CLI installed:

```bash
cd projects/web3news-mcp-server

# Minify JSON
cat VERIFIED_SOURCES.json | jq -c '.' > /tmp/news_sources_minified.json

# Add to Vercel (interactive)
vercel env add NEWS_SOURCES_JSON production
# Paste the minified JSON when prompted

# Or non-interactive (if you have the JSON in a file)
cat /tmp/news_sources_minified.json | vercel env add NEWS_SOURCES_JSON production
```

## ✅ Summary

**For Vercel deployments:** Use **Vercel Environment Variables** (not GitHub Secrets)

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add `NEWS_SOURCES_JSON` with minified JSON from `VERIFIED_SOURCES.json`
3. Redeploy
4. Verify in logs

