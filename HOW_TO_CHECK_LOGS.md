# How to Check Vercel Runtime Logs

## 🔍 Check Runtime Logs to See the Actual Error

The function exists but is crashing. To see WHY it's crashing:

### Step 1: Open Runtime Logs
1. Go to: https://vercel.com/dashboard
2. Click on your `web3news-mcp-server` project
3. Click on the latest deployment (the one showing the error)
4. Scroll down to **"Runtime Logs"** section (bottom left)
5. Click on it to expand

### Step 2: Look for Error Messages
The logs will show:
- Python traceback errors
- Import errors
- Handler invocation errors
- Any exceptions

### Step 3: Common Errors to Look For

**Import Error:**
```
ModuleNotFoundError: No module named 'xyz'
```

**Handler Not Found:**
```
AttributeError: module 'index' has no attribute 'handler'
```

**Syntax Error:**
```
SyntaxError: invalid syntax
```

**Runtime Error:**
```
TypeError: ...
```

## 📋 What to Share

Please copy the error message from Runtime Logs and share it. That will tell us exactly what's wrong!

## 🔄 Alternative: Check Function Tab

1. In the deployment page, click **"Functions"** tab
2. Look for error messages there
3. Click on the function to see detailed logs

The actual error message will help us fix it!

