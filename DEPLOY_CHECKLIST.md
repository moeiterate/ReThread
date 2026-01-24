# Deployment Checklist - Do These 5 Things

## ✅ Step 1: Create GitHub Token (2 min)
- [ ] Go to: https://github.com/settings/tokens
- [ ] Click "Generate new token (classic)"
- [ ] Name: `ReThread Dashboard`
- [ ] Check ✅ `repo` scope
- [ ] Generate and **COPY TOKEN** (save it!)

## ✅ Step 2: Push Code to GitHub (2 min)
Run these commands:

```bash
cd /Users/moazelhag/Desktop/VSCode/ReThread

# Create data file (if not exists)
mkdir -p data && echo '{}' > data/dashboard.json

# Add and commit
git add .
git commit -m "Initial commit: ReThread internal app"

# Create repo on GitHub first (via web UI), then:
git remote add origin https://github.com/YOUR_USERNAME/ReThread.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username**

## ✅ Step 3: Deploy to Netlify (1 min)
- [ ] Go to: https://app.netlify.com
- [ ] "Add new site" → "Import from GitHub"
- [ ] Select "ReThread" repo
- [ ] Click "Deploy" (auto-detects settings)
- [ ] Wait 2 minutes
- [ ] **COPY YOUR LIVE URL**

## ✅ Step 4: Add GitHub Token (1 min)
- [ ] In Netlify: Site settings → Environment variables
- [ ] Add: `VITE_GITHUB_TOKEN` = `paste_your_token`
- [ ] Save
- [ ] Deploys → Trigger deploy → Clear cache and deploy

## ✅ Step 5: Share with Ahmad (30 sec)
- [ ] Go to: https://github.com/YOUR_USERNAME/ReThread/settings/access
- [ ] "Add people" → Enter `taleb52@gmail.com`
- [ ] Role: **Admin**
- [ ] Add

## 🎉 Done!

**Live URL:** `https://your-app.netlify.app`

**Test it:**
1. Open Dashboard
2. Click "Edit"
3. Make a change
4. Click "Save"
5. Refresh page → Should see your change

**Ahmad can:**
- Access the live URL
- Edit Dashboard
- See your changes in real-time
