#!/bin/bash

# Automated GitHub Setup Script
# This helps set up the repo and add collaborator

set -e

echo "🚀 ReThread GitHub Setup"
echo "========================"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "⚠️  GitHub CLI (gh) not installed"
    echo "Install it: brew install gh"
    echo "Or do manual setup (see QUICK_START.md)"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "🔐 Authenticating with GitHub..."
    gh auth login
fi

# Get repo name
REPO_NAME="ReThread"
USERNAME=$(gh api user --jq .login)

echo "📦 Creating GitHub repository: $USERNAME/$REPO_NAME"
echo ""

# Create repo (if doesn't exist)
if gh repo view "$USERNAME/$REPO_NAME" &> /dev/null; then
    echo "✅ Repository already exists"
else
    gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
    echo "✅ Repository created and pushed"
fi

# Create data directory and file
if [ ! -f "data/dashboard.json" ]; then
    echo "📁 Creating data/dashboard.json..."
    mkdir -p data
    echo '{}' > data/dashboard.json
    git add data/
    git commit -m "Add data directory for dashboard storage" || true
    git push || true
    echo "✅ Data directory created"
fi

# Add collaborator
echo ""
echo "👥 Adding collaborator: taleb52@gmail.com"
gh api repos/$USERNAME/$REPO_NAME/collaborators/taleb52@gmail.com \
    -X PUT \
    -f permission=admin \
    || echo "⚠️  Could not add collaborator automatically. Add manually via GitHub web UI."

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Get GitHub token: https://github.com/settings/tokens"
echo "2. Deploy to Netlify: https://app.netlify.com"
echo "3. Add VITE_GITHUB_TOKEN in Netlify environment variables"
echo ""
echo "See QUICK_START.md for detailed instructions"
