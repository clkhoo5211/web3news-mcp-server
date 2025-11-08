# Vercel Python serverless function handler
# Ensure handler is properly defined and can handle any request format

def handler(request):
    """
    Vercel Python serverless function handler.
    This is the entry point for all requests.
    """
    try:
        # Return a simple success response
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': '{"status": "ok", "message": "MCP Server is running", "version": "1.0.0"}'
        }
    except Exception as e:
        # Return error response
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': f'{{"error": "Internal Server Error", "message": "{str(e)}"}}'
        }
