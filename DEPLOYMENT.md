# Deployment Guide - ReThread Internal App

## Quick Deploy to Netlify (Free, No Manual Steps)

### Step 1: Push to GitHub

```bash
# Make sure you're in the project directory
cd /Users/moazelhag/Desktop/VSCode/ReThread

# Add all files
git add .

# Commit
git commit -m "Initial commit: ReThread internal planning app"

# Create repo on GitHub (if not exists) and push
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/ReThread.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com) and sign up/login (free)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub
4. Select your **ReThread** repository
5. Netlify will auto-detect settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click **"Deploy site"**
7. Wait 2-3 minutes for build to complete
8. **Copy your live URL** (e.g., `rethread-xyz123.netlify.app`)

### Step 3: Add GitHub Token for Real-Time Collaboration

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **"Generate new token (classic)"**
3. Name it: `ReThread Dashboard`
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)

7. In Netlify:
   - Go to your site → **Site settings** → **Environment variables**
   - Add: `VITE_GITHUB_TOKEN` = `your_token_here`
   - Click **"Save"**
   - Go to **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

### Step 4: Share Repo with Ahmad

1. Go to your GitHub repo: `https://github.com/YOUR_USERNAME/ReThread`
2. Click **Settings** → **Collaborators** → **Add people**
3. Enter: `taleb52@gmail.com`
4. Select role: **Admin** (so he can push changes)
5. Click **"Add USERNAME to this repository"**
6. Ahmad will get an email invite

### Step 5: Create Data Directory

The app needs a `data/` folder in your repo:

```bash
# In your project directory
mkdir -p data
echo '{}' > data/dashboard.json
git add data/
git commit -m "Add data directory for dashboard storage"
git push
```

## How It Works

- **Dashboard edits** → Saved to `data/dashboard.json` in GitHub
- **Both you and Ahmad** can edit → Changes sync via GitHub API
- **Real-time updates** → Refresh page to see latest changes
- **Free hosting** → Netlify free tier (unlimited)

## Troubleshooting

**"GitHub token not configured" error:**
- Make sure `VITE_GITHUB_TOKEN` is set in Netlify environment variables
- Redeploy after adding the token

**"Failed to save" error:**
- Check that `data/dashboard.json` exists in your repo
- Verify GitHub token has `repo` scope
- Check browser console for detailed error

**Ahmad can't edit:**
- Make sure he accepted the GitHub collaborator invite
- He needs to add `VITE_GITHUB_TOKEN` to his local `.env` file (for local dev) or use the deployed Netlify version

## Local Development

Create `.env` file:
```
VITE_GITHUB_TOKEN=your_github_token_here
```

Then run:
```bash
npm run dev
```
