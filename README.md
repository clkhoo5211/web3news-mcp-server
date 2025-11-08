# Web3News MCP Server - TypeScript Version

MCP (Model Context Protocol) server for fetching RSS feeds, deployed on Vercel using the official TypeScript template.

## Features

- Fetch RSS feeds from any URL
- Parse and format feed content as Markdown
- Deployed as serverless function on Vercel
- Uses official Vercel MCP template structure

## Setup

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Vercel account

### Installation

```bash
pnpm install
# or
npm install
```

### Local Development

```bash
pnpm dev
# or
npm run dev
```

## Deployment

### Deploy to Vercel

1. **Connect to Vercel:**
   ```bash
   vercel link
   ```

2. **Deploy:**
   ```bash
   vercel deploy
   ```

3. **Or use GitHub integration:**
   - Push to GitHub
   - Vercel auto-deploys

### Environment Variables

**Required:**
- `REDIS_URL` - Redis connection string (use Upstash for free Redis)

**Optional:**
- None

### Enable Fluid Compute

1. Go to Vercel Dashboard → Project Settings
2. Enable "Fluid Compute"
3. This optimizes performance for MCP servers

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
    url: 'https://your-app.vercel.app',
  },
});

await client.connect();
const result = await client.callTool({
  name: 'get_rss_feed',
  arguments: { feed_url: 'https://cointelegraph.com/rss' },
});
await client.close();
```

## Project Structure

```
web3news-mcp-server/
├── api/
│   └── server.ts          # Main MCP server (TypeScript)
├── package.json           # Node.js dependencies
├── tsconfig.json          # TypeScript configuration
├── vercel.json            # Vercel configuration
└── README.md             # This file
```

## Tools

### get_rss_feed

Retrieve RSS feed content.

**Parameters:**
- `feed_url` (string, required): URL of the RSS feed

**Returns:**
- Formatted Markdown string with feed title and up to 10 latest entries

## License

MIT
