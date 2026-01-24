# ✅ GitHub Setup Complete!

## What's Done

1. ✅ **GitHub repo created:** https://github.com/moeiterate/ReThread
2. ✅ **Code pushed:** All files are on GitHub
3. ✅ **Clean history:** No secrets in commits

## Next Steps

### 1. Add Ahmad as Collaborator

**Option A: Via Web UI (Easiest)**
1. Go to: https://github.com/moeiterate/ReThread/settings/access
2. Click **"Add people"**
3. Enter Ahmad's **GitHub username** (not email - you'll need to ask him)
4. Select role: **Admin**
5. Click **"Add USERNAME"**

**Option B: Via CLI (If you know his username)**
```bash
gh api repos/moeiterate/ReThread/collaborators/AHMAD_USERNAME -X PUT -f permission=admin
```

### 2. Create GitHub Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name: `ReThread Dashboard`
4. Check ✅ **`repo`** scope
5. Click **"Generate token"**
6. **Copy the token** (save it!)

### 3. Deploy to Netlify

1. Go to: https://app.netlify.com
2. **"Add new site"** → **"Import from GitHub"**
3. Select **"ReThread"** repository
4. Netlify auto-detects:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **"Deploy site"**
6. Wait 2 minutes
7. **Copy your live URL**

### 4. Add GitHub Token to Netlify

1. In Netlify: Your site → **Site settings** → **Environment variables**
2. Click **"Add variable"**
3. Key: `VITE_GITHUB_TOKEN`
4. Value: `paste_your_token_here`
5. Click **"Save"**
6. Go to **Deploys** → **"Trigger deploy"** → **"Clear cache and deploy site"**

## Your Live App

Once deployed, your app will be at:
`https://your-app-name.netlify.app`

## How Collaboration Works

- **Dashboard edits** → Saved to `data/dashboard.json` in GitHub
- **Both you and Ahmad** can edit → Changes sync via GitHub API
- **Real-time updates** → Refresh page to see latest changes
- **Full history** → All edits tracked in GitHub commits

## Test It

1. Open Dashboard page
2. Click **"Edit"**
3. Make a change
4. Click **"Save"**
5. Refresh → Should see your change
6. Ahmad can do the same → You'll see his changes

---

**Repo URL:** https://github.com/moeiterate/ReThread
