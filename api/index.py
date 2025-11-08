# Minimal Vercel Python handler - test if function works at all
def handler(request):
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': '{"status": "ok", "message": "Handler is working!"}'
    }
