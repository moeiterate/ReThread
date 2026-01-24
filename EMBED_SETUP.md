# Embedding Setup Guide

## Trello Board Embed

**Status:** ✅ Ready to use (board must be public)

### Steps:
1. Go to your Trello board: https://trello.com/b/m47dQixP/rethread-sprint-board
2. Click **"Board"** → **"Settings"** → **"Visibility"**
3. Change visibility to **"Public"**
4. Refresh the Backlog page - the board preview will render automatically

**Note:** Trello blocks embedding the full interactive board in an iframe (you’ll see “refused to connect”).
The app uses Trello’s official embed script, which renders a **compact preview**. Use the “Open Full Board”
button for editing.

---

## Slack Messages Widget

**Status:** ⚙️ Requires API setup (optional)

### Steps to Enable Message Widget:

1. **Create Slack App:**
   - Go to https://api.slack.com/apps
   - Click **"Create New App"** → **"From scratch"**
   - Name it "ReThread Internal" and select your workspace

2. **Add Bot Scopes:**
   - Go to **"OAuth & Permissions"** in sidebar
   - Scroll to **"Scopes"** → **"Bot Token Scopes"**
   - Add these scopes:
     - `channels:history` (View messages in channels)
     - `users:read` (View people in workspace)

3. **Install App:**
   - Scroll up and click **"Install to Workspace"**
   - Authorize the app

4. **Get Bot Token:**
   - After installation, you'll see **"Bot User OAuth Token"**
   - Copy the token (starts with `xoxb-`)

5. **Add to Environment:**
   - Create a `.env` file in the project root
   - Add: `VITE_SLACK_BOT_TOKEN=xoxb-your-token-here`
   - Restart your dev server (`npm run dev`)

6. **For Production (Vercel):**
   - Go to Vercel dashboard → Your project → Settings → Environment Variables
   - Add: `VITE_SLACK_BOT_TOKEN` with your token value
   - Redeploy

**Note:** Without the token, the widget will show a link to open Slack instead. The embed still works, just without live messages.

---

## Current Configuration

- **Trello Board URL:** `https://trello.com/b/m47dQixP/rethread-sprint-board`
- **Slack Workspace ID:** `T0AAME65N1L`
- **Standup Channel ID:** `C0ABHRD0L9E`
