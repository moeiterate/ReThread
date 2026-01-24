# Quick Start - Deploy ReThread in 5 Minutes

## What You Need
1. GitHub account (free)
2. Netlify account (free)
3. 5 minutes

## Step-by-Step (Minimal Manual Work)

### 1. Create GitHub Token (2 min)
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name: `ReThread Dashboard`
4. Check ✅ **`repo`** scope
5. Click **"Generate token"**
6. **Copy the token** (save it somewhere)

### 2. Push to GitHub (1 min)
Run these commands in your terminal:

```bash
cd /Users/moazelhag/Desktop/VSCode/ReThread

# Create data directory
mkdir -p data
echo '{}' > data/dashboard.json

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: ReThread internal app"

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/ReThread.git
git branch -M main
git push -u origin main
```

**Note:** Replace `YOUR_USERNAME` with your actual GitHub username.

### 3. Deploy to Netlify (1 min)
1. Go to: https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Click **"GitHub"** → Authorize Netlify
4. Select **"ReThread"** repository
5. Netlify auto-detects:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click **"Deploy site"**
7. Wait 2 minutes
8. **Copy your live URL** (e.g., `rethread-abc123.netlify.app`)

### 4. Add GitHub Token to Netlify (1 min)
1. In Netlify, go to your site → **Site settings** → **Environment variables**
2. Click **"Add variable"**
3. Key: `VITE_GITHUB_TOKEN`
4. Value: `paste_your_token_here`
5. Click **"Save"**
6. Go to **Deploys** tab → **"Trigger deploy"** → **"Clear cache and deploy site"**

### 5. Share with Ahmad (30 sec)
1. Go to: https://github.com/YOUR_USERNAME/ReThread/settings/access
2. Click **"Add people"**
3. Enter: `taleb52@gmail.com`
4. Select role: **Admin**
5. Click **"Add USERNAME"**
6. Ahmad gets email invite

## Done! 🎉

**Your live app:** `https://your-app-name.netlify.app`

**How it works:**
- Dashboard edits → Saved to GitHub → Both see updates
- Ahmad can edit → Changes sync automatically
- Free forever (Netlify + GitHub free tiers)

## Troubleshooting

**"GitHub token not configured":**
- Make sure `VITE_GITHUB_TOKEN` is in Netlify environment variables
- Redeploy after adding it

**"Failed to save":**
- Check that `data/dashboard.json` exists in your GitHub repo
- Verify token has `repo` scope

**Ahmad can't edit:**
- Make sure he accepted GitHub collaborator invite
- He can use the Netlify URL (no local setup needed)
