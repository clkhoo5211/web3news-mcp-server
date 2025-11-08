# Vercel Python serverless function handler
# Using the simplest possible format that Vercel expects

def handler(request):
    """
    Vercel Python serverless function handler.
    Must return a dict with statusCode, headers, and body.
    """
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        'body': '{"status": "ok", "message": "MCP Server is running"}'
    }
