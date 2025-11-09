# Quick Setup Guide - Vercel Environment Variable

## ✅ Ready-to-Paste JSON File

I've created a **minified, single-line JSON file** ready to paste into Vercel.

**File:** `NEWS_SOURCES_JSON_VERCEL.txt`

## 📋 Step-by-Step Instructions

### Step 1: Open the File

Open `NEWS_SOURCES_JSON_VERCEL.txt` in your text editor or terminal:

```bash
cd projects/web3news-mcp-server
cat NEWS_SOURCES_JSON_VERCEL.txt
```

**OR** open it in your IDE/editor.

### Step 2: Copy the Entire Content

- **Select ALL** the text in the file (it's all on one line)
- Copy it (Cmd+C on Mac, Ctrl+C on Windows/Linux)
- **Important:** Make sure you copy the ENTIRE line, from `[` to `]`

### Step 3: Paste into Vercel

1. Go to [vercel.com](https://vercel.com)
2. Select your **web3news-mcp-server** project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. **Key**: Type `NEWS_SOURCES_JSON` (exactly, no spaces)
6. **Value**: Paste the JSON you copied
   - **Important:** 
     - Don't add any spaces before or after
     - Don't press Enter/Return
     - Just paste directly into the field
7. **Environment**: Select all three:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
8. Click **Save**

### Step 4: Verify No Errors

After clicking Save, you should see:
- ✅ No warning icons
- ✅ The variable appears in the list
- ✅ No "whitespace" or "return characters" errors

### Step 5: Redeploy

1. Go to **Deployments** tab
2. Click **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### Step 6: Check Logs

After redeployment:
1. Go to **Deployments** → Latest deployment
2. Click **Functions** → `api/server`
3. Look for this log message:
   ```
   [MCP Server] ✅ Loaded 74 news sources from environment variables
   ```

## 🔍 Troubleshooting

**If you still get "whitespace" error:**

1. **Check the file:**
   ```bash
   # Verify it's a single line
   wc -l NEWS_SOURCES_JSON_VERCEL.txt
   # Should output: 1
   ```

2. **Re-copy carefully:**
   - Open the file
   - Select ALL (Cmd+A / Ctrl+A)
   - Copy (Cmd+C / Ctrl+C)
   - Paste directly into Vercel (no extra spaces)

3. **Alternative: Use command line:**
   ```bash
   # Copy to clipboard (macOS)
   cat NEWS_SOURCES_JSON_VERCEL.txt | pbcopy
   
   # Then paste in Vercel
   ```

## ✅ Success Indicators

You'll know it worked when:
- ✅ No error messages in Vercel
- ✅ Environment variable shows in the list
- ✅ Deployment succeeds
- ✅ Logs show: "Loaded 74 news sources from environment variables"

## 📊 What's Included

The JSON contains **74 verified working sources**:
- 18 Tech sources
- 13 Business sources
- 9 General sources
- 7 Entertainment sources
- 7 Crypto sources
- 5 Politics sources
- 5 Environment sources
- 4 Sports sources
- 4 Science sources
- 2 Health sources

All sources have been tested and verified to work via the MCP server API.

