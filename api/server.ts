import type { VercelRequest, VercelResponse } from '@vercel/node';

// Vercel serverless function handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
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
    let body: any = {};
    
    try {
      // Parse request body
      if (typeof req.body === 'string') {
        body = JSON.parse(req.body);
      } else if (req.body) {
        body = req.body;
      }
    } catch (parseError) {
      res.status(400).json({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32700,
          message: 'Parse error',
        },
      });
      return;
    }
    
    // Handle MCP protocol initialization
    if (body.method === 'initialize') {
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

    // Handle tool listing
    if (body.method === 'tools/list') {
      res.status(200).json({
        jsonrpc: '2.0',
        id: body.id,
        result: {
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
        },
      });
      return;
    }

    // Handle tool calls
    if (body.method === 'tools/call') {
      const { name, arguments: args } = body.params || {};
      
      if (name === 'get_rss_feed') {
        const feedUrl = args?.feed_url;
        
        if (!feedUrl) {
          res.status(200).json({
            jsonrpc: '2.0',
            id: body.id,
            error: {
              code: -32602,
              message: 'feed_url is required',
            },
          });
          return;
        }

        try {
          // Dynamic import to avoid issues with ES modules
          const rssParserModule = await import('rss-parser');
          const htmlToTextModule = await import('html-to-text');
          
          const Parser = rssParserModule.default || rssParserModule;
          const { convert } = htmlToTextModule;
          
          const rssParser = new Parser();
          const feed = await rssParser.parseURL(feedUrl);
          
          const htmlToTextOptions = {
            wordwrap: false as const,
            ignoreLinks: true,
            ignoreImages: true,
          };

          let result = `# Feed: ${feed.title || 'Unknown'}\n\n`;
          
          (feed.items || []).slice(0, 10).forEach((entry: any, i: number) => {
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

          res.status(200).json({
            jsonrpc: '2.0',
            id: body.id,
            result: {
              content: [
                {
                  type: 'text',
                  text: result,
                },
              ],
            },
          });
          return;
        } catch (error: any) {
          console.error('RSS fetch error:', error);
          res.status(200).json({
            jsonrpc: '2.0',
            id: body.id,
            error: {
              code: -32603,
              message: `Error fetching RSS feed: ${error.message || 'Unknown error'}`,
            },
          });
          return;
        }
      }

      res.status(200).json({
        jsonrpc: '2.0',
        id: body.id,
        error: {
          code: -32601,
          message: `Unknown tool: ${name}`,
        },
      });
      return;
    }

    // Handle other MCP protocol methods
    res.status(200).json({
      jsonrpc: '2.0',
      id: body.id || 1,
      error: {
        code: -32601,
        message: 'Method not found',
      },
    });
  } catch (error: any) {
    // Better error handling with details
    console.error('Handler error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: error.message || 'Internal server error',
      type: error.constructor?.name || 'Unknown',
      // Include stack in response for debugging (remove in production)
      stack: error.stack,
    });
  }
}
