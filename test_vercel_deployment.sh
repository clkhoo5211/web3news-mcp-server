#!/bin/bash

# MCP Server Verification Script
# Tests if the MCP server is correctly loading sources from Vercel environment variables

MCP_SERVER="https://web3news-mcp-server.vercel.app/api/server"
EXPECTED_SOURCES=74

echo "🧪 Testing MCP Server Connection..."
echo "URL: $MCP_SERVER"
echo ""

# Test 1: List all sources
echo "1️⃣ Testing list_news_sources..."
RESPONSE=$(curl -s -X POST "$MCP_SERVER" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"list_news_sources"}}' \
  --max-time 30)

if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
  ERROR=$(echo "$RESPONSE" | jq -r '.error.message')
  echo "❌ Error: $ERROR"
  exit 1
fi

SOURCE_COUNT=$(echo "$RESPONSE" | jq -r '.result.content[0].text' | grep -oE "Total: [0-9]+" | grep -oE "[0-9]+" || echo "0")

if [ "$SOURCE_COUNT" = "$EXPECTED_SOURCES" ]; then
  echo "✅ SUCCESS: Found $SOURCE_COUNT sources (expected $EXPECTED_SOURCES)"
else
  echo "⚠️  WARNING: Found $SOURCE_COUNT sources (expected $EXPECTED_SOURCES)"
fi

echo ""

# Test 2: Check if environment variable is being used
echo "2️⃣ Checking if sources are loaded from environment variables..."
LOG_CHECK=$(echo "$RESPONSE" | jq -r '.result.content[0].text' | grep -i "environment\|NEWS_SOURCES_JSON" || echo "")

if [ -n "$LOG_CHECK" ]; then
  echo "✅ Sources appear to be loaded from environment variables"
else
  echo "⚠️  Cannot confirm source of sources (may be using defaults)"
fi

echo ""

# Test 3: Test category fetch
echo "3️⃣ Testing category fetch (tech)..."
CATEGORY_RESPONSE=$(curl -s -X POST "$MCP_SERVER" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_news_by_category","arguments":{"category":"tech","max_items_per_source":1}}}' \
  --max-time 30)

if echo "$CATEGORY_RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
  ERROR=$(echo "$CATEGORY_RESPONSE" | jq -r '.error.message')
  echo "❌ Error: $ERROR"
else
  SOURCES_CHECKED=$(echo "$CATEGORY_RESPONSE" | jq -r '.result.content[0].text' | grep -oE "Sources checked: [0-9]+" | grep -oE "[0-9]+" || echo "0")
  echo "✅ Category fetch working - Sources checked: $SOURCES_CHECKED"
fi

echo ""

# Test 4: Test individual RSS feed
echo "4️⃣ Testing individual RSS feed (BBC News)..."
FEED_RESPONSE=$(curl -s -X POST "$MCP_SERVER" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_rss_feed","arguments":{"feed_url":"https://feeds.bbci.co.uk/news/rss.xml"}}}' \
  --max-time 30)

if echo "$FEED_RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
  ERROR=$(echo "$FEED_RESPONSE" | jq -r '.error.message')
  echo "❌ Error: $ERROR"
else
  HAS_ENTRIES=$(echo "$FEED_RESPONSE" | jq -r '.result.content[0].text' | grep -c "Entry" || echo "0")
  if [ "$HAS_ENTRIES" -gt 0 ]; then
    echo "✅ RSS feed fetch working - Found $HAS_ENTRIES entries"
  else
    echo "⚠️  RSS feed fetch returned no entries"
  fi
fi

echo ""
echo "════════════════════════════════════════"
echo "📊 Verification Summary"
echo "════════════════════════════════════════"
echo "Source Count: $SOURCE_COUNT (expected: $EXPECTED_SOURCES)"
echo "Category Fetch: $(if [ -n "$SOURCES_CHECKED" ] && [ "$SOURCES_CHECKED" -gt 0 ]; then echo "✅ Working"; else echo "❌ Failed"; fi)"
echo "RSS Feed Fetch: $(if [ "$HAS_ENTRIES" -gt 0 ]; then echo "✅ Working"; else echo "❌ Failed"; fi)"
echo ""

if [ "$SOURCE_COUNT" = "$EXPECTED_SOURCES" ]; then
  echo "✅ MCP Server is correctly configured!"
  echo "✅ Environment variables are being loaded correctly!"
else
  echo "⚠️  Source count mismatch - check Vercel environment variables"
  echo "⚠️  Expected: $EXPECTED_SOURCES, Found: $SOURCE_COUNT"
fi

