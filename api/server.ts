import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple RSS parser using native fetch and DOMParser
async function parseRSSFeed(url: string): Promise<{ title: string; items: any[] }> {
  const response = await fetch(url);
  const xmlText = await response.text();
  
  // Simple XML parsing (works in Node.js 18+)
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  
  const title = xmlDoc.querySelector('title')?.textContent || 'Unknown';
  const items: any[] = [];
  
  const entries = xmlDoc.querySelectorAll('item');
  entries.forEach((item, index) => {
    if (index >= 10) return; // Limit to 10 items
    
    items.push({
      title: item.querySelector('title')?.textContent || 'No title',
      link: item.querySelector('link')?.textContent || '#',
      pubDate: item.querySelector('pubDate')?.textContent || item.querySelector('date')?.textContent || 'Unknown date',
      description: item.querySelector('description')?.textContent || '',
      content: item.querySelector('content\\:encoded')?.textContent || item.querySelector('description')?.textContent || '',
    });
  });
  
  return { title, items };
}

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

  // Handle POST requests
  try {
    let body: any = {};
    
    if (typeof req.body === 'string') {
      body = JSON.parse(req.body);
    } else if (req.body) {
      body = req.body;
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
                    description: 'The URL of the RSS feed to fetch',
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
          // Parse RSS feed using native fetch
          const feed = await parseRSSFeed(feedUrl);
          
          // Import html-to-text dynamically
          const htmlToTextModule = await import('html-to-text');
          const { convert } = htmlToTextModule;
          
          const htmlToTextOptions = {
            wordwrap: false as const,
            ignoreLinks: true,
            ignoreImages: true,
          };

          let result = `# Feed: ${feed.title}\n\n`;
          
          feed.items.forEach((entry: any, i: number) => {
            const summary = entry.description || entry.content || '';
            const summaryText = convert(summary, htmlToTextOptions).trim();
            
            result += `## Entry ${i + 1}\n`;
            result += `- **Title**: ${entry.title || 'No title'}\n`;
            result += `- **Link**: [${entry.link || '#'}](${entry.link || '#'})\n`;
            result += `- **Published**: ${entry.pubDate || 'Unknown date'}\n`;
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
          res.status(200).json({
            jsonrpc: '2.0',
            id: body.id,
            error: {
              code: -32603,
              message: `Error: ${error.message || 'Unknown error'}`,
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

    // Default response
    res.status(200).json({
      jsonrpc: '2.0',
      id: body.id || 1,
      error: {
        code: -32601,
        message: 'Method not found',
      },
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || 'Internal server error',
      type: error.constructor?.name || 'Unknown',
    });
  }
}
