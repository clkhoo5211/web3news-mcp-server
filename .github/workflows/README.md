# GitHub Actions Workflows Setup Guide

## 📋 Overview

This repository includes two GitHub Actions workflows:

1. **CI Workflow** (`.github/workflows/ci.yml`)
   - Runs on every push and pull request
   - Tests code syntax, linting, and validation
   - No secrets required

2. **Deploy Workflow** (`.github/workflows/deploy.yml`)
   - Runs on push to main/master
   - Deploys to Vercel
   - Requires Vercel secrets (optional - Vercel auto-deploy works too)

## 🔧 Setup Instructions

### Option 1: Use Vercel Auto-Deploy (Recommended)

**Vercel automatically deploys on push** - you don't need the deploy workflow!

1. ✅ Already done: You imported the repo to Vercel
2. ✅ Vercel will auto-deploy on every push
3. ✅ No GitHub secrets needed

**Keep only the CI workflow** - it validates your code before deployment.

### Option 2: Use GitHub Actions for Deployment (Optional)

If you want GitHub Actions to handle deployment instead of Vercel auto-deploy:

#### Step 1: Get Vercel Credentials

1. Go to [Vercel Dashboard](https://vercel.com/account/tokens)
2. Create a new token → Copy the token
3. Go to your project settings → Copy:
   - **Organization ID** (from URL or settings)
   - **Project ID** (from project settings)

#### Step 2: Add GitHub Secrets

Go to: `https://github.com/clkhoo5211/web3news-mcp-server/settings/secrets/actions`

Click **"New repository secret"** and add:

1. **Name:** `VERCEL_TOKEN`
   - **Value:** Your Vercel token from step 1

2. **Name:** `VERCEL_ORG_ID`
   - **Value:** Your Vercel organization ID

3. **Name:** `VERCEL_PROJECT_ID`
   - **Value:** Your Vercel project ID

#### Step 3: Enable Workflow

The deploy workflow will automatically run on push to `main`.

## 📊 Workflow Details

### CI Workflow (Always Runs)

**Triggers:**
- Push to `main` or `master`
- Pull requests to `main` or `master`

**Checks:**
- ✅ Python syntax validation
- ✅ Code linting (flake8)
- ✅ Code formatting check (black)
- ✅ Type checking (mypy)
- ✅ Validates `vercel.json`
- ✅ Validates `requirements.txt`
- ✅ Tests imports

**No secrets required** - safe to run on all PRs.

### Deploy Workflow (Optional)

**Triggers:**
- Push to `main` or `master`
- Manual trigger (workflow_dispatch)

**Actions:**
- Installs Vercel CLI
- Pulls environment variables
- Builds the project
- Deploys to Vercel production

**Requires secrets:** `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

## 🎯 Recommended Setup

**For most users:** Use Vercel auto-deploy + CI workflow

1. ✅ Keep CI workflow (validates code)
2. ❌ Delete or disable deploy workflow (Vercel handles deployment)
3. ✅ No secrets needed

**Benefits:**
- Simpler setup
- Vercel handles deployment automatically
- CI validates code quality
- No secret management needed

## 🚀 Testing Workflows

### Test CI Workflow

```bash
# Make a small change and push
git add .
git commit -m "Test CI workflow"
git push origin main
```

Check: `https://github.com/clkhoo5211/web3news-mcp-server/actions`

### Test Deploy Workflow (if enabled)

```bash
# Push to main
git push origin main
```

Or manually trigger:
- Go to Actions tab
- Select "Deploy to Vercel"
- Click "Run workflow"

## 📝 Workflow Status Badge

Add to your `README.md`:

```markdown
![CI](https://github.com/clkhoo5211/web3news-mcp-server/workflows/CI/badge.svg)
```

## ⚠️ Troubleshooting

### CI Workflow Fails

- Check Python version (should be 3.10+)
- Verify `requirements.txt` is valid
- Check code syntax errors

### Deploy Workflow Fails

- Verify all three secrets are set correctly
- Check Vercel token is valid
- Ensure project is linked in Vercel dashboard

### Vercel Auto-Deploy Not Working

- Check Vercel dashboard → Project Settings → Git
- Verify repository is connected
- Check deployment logs in Vercel

## ✅ Checklist

- [x] CI workflow created (`.github/workflows/ci.yml`)
- [x] Deploy workflow created (`.github/workflows/deploy.yml`)
- [ ] Choose: Vercel auto-deploy OR GitHub Actions deploy
- [ ] If using GitHub Actions: Add Vercel secrets
- [ ] Push code to test workflows
- [ ] Verify workflows run successfully

