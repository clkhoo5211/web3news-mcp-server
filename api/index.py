import json

# Vercel Python serverless function handler
# Minimal handler that should work with Vercel's Python runtime
def handler(request):
    """
    Vercel serverless function entry point.
    Returns a response dictionary.
    """
    try:
        # Get path from request - Vercel passes request as dict
        path = '/'
        if isinstance(request, dict):
            path = request.get('path', '/')
            # Also check url field
            if 'url' in request:
                from urllib.parse import urlparse
                parsed = urlparse(request['url'])
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
                    'message': 'MCP server is ready. RSS feed fetching available.',
                    'endpoint': '/sse',
                    'version': '1.0.0',
                    'path': path
                })
            }
        else:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Not Found', 'path': path})
            }
    except Exception as e:
        # Return error with details for debugging
        import traceback
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({
                'error': 'Internal Server Error',
                'message': str(e),
                'type': type(e).__name__,
                'traceback': traceback.format_exc()
            })
        }
