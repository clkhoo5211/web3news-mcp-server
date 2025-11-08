# Web3News MCP Server

MCP (Model Context Protocol) server for fetching RSS feeds, deployed on Vercel.

## Features

- Fetch RSS feeds from any URL
- Parse and format feed content as Markdown
- Deployed as serverless function on Vercel
- SSE (Server-Sent Events) transport for MCP protocol

## Deployment

### Prerequisites

- GitHub account
- Vercel account (free tier works)

### Steps

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial MCP server"
   git remote add origin https://github.com/clkhoo5211/web3news-mcp-server.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import `web3news-mcp-server` repository
   - Vercel will auto-detect Python
   - Click "Deploy"
   - Get your deployment URL: `https://your-app.vercel.app`

3. **Configure GitHub Repo Settings:**
   - Go to repo Settings → General
   - Set default branch to `main` (if not already)
   - Enable "Allow auto-merge" (optional)
   - Under "Features", ensure "Issues" and "Pull requests" are enabled

## Endpoints

- `/sse` - SSE transport endpoint for MCP protocol
- `/` - Root endpoint (redirects to SSE)

## Usage

### From React App

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

const client = new Client({
  name: 'web3news-client',
  version: '1.0.0',
}, {
  transport: {
    type: 'sse',
    url: 'https://your-app.vercel.app/sse',
  },
});

await client.connect();
const result = await client.callTool({
  name: 'get_rss_feed',
  arguments: { feed_url: 'https://cointelegraph.com/rss' },
});
await client.close();
```

## Environment Variables

No environment variables required for basic operation.

## Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run locally (requires FastMCP CLI)
mcp dev api/index.py
```

## Project Structure

```
web3news-mcp-server/
├── api/
│   └── index.py          # Vercel serverless function
├── vercel.json           # Vercel configuration
├── requirements.txt      # Python dependencies
├── README.md            # This file
└── .gitignore           # Git ignore file
```

## License

MIT

