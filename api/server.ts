import type { VercelRequest, VercelResponse } from '@vercel/node';

// Lazy import newsSources to prevent initialization errors
let NEWS_SOURCES: any[] = [];
let getSourcesByCategory: ((category: string) => any[]) | null = null;
let getSourceByName: ((name: string) => any) | null = null;
let getAllCategories: (() => string[]) | null = null;
let newsSourcesLoaded = false;

// Function to load newsSources module (with environment variable support)
async function loadNewsSources() {
  if (newsSourcesLoaded) return;
  
  try {
    // Try loading from environment variables first
    const envSourcesJson = process.env.NEWS_SOURCES_JSON;
    if (envSourcesJson) {
      try {
        const parsed = JSON.parse(envSourcesJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          NEWS_SOURCES = parsed;
          console.log(`[MCP Server] ✅ Loaded ${NEWS_SOURCES.length} news sources from environment variables`);
          
          // Create helper functions for env-loaded sources
          getSourcesByCategory = (category: string) => 
            NEWS_SOURCES.filter((s: any) => s.category === category);
          getSourceByName = (name: string) => 
            NEWS_SOURCES.find((s: any) => s.name === name);
          getAllCategories = () => 
            Array.from(new Set(NEWS_SOURCES.map((s: any) => s.category)));
          
          newsSourcesLoaded = true;
          return;
        }
      } catch (error) {
        console.error('[MCP Server] ❌ Failed to parse NEWS_SOURCES_JSON, falling back to default:', error);
      }
    }
    
    // Fallback to default newsSources module
    // Use .js extension for ESM compatibility in Vercel
    const newsSourcesModule = await import('./newsSources.js');
    NEWS_SOURCES = newsSourcesModule.NEWS_SOURCES || [];
    getSourcesByCategory = newsSourcesModule.getSourcesByCategory;
    getSourceByName = newsSourcesModule.getSourceByName;
    getAllCategories = newsSourcesModule.getAllCategories;
    newsSourcesLoaded = true;
    console.log(`[MCP Server] ✅ Loaded ${NEWS_SOURCES.length} default news sources`);
  } catch (error) {
    console.error('Failed to load newsSources:', error);
    // Continue without newsSources - fallback to basic functionality
  }
}

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
      tools: ['get_rss_feed', 'get_article_content'],
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
                    description: 'Category name (general, tech, business, crypto, science, health, sports, entertainment, politics, environment, social, education)',
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
            {
              name: 'get_article_content',
              description: 'Fetch and parse full article content from a URL (server-side, no CORS issues)',
              inputSchema: {
                type: 'object',
                properties: {
                  article_url: {
                    type: 'string',
                    description: 'The URL of the article to fetch and parse',
                  },
                },
                required: ['article_url'],
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
          // Lazy load if not already loaded
          if (!getSourcesByCategory || NEWS_SOURCES.length === 0) {
            try {
              const newsSourcesModule = await import('./newsSources.js');
              NEWS_SOURCES = newsSourcesModule.NEWS_SOURCES || [];
              getSourcesByCategory = newsSourcesModule.getSourcesByCategory;
              getSourceByName = newsSourcesModule.getSourceByName;
              getAllCategories = newsSourcesModule.getAllCategories;
            } catch (importError) {
              res.status(200).json({
                jsonrpc: '2.0',
                id: body.id,
                error: {
                  code: -32603,
                  message: `Failed to load news sources: ${(importError as Error).message}`,
                },
              });
              return;
            }
          }

          const category = args?.category;
          const sources = category && getSourcesByCategory 
            ? getSourcesByCategory(category) 
            : NEWS_SOURCES;
          
          const categories = getAllCategories ? getAllCategories() : [];
          
          const result = `# Available News Sources${category ? ` (Category: ${category})` : ''}\n\n` +
            `Total: ${sources.length} sources\n\n` +
            sources.map((source, i) => 
              `${i + 1}. **${source.name}**\n` +
              `   - Category: ${source.category}\n` +
              `   - Language: ${source.language}\n` +
              `   - URL: ${source.url}\n` +
              `   - Verified: ${source.verified ? '✅' : '❌'}\n`
            ).join('\n') +
            `\n\nAvailable categories: ${categories.join(', ') || 'N/A'}`;

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
          // Lazy load if not already loaded
          if (!newsSourcesLoaded) {
            await loadNewsSources();
          }

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

          if (!getSourcesByCategory) {
            res.status(200).json({
              jsonrpc: '2.0',
              id: body.id,
              error: {
                code: -32603,
                message: 'News sources module not loaded',
              },
            });
            return;
          }

          const sources = getSourcesByCategory(category);
          
          if (sources.length === 0) {
            const categories = getAllCategories ? getAllCategories() : [];
            res.status(200).json({
              jsonrpc: '2.0',
              id: body.id,
              error: {
                code: -32602,
                message: `No sources found for category: ${category}. Available categories: ${categories.join(', ') || 'N/A'}`,
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
          // Lazy load if not already loaded
          if (!newsSourcesLoaded) {
            await loadNewsSources();
          }

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

          if (!getSourceByName) {
            res.status(200).json({
              jsonrpc: '2.0',
              id: body.id,
              error: {
                code: -32603,
                message: 'News sources module not loaded',
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

      // Get article content by URL
      if (name === 'get_article_content') {
        try {
          const articleUrl = args?.article_url;
          
          if (!articleUrl) {
            res.status(200).json({
              jsonrpc: '2.0',
              id: body.id,
              error: {
                code: -32602,
                message: 'article_url is required',
              },
            });
            return;
          }

          // Validate URL
          try {
            new URL(articleUrl);
          } catch {
            res.status(200).json({
              jsonrpc: '2.0',
              id: body.id,
              error: {
                code: -32602,
                message: 'Invalid URL format',
              },
            });
            return;
          }

          // Fetch article HTML (server-side, no CORS issues)
          const response = await fetch(articleUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; Web3News-MCP/1.0)',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
            signal: AbortSignal.timeout(20000), // 20 second timeout
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const html = await response.text();

          // Parse HTML to extract article content
          const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
          const title = titleMatch?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim() || 'Untitled';

          const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                           html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
          const excerpt = descMatch?.[1] || '';

          const authorMatch = html.match(/<meta[^>]*name=["']author["'][^>]*content=["']([^"']+)["']/i) ||
                             html.match(/<meta[^>]*property=["']article:author["'][^>]*content=["']([^"']+)["']/i);
          const byline = authorMatch?.[1] || '';

          // Extract article content
          const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
                             html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ||
                             html.match(/<div[^>]*class=["'][^"']*article[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) ||
                             html.match(/<div[^>]*class=["'][^"']*content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);

          let content = articleMatch?.[1] || html;

          // Clean content
          content = content
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/<style[\s\S]*?<\/style>/gi, '')
            .replace(/<nav[\s\S]*?<\/nav>/gi, '')
            .replace(/<header[\s\S]*?<\/header>/gi, '')
            .replace(/<footer[\s\S]*?<\/footer>/gi, '')
            .replace(/<aside[\s\S]*?<\/aside>/gi, '');

          const textContent = content.replace(/<[^>]*>/g, '').trim();
          const length = textContent.length;
          const siteName = new URL(articleUrl).hostname.replace('www.', '');

          // Return as JSON string (MCP format)
          const result = JSON.stringify({
            success: true,
            title,
            content,
            textContent,
            excerpt,
            byline,
            length,
            siteName,
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
              message: `Error fetching article: ${error.message || 'Unknown error'}`,
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
