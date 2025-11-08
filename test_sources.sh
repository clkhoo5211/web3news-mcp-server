#!/bin/bash

# Test script for verifying news sources
# Usage: ./test_sources.sh

MCP_SERVER="https://web3news-mcp-server.vercel.app/api/server"

echo "🧪 Testing MCP Server News Sources..."
echo ""

# Test 1: List all sources
echo "1️⃣ Testing list_news_sources..."
curl -s -X POST "$MCP_SERVER" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"list_news_sources"}}' | jq -r '.result.content[0].text' | head -20
echo ""

# Test 2: List Chinese sources
echo "2️⃣ Testing Chinese sources (tech category)..."
curl -s -X POST "$MCP_SERVER" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"list_news_sources","arguments":{"category":"tech"}}}' | jq -r '.result.content[0].text' | grep -i "中文\|zh\|bilibili\|weibo\|知乎\|少数派" | head -10
echo ""

# Test 3: Test Bilibili RSSHub
echo "3️⃣ Testing Bilibili (RSSHub)..."
curl -s -X POST "$MCP_SERVER" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_rss_feed","arguments":{"feed_url":"https://rsshub.app/bilibili/popular/all"}}}' | jq -r '.result.content[0].text' | head -30
echo ""

# Test 4: Test Weibo RSSHub
echo "4️⃣ Testing Weibo (RSSHub)..."
curl -s -X POST "$MCP_SERVER" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"get_rss_feed","arguments":{"feed_url":"https://rsshub.app/weibo/search/hot"}}}' | jq -r '.result.content[0].text' | head -30
echo ""

# Test 5: Test Chinese tech sources
echo "5️⃣ Testing Chinese tech sources..."
curl -s -X POST "$MCP_SERVER" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"get_news_by_category","arguments":{"category":"tech","max_items_per_source":2}}}' | jq -r '.result.content[0].text' | grep -A 5 -i "bilibili\|weibo\|知乎\|少数派\|极客\|爱范儿" | head -30
echo ""

# Test 6: Test specific Chinese source
echo "6️⃣ Testing 少数派 (sspai)..."
curl -s -X POST "$MCP_SERVER" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":6,"method":"tools/call","params":{"name":"get_news_by_source","arguments":{"source_name":"少数派","max_items":3}}}' | jq -r '.result.content[0].text' | head -30
echo ""

echo "✅ Testing complete!"
