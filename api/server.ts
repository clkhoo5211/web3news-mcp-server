import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import Parser from 'rss-parser';
import { convert } from 'html-to-text';

// Initialize RSS parser
const rssParser = new Parser();

// Initialize MCP server
const server = new Server(
  {
    name: 'web3news-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Helper function to fetch RSS feed
async function fetchRSSFeed(url: string): Promise<{ title: string; items: any[] }> {
  try {
    const feed = await rssParser.parseURL(url);
    return {
      title: feed.title || 'Unknown',
      items: feed.items.slice(0, 10), // Limit to 10 entries
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch RSS feed: ${error.message}`);
  }
}

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_rss_feed',
        description: 'Retrieve the content of the specified RSS feed',
        inputSchema: {
          type: 'object',
          properties: {
            feed_url: {
              type: 'string',
              description: 'The URL of the RSS feed to fetch (e.g., https://cointelegraph.com/rss)',
            },
          },
          required: ['feed_url'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'get_rss_feed') {
    const feedUrl = args?.feed_url as string;
    
    if (!feedUrl) {
      throw new Error('feed_url is required');
    }

    try {
      const feed = await fetchRSSFeed(feedUrl);
      
      // Convert HTML to text
      const htmlToTextOptions = {
        wordwrap: false as const,
        ignoreLinks: true,
        ignoreImages: true,
      };

      let result = `# Feed: ${feed.title}\n\n`;
      
      feed.items.forEach((entry: any, i: number) => {
        const summary = entry.contentSnippet || entry.content || entry.description || '';
        const summaryText = convert(summary, htmlToTextOptions).trim();
        
        result += `## Entry ${i + 1}\n`;
        result += `- **Title**: ${entry.title || 'No title'}\n`;
        result += `- **Link**: [${entry.link || '#'}](${entry.link || '#'})\n`;
        result += `- **Published**: ${entry.pubDate || entry.isoDate || 'Unknown date'}\n`;
        if (summaryText) {
          result += `- **Summary**: ${summaryText}\n`;
        }
        result += '\n';
      });

      return {
        content: [
          {
            type: 'text',
            text: result,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching RSS feed: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Vercel serverless function handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({
      status: 'MCP Server Running',
      tools: ['get_rss_feed'],
      message: 'Use MCP client to connect via SSE transport',
      protocolVersion: '2024-11-05',
    });
    return;
  }

  // Handle POST requests for MCP protocol
  // For full SSE support, we'd need Redis and proper session management
  // This is a simplified version
  try {
    const body = req.body;
    
    // Handle MCP protocol initialization
    if (body?.method === 'initialize') {
      res.status(200).json({
        jsonrpc: '2.0',
        id: body.id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: 'web3news-mcp-server',
            version: '1.0.0',
          },
        },
      });
      return;
    }

    // Handle other MCP protocol methods
    res.status(200).json({
      jsonrpc: '2.0',
      id: body?.id || 1,
      error: {
        code: -32601,
        message: 'Method not found',
      },
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
}
