import json

# Vercel Python serverless function handler
# According to Vercel docs, handler receives (req, res) or just req
def handler(req, res=None):
    """
    Vercel serverless function entry point.
    If res is provided, use it. Otherwise return a dict.
    """
    try:
        # Handle both formats: (req, res) and (req)
        if res is not None:
            # Format with res object
            res.status(200).json({
                'status': 'MCP Server Running',
                'tools': ['get_rss_feed'],
                'message': 'MCP server is ready. RSS feed fetching available.',
                'endpoint': '/sse',
                'version': '1.0.0'
            })
            return
        
        # Format returning dict (for @vercel/python)
        # Get path from request
        if isinstance(req, dict):
            path = req.get('path', '/')
        else:
            path = '/'
        
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
        # Error handling
        if res is not None:
            res.status(500).json({'error': 'Internal Server Error', 'message': str(e)})
            return
        
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({
                'error': 'Internal Server Error',
                'message': str(e)
            })
        }
