# Verify News Sources - Command Guide

## Test Commands

### 1. List All Sources
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

### 2. List Sources by Category (Tech)
```bash
curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "list_news_sources",
      "arguments": {
        "category": "tech"
      }
    }
  }'
```

### 3. Get News by Category (Tech)
```bash
curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "get_news_by_category",
      "arguments": {
        "category": "tech",
        "max_items_per_source": 3
      }
    }
  }'
```

### 4. Get News by Source Name
```bash
curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "tools/call",
    "params": {
      "name": "get_news_by_source",
      "arguments": {
        "source_name": "Google News - Top Stories",
        "max_items": 5
      }
    }
  }'
```

### 5. Test Google News RSS Directly
```bash
curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 5,
    "method": "tools/call",
    "params": {
      "name": "get_rss_feed",
      "arguments": {
        "feed_url": "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en"
      }
    }
  }'
```

### 6. Test Yahoo News
```bash
curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 6,
    "method": "tools/call",
    "params": {
      "name": "get_news_by_source",
      "arguments": {
        "source_name": "Yahoo News - Top Stories"
      }
    }
  }'
```

### 7. Test All Categories
```bash
# General
curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":7,"method":"tools/call","params":{"name":"get_news_by_category","arguments":{"category":"general","max_items_per_source":2}}}'

# Business
curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":8,"method":"tools/call","params":{"name":"get_news_by_category","arguments":{"category":"business","max_items_per_source":2}}}'

# Crypto
curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":9,"method":"tools/call","params":{"name":"get_news_by_category","arguments":{"category":"crypto","max_items_per_source":2}}}'

# Science
curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":10,"method":"tools/call","params":{"name":"get_news_by_category","arguments":{"category":"science","max_items_per_source":2}}}'

# Health
curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":11,"method":"tools/call","params":{"name":"get_news_by_category","arguments":{"category":"health","max_items_per_source":2}}}'

# Sports
curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":12,"method":"tools/call","params":{"name":"get_news_by_category","arguments":{"category":"sports","max_items_per_source":2}}}'

# Entertainment
curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":13,"method":"tools/call","params":{"name":"get_news_by_category","arguments":{"category":"entertainment","max_items_per_source":2}}}'

# Politics
curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":14,"method":"tools/call","params":{"name":"get_news_by_category","arguments":{"category":"politics","max_items_per_source":2}}}'

# Environment
curl -X POST https://web3news-mcp-server.vercel.app/api/server \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":15,"method":"tools/call","params":{"name":"get_news_by_category","arguments":{"category":"environment","max_items_per_source":2}}}'
```

## Expected Results

- ✅ All commands should return JSON-RPC 2.0 responses
- ✅ `list_news_sources` should show all 100+ sources
- ✅ `get_news_by_category` should return articles from multiple sources
- ✅ `get_news_by_source` should return articles from specific source
- ✅ All RSS feeds should parse correctly

## Troubleshooting

If a source fails:
1. Check if RSS URL is still valid
2. Verify CORS headers are set correctly
3. Check Vercel function logs for errors
4. Test RSS URL directly in browser

