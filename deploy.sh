#!/bin/bash

# Prompt Goat - Quick Deployment Script
# This script helps you deploy Prompt Goat to Netlify

set -e

echo "🐐 Prompt Goat - Deployment Helper"
echo "=================================="
echo ""

# Check if git remote exists
if ! git remote | grep -q 'origin'; then
    echo "⚠️  No git remote 'origin' found."
    echo ""
    echo "Please create a GitHub repository and run:"
    echo "  git remote add origin YOUR_GITHUB_URL"
    echo "  git push -u origin main"
    echo ""
    exit 1
fi

echo "✅ Git remote found"
echo ""

# Check for required environment variables in .env
if [ ! -f .env ]; then
    echo "⚠️  No .env file found."
    echo ""
    echo "Please create .env file with:"
    echo "  DATABASE_URL=your_postgresql_url"
    echo "  NEXTAUTH_SECRET=your_secret_key"
    echo "  NEXTAUTH_URL=http://localhost:3000"
    echo ""
    echo "Run: cp .env.example .env"
    echo "Then edit .env with your values"
    echo ""
    exit 1
fi

echo "✅ .env file exists"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "✅ Dependencies installed"
echo ""

# Generate Prisma client
echo "🔨 Generating Prisma client..."
npm run prisma:generate
echo ""

echo "✅ Prisma client generated"
echo ""

# Test build
echo "🏗️  Testing build..."
if npm run build; then
    echo ""
    echo "✅ Build successful!"
    echo ""
else
    echo ""
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo "📤 Pushing to GitHub..."
git push origin main
echo ""

echo "✅ Code pushed to GitHub!"
echo ""
echo "🚀 Next Steps:"
echo "=============="
echo ""
echo "1. Go to https://app.netlify.com"
echo "2. Click 'Add new site' → 'Import an existing project'"
echo "3. Connect to GitHub and select this repository"
echo "4. Configure build settings:"
echo "   - Build command: npm run build"
echo "   - Publish directory: .next"
echo ""
echo "5. Set environment variables in Netlify:"
echo "   DATABASE_URL=<your_postgresql_url>"
echo "   NEXTAUTH_SECRET=<your_secret_key>"
echo "   NEXTAUTH_URL=https://your-site.netlify.app"
echo ""
echo "6. Deploy!"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo ""
