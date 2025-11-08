# GitHub Repository Setup Guide for MCP Server

## 📋 GitHub Repo Settings Configuration

### 1. **General Settings**

Go to: `https://github.com/clkhoo5211/web3news-mcp-server/settings`

#### **Repository Name**
- ✅ Already set: `web3news-mcp-server`

#### **Default Branch**
- Set to: `main` (or `master` if you prefer)
- Location: Settings → General → Default branch

#### **Features**
Enable these features:
- ✅ **Issues** - For bug tracking
- ✅ **Pull requests** - For contributions
- ✅ **Discussions** - Optional, for community
- ✅ **Projects** - Optional, for project management
- ✅ **Wiki** - Optional

#### **Merge Button**
- ✅ **Allow merge commits**
- ✅ **Allow squash merging**
- ✅ **Allow rebase merging**
- ✅ **Allow auto-merge** (recommended)

### 2. **Actions Settings**

Go to: Settings → Actions → General

#### **Actions Permissions**
- Select: **Allow all actions and reusable workflows**
- Or: **Allow local actions and reusable workflows** (more secure)

#### **Workflow Permissions**
- Select: **Read and write permissions**
- ✅ **Allow GitHub Actions to create and approve pull requests**

### 3. **Secrets and Variables**

Go to: Settings → Secrets and variables → Actions

**For Basic RSS Server:**
- No secrets needed initially
- Add later if you need API keys or tokens

**If Needed Later:**
- Click "New repository secret"
- Add name: `MCP_API_KEY` (example)
- Add value: `your-secret-value`

### 4. **Pages Settings** (Not Needed for Vercel)

- Skip this section (we're using Vercel, not GitHub Pages)

### 5. **Deploy Keys** (Optional)

If you need CI/CD from other services:
- Go to: Settings → Deploy keys
- Add deploy key if needed

### 6. **Webhooks** (For Vercel Auto-Deploy)

Vercel will automatically add webhooks when you connect the repo.

To verify:
- Go to: Settings → Webhooks
- You should see a Vercel webhook after connecting

## 🚀 Initial Push Commands

Run these commands in the `web3news-mcp-server` directory:

```bash
# Navigate to MCP server directory
cd /Users/khoo/Downloads/project4/projects/web3news-mcp-server

# Initialize Git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial MCP server setup for Vercel deployment"

# Add remote repository
git remote add origin https://github.com/clkhoo5211/web3news-mcp-server.git

# Push to GitHub
git push -u origin main
```

**If you get an error about branch name:**
```bash
# Check current branch
git branch

# If it's 'master', rename to 'main'
git branch -M main

# Then push
git push -u origin main
```

## ✅ Verification Checklist

After pushing:

- [ ] Repository is not empty
- [ ] Files are visible: `vercel.json`, `api/index.py`, `requirements.txt`, `README.md`
- [ ] Default branch is set to `main`
- [ ] Actions are enabled (if you want CI/CD)
- [ ] Repository is public (or private if you prefer)

## 🔗 Next Steps

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import `web3news-mcp-server`
   - Deploy

2. **Get Deployment URL:**
   - After deployment, copy the URL
   - Format: `https://web3news-mcp-server.vercel.app`

3. **Update React App:**
   - Add to `.env.local`:
     ```bash
     VITE_MCP_SERVER_URL=https://web3news-mcp-server.vercel.app
     ```

## 📝 Important Notes

- **Separate Repository:** This is a completely separate repo from your main React app
- **Independent Deployment:** MCP server deploys independently on Vercel
- **No Submodules:** We're NOT using Git submodules (to avoid deployment issues)
- **Clean Structure:** Each repo has its own purpose and deployment

