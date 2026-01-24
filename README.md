# ReThread Internal Planning App

Internal strategy, planning, and operations dashboard for ReThread.

## Features

- ✅ **Editable Dashboard** - Real-time collaborative editing via GitHub API
- ✅ **Strategic Roadmap** - Sprint-based planning view
- ✅ **Trello Integration** - Embedded board preview
- ✅ **Slack Integration** - Live message feed (optional)
- ✅ **Free Hosting** - Deploy to Netlify (free forever)

## Quick Deploy

See **[QUICK_START.md](./QUICK_START.md)** for step-by-step deployment instructions.

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- GitHub API (for data storage)
- Netlify (hosting)

## Project Structure

```
src/
  ├── pages/
  │   ├── Dashboard.tsx    # Editable strategy document
  │   ├── Roadmap.tsx      # Sprint roadmap
  │   ├── Backlog.tsx      # Trello board embed
  │   └── Communications.tsx # Slack integration
  ├── components/
  │   ├── Layout.tsx       # App layout with sidebar
  │   └── Sidebar.tsx      # Navigation
  └── services/
      └── github.ts        # GitHub API integration
```

## Environment Variables

Create `.env` file:

```bash
VITE_GITHUB_TOKEN=your_github_token_here
VITE_SLACK_BOT_TOKEN=xoxb-your-slack-token-here  # Optional
```

## Development

```bash
npm install
npm run dev
```

## Deployment

1. Push to GitHub
2. Deploy to Netlify (auto-detects Vite)
3. Add `VITE_GITHUB_TOKEN` in Netlify environment variables
4. Share repo with collaborators

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for detailed instructions.

## Collaboration

- Dashboard edits are saved to `data/dashboard.json` in GitHub
- Both collaborators can edit simultaneously
- Changes sync automatically (refresh to see updates)
- Full edit history in GitHub commits

## License

Internal use only.
