import json

# Vercel serverless function handler
# Vercel Python functions use a specific handler format
def handler(req):
    """
    Vercel serverless function entry point.
    Returns a response dictionary with statusCode and body.
    """
    try:
        # Get the path from the request
        # Vercel passes request as a dictionary
        path = req.get('path', '/') if isinstance(req, dict) else '/'
        
        # Handle root and SSE endpoint
        if path == '/sse' or path == '/':
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
                    'version': '1.0.0'
                })
            }
        else:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Not Found', 'path': path})
            }
    except Exception as e:
        # Return error response
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({
                'error': 'Internal Server Error',
                'message': str(e)
            })
        }

