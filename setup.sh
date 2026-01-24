#!/bin/bash

# ReThread Setup Script
# This script helps set up the project for deployment

echo "🚀 ReThread Setup Script"
echo "========================"
echo ""

# Create data directory if it doesn't exist
if [ ! -d "data" ]; then
    echo "📁 Creating data directory..."
    mkdir -p data
    echo '{}' > data/dashboard.json
    echo "✅ Created data/dashboard.json"
else
    echo "✅ Data directory already exists"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  .env file not found"
    echo "Create a .env file with:"
    echo "  VITE_GITHUB_TOKEN=your_token_here"
    echo ""
    echo "Get token from: https://github.com/settings/tokens"
    echo "Required scope: repo"
else
    echo "✅ .env file exists"
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo ""
    echo "⚠️  Git not initialized"
    echo "Run: git init"
else
    echo "✅ Git repository initialized"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Push to GitHub: git add . && git commit -m 'Initial commit' && git push"
echo "2. Deploy to Netlify: https://netlify.com → Import from GitHub"
echo "3. Add VITE_GITHUB_TOKEN in Netlify environment variables"
echo "4. Share repo with ahmad@taleb52@gmail.com as collaborator"
echo ""
echo "See DEPLOYMENT.md for detailed instructions"
