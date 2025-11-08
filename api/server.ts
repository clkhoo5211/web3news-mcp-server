import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NEWS_SOURCES, getSourcesByCategory, getSourceByName, getAllCategories } from './newsSources';

// Simple RSS parser using native fetch and regex-based XML parsing
async function parseRSSFeed(url: string): Promise<{ title: string; items: any[] }> {
  const response = await fetch(url);
  const xmlText = await response.text();
  
  // Extract feed title
  const titleMatch = xmlText.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Unknown';
  
  // Extract items using regex
  const items: any[] = [];
  const itemMatches = xmlText.matchAll(/<item[^>]*>([\s\S]*?)<\/item>/gi);
  
  let index = 0;
  for (const match of itemMatches) {
    if (index >= 10) break; // Limit to 10 items
    
    const itemXml = match[1];
    // Remove CDATA wrappers
    const cleanXml = itemXml.replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1');
    const itemTitle = cleanXml.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || 'No title';
    const itemLink = cleanXml.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1]?.trim() || '#';
    const itemPubDate = cleanXml.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1]?.trim() || 
                       cleanXml.match(/<date[^>]*>([\s\S]*?)<\/date>/i)?.[1]?.trim() || 'Unknown date';
    const itemDescription = cleanXml.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1]?.trim() || '';
    const itemContent = cleanXml.match(/<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/i)?.[1]?.trim() || itemDescription;
    
    items.push({
      title: itemTitle,
      link: itemLink,
      pubDate: itemPubDate,
      description: itemDescription,
      content: itemContent,
    });
    
    index++;
  }
  
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
            {
              name: 'list_news_sources',
              description: 'List all available news sources, optionally filtered by category',
              inputSchema: {
                type: 'object',
                properties: {
                  category: {
                    type: 'string',
                    description: 'Optional: Filter sources by category (general, tech, business, crypto, science, health, sports, entertainment, politics, environment)',
                  },
                },
                required: [],
              },
            },
            {
              name: 'get_news_by_category',
              description: 'Fetch news from all sources in a specific category',
              inputSchema: {
                type: 'object',
                properties: {
                  category: {
                    type: 'string',
                    description: 'Category name (general, tech, business, crypto, science, health, sports, entertainment, politics, environment)',
                  },
                  max_items_per_source: {
                    type: 'number',
                    description: 'Maximum items to fetch per source (default: 5)',
                  },
                },
                required: ['category'],
              },
            },
            {
              name: 'get_news_by_source',
              description: 'Fetch news from a specific source by name',
              inputSchema: {
                type: 'object',
                properties: {
                  source_name: {
                    type: 'string',
                    description: 'Name of the news source (e.g., "Google News - Top Stories", "TechCrunch")',
                  },
                  max_items: {
                    type: 'number',
                    description: 'Maximum items to fetch (default: 10)',
                  },
                },
                required: ['source_name'],
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
          // Parse RSS feed using native fetch and regex
          const feed = await parseRSSFeed(feedUrl);
          
          // Try to convert HTML to text, but fallback to raw text if html-to-text fails
          let convertHtmlToText: (html: string, options?: any) => string;
          try {
            const htmlToTextModule = await import('html-to-text');
            convertHtmlToText = htmlToTextModule.convert;
          } catch (importError) {
            // Fallback: simple HTML tag removal if html-to-text not available
            convertHtmlToText = (html: string) => {
              return html
                .replace(/<[^>]*>/g, '') // Remove HTML tags
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .trim();
            };
          }
          
          const htmlToTextOptions = {
            wordwrap: false as const,
            ignoreLinks: true,
            ignoreImages: true,
          };

          let result = `# Feed: ${feed.title}\n\n`;
          
          feed.items.forEach((entry: any, i: number) => {
            const summary = entry.description || entry.content || '';
            const summaryText = convertHtmlToText(summary, htmlToTextOptions).trim();
            
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

      // List news sources
      if (name === 'list_news_sources') {
        try {
          const category = args?.category;
          const sources = category ? getSourcesByCategory(category) : NEWS_SOURCES;
          
          const result = `# Available News Sources${category ? ` (Category: ${category})` : ''}\n\n` +
            `Total: ${sources.length} sources\n\n` +
            sources.map((source, i) => 
              `${i + 1}. **${source.name}**\n` +
              `   - Category: ${source.category}\n` +
              `   - Language: ${source.language}\n` +
              `   - URL: ${source.url}\n` +
              `   - Verified: ${source.verified ? '✅' : '❌'}\n`
            ).join('\n') +
            `\n\nAvailable categories: ${getAllCategories().join(', ')}`;

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

      // Get news by category
      if (name === 'get_news_by_category') {
        try {
          const category = args?.category;
          const maxItemsPerSource = args?.max_items_per_source || 5;

          if (!category) {
            res.status(200).json({
              jsonrpc: '2.0',
              id: body.id,
              error: {
                code: -32602,
                message: 'category is required',
              },
            });
            return;
          }

          const sources = getSourcesByCategory(category);
          
          if (sources.length === 0) {
            res.status(200).json({
              jsonrpc: '2.0',
              id: body.id,
              error: {
                code: -32602,
                message: `No sources found for category: ${category}. Available categories: ${getAllCategories().join(', ')}`,
              },
            });
            return;
          }

          // Fetch from all sources in parallel (limit to first 5 sources for performance)
          const sourcesToFetch = sources.slice(0, 5);
          const fetchPromises = sourcesToFetch.map(async (source) => {
            try {
              const feed = await parseRSSFeed(source.url);
              return {
                source: source.name,
                success: true,
                items: feed.items.slice(0, maxItemsPerSource),
              };
            } catch (error: any) {
              return {
                source: source.name,
                success: false,
                error: error.message || 'Unknown error',
              };
            }
          });

          const results = await Promise.allSettled(fetchPromises);
          
          let resultText = `# News from Category: ${category}\n\n`;
          resultText += `Sources checked: ${sourcesToFetch.length}\n\n`;

          results.forEach((result, i) => {
            if (result.status === 'fulfilled') {
              const data = result.value;
              if (data.success && data.items && data.items.length > 0) {
                resultText += `## ${data.source}\n\n`;
                data.items.forEach((item: any, j: number) => {
                  resultText += `${j + 1}. **${item.title}**\n`;
                  resultText += `   - Link: [${item.link}](${item.link})\n`;
                  resultText += `   - Published: ${item.pubDate}\n`;
                  if (item.description) {
                    const desc = item.description.replace(/<[^>]*>/g, '').substring(0, 150);
                    resultText += `   - Summary: ${desc}...\n`;
                  }
                  resultText += '\n';
                });
                resultText += '\n';
              } else {
                resultText += `## ${data.source}\n❌ Failed: ${data.error || 'Unknown error'}\n\n`;
              }
            }
          });

          res.status(200).json({
            jsonrpc: '2.0',
            id: body.id,
            result: {
              content: [
                {
                  type: 'text',
                  text: resultText,
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

      // Get news by source name
      if (name === 'get_news_by_source') {
        try {
          const sourceName = args?.source_name;
          const maxItems = args?.max_items || 10;

          if (!sourceName) {
            res.status(200).json({
              jsonrpc: '2.0',
              id: body.id,
              error: {
                code: -32602,
                message: 'source_name is required',
              },
            });
            return;
          }

          const source = getSourceByName(sourceName);
          
          if (!source) {
            res.status(200).json({
              jsonrpc: '2.0',
              id: body.id,
              error: {
                code: -32602,
                message: `Source not found: ${sourceName}. Use list_news_sources to see available sources.`,
              },
            });
            return;
          }

          const feed = await parseRSSFeed(source.url);
          
          let resultText = `# ${source.name}\n\n`;
          resultText += `Category: ${source.category} | Language: ${source.language}\n\n`;
          
          feed.items.slice(0, maxItems).forEach((item: any, i: number) => {
            resultText += `## ${i + 1}. ${item.title}\n\n`;
            resultText += `- **Link**: [${item.link}](${item.link})\n`;
            resultText += `- **Published**: ${item.pubDate}\n`;
            if (item.description) {
              const desc = item.description.replace(/<[^>]*>/g, '').trim();
              resultText += `- **Summary**: ${desc}\n`;
            }
            resultText += '\n';
          });

          res.status(200).json({
            jsonrpc: '2.0',
            id: body.id,
            result: {
              content: [
                {
                  type: 'text',
                  text: resultText,
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
