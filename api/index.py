from mcp.server.fastmcp import FastMCP
import feedparser
import httpx
import html2text
import re
from typing import Optional

# Initialize MCP server
mcp = FastMCP("Web3News RSS Reader")

async def fetch_rss_feed(url: str):
    """Fetch and parse an RSS feed."""
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(url)
        response.raise_for_status()
        return feedparser.parse(response.text)

@mcp.tool()
async def get_rss_feed(feed_url: str) -> str:
    """
    Retrieve the content of the specified RSS feed.
    
    Parameters:
        feed_url (str): The URL of the RSS feed to fetch (e.g., 'https://cointelegraph.com/rss').
    
    Returns:
        str: A formatted Markdown string containing the feed title and up to 10 latest entries.
    """
    try:
        feed = await fetch_rss_feed(feed_url)
        entries = feed.entries[:10]  # Limit to the latest 10 entries
        
        # Initialize html2text converter
        h = html2text.HTML2Text()
        h.body_width = 0  # Disable line wrapping
        h.ignore_links = True  # Ignore links in summary
        h.ignore_images = True  # Ignore images in summary
        h.inline_links = False
        h.mark_code = False
        h.use_automatic_links = False
        h.skip_internal_headers = True
        
        result = f"# Feed: {feed.feed.get('title', 'Unknown')}\n\n"
        for i, entry in enumerate(entries):
            summary_text = h.handle(entry.get('summary', '')).strip() if entry.get('summary') else ''
            # Post-process to demote ## headers to ### in summary
            summary_text = re.sub(r'^\s*##\s+(.+)$', r'### \1', summary_text, flags=re.MULTILINE)
            
            result += f"## Entry {i + 1}\n"
            result += f"- **Title**: {entry.get('title', 'No title')}\n"
            result += f"- **Link**: [{entry.get('link', '#')}]({entry.get('link', '#')})\n"
            result += f"- **Published**: {entry.get('published', 'Unknown date')}\n"
            if summary_text:
                result += f"- **Summary**: {summary_text}\n"
            result += "\n"
        
        return result
    except Exception as e:
        return f"Error fetching RSS feed: {str(e)}"

# Vercel serverless function handler
def handler(request):
    """
    Vercel serverless function entry point.
    FastMCP handles SSE transport automatically.
    """
    # For Vercel, we need to return a response
    # FastMCP will handle the SSE connection
    return mcp.run(transport="sse")

# Export handler for Vercel
__all__ = ['handler']

