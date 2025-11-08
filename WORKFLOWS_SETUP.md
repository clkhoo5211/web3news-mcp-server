# GitHub Actions Workflows

## ✅ Workflows Created

Two GitHub Actions workflows have been created:

### 1. **CI Workflow** (`.github/workflows/ci.yml`)
- ✅ Runs on every push and pull request
- ✅ Validates Python code
- ✅ Checks syntax, linting, formatting
- ✅ Validates configuration files
- ✅ **No secrets required**

### 2. **Deploy Workflow** (`.github/workflows/deploy.yml`)
- ✅ Runs on push to main/master
- ✅ Deploys to Vercel
- ⚠️ **Requires Vercel secrets** (optional)

## 🎯 Recommended Setup

**Since you already imported to Vercel, Vercel will auto-deploy on push.**

**Recommended:** Keep CI workflow, disable deploy workflow

1. ✅ **CI workflow** - Validates your code (no secrets needed)
2. ❌ **Deploy workflow** - Optional (Vercel already auto-deploys)

## 📋 Next Steps

### Option A: Use Vercel Auto-Deploy (Recommended)

1. **Push the workflows:**
   ```bash
   cd /Users/khoo/Downloads/project4/projects/web3news-mcp-server
   git add .github/
   git commit -m "Add GitHub Actions workflows"
   git push origin main
   ```

2. **Verify CI runs:**
   - Go to: https://github.com/clkhoo5211/web3news-mcp-server/actions
   - Should see CI workflow running

3. **Vercel will auto-deploy** (already configured)

### Option B: Use GitHub Actions for Deployment

If you want GitHub Actions to deploy instead:

1. **Get Vercel credentials:**
   - Token: https://vercel.com/account/tokens
   - Org ID & Project ID: From Vercel project settings

2. **Add GitHub secrets:**
   - Go to: https://github.com/clkhoo5211/web3news-mcp-server/settings/secrets/actions
   - Add: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

3. **Push workflows:**
   ```bash
   git add .github/
   git commit -m "Add GitHub Actions workflows"
   git push origin main
   ```

## 📄 Documentation

See `.github/workflows/README.md` for detailed setup instructions.

