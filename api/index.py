import json

# Vercel Python serverless function handler
# Based on Vercel's Python runtime documentation
def handler(request):
    """
    Vercel Python serverless function handler.
    The handler function is called by Vercel's Python runtime.
    """
    # Vercel passes request as a dictionary
    # Try to extract path from various possible fields
    path = '/'
    
    if isinstance(request, dict):
        # Try different possible fields
        path = request.get('path', request.get('url', '/'))
        if isinstance(path, str) and path.startswith('http'):
            from urllib.parse import urlparse
            parsed = urlparse(path)
            path = parsed.path
    
    # Handle root and SSE endpoint
    if path in ['/', '/sse']:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({
                'status': 'MCP Server Running',
                'tools': ['get_rss_feed'],
                'message': 'MCP server is ready.',
                'endpoint': '/sse',
                'version': '1.0.0',
                'request_type': str(type(request)),
                'request_keys': list(request.keys()) if isinstance(request, dict) else 'not a dict'
            })
        }
    else:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Not Found', 'path': path})
        }
