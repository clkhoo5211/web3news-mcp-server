# Vercel Deployment Troubleshooting Guide

## Current Status

The deployment is returning a 500 error. Here's how to diagnose and fix it.

## Step 1: Check Vercel Logs

1. Go to: https://vercel.com/dashboard
2. Click on your `web3news-mcp-server` project
3. Go to **"Deployments"** tab
4. Click on the latest deployment
5. Click **"Functions"** tab
6. Look for error messages in the logs

**Common errors to look for:**
- Import errors
- Handler format issues
- Missing dependencies
- Python version mismatches

## Step 2: Verify Handler Format

Vercel Python functions should have a `handler` function. Current format:

```python
def handler(req, res=None):
    # Returns dict with statusCode, headers, body
    # OR uses res object if provided
```

## Step 3: Test Locally

```bash
cd /Users/khoo/Downloads/project4/projects/web3news-mcp-server
python3 -c "import sys; sys.path.insert(0, 'api'); import index; result = index.handler({'path': '/'}); print(result)"
```

Should return: `{'statusCode': 200, ...}`

## Step 4: Check Vercel Build Logs

In Vercel dashboard:
1. Go to deployment
2. Check **"Build Logs"** tab
3. Look for:
   - Python installation
   - Dependency installation (`pip install -r requirements.txt`)
   - Any build errors

## Step 5: Verify vercel.json

Current `vercel.json`:
```json
{
  "version": 2,
  "builds": [{"src": "api/index.py", "use": "@vercel/python"}],
  "routes": [
    {"src": "/sse", "dest": "api/index.py"},
    {"src": "/", "dest": "api/index.py"}
  ],
  "env": {"PYTHON_VERSION": "3.10"}
}
```

## Possible Issues

### Issue 1: Handler Format
Vercel might expect a different format. Try:

```python
def handler(request):
    return {
        'statusCode': 200,
        'body': '{"status": "ok"}'
    }
```

### Issue 2: Missing Dependencies
Check if `requirements.txt` is being read:
- File should be in root directory ✅
- Dependencies should be listed ✅

### Issue 3: Python Version
Verify Python 3.10 is available in Vercel.

## Quick Fix: Minimal Handler

If still failing, try this minimal version:

```python
def handler(req):
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': '{"status": "ok"}'
    }
```

## Next Steps

1. **Check Vercel logs** (most important!)
2. Share the error message from logs
3. We can fix based on the actual error

## Alternative: Use Vercel CLI

Test locally with Vercel CLI:

```bash
npm i -g vercel
vercel dev
```

This will simulate Vercel environment locally.

