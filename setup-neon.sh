#!/bin/bash

echo "🐐 Prompt Goat - Neon Database Setup"
echo "====================================="
echo ""

# Check if DATABASE_URL is provided
if [ -z "$1" ]; then
    echo "❌ No DATABASE_URL provided"
    echo ""
    echo "Usage: ./setup-neon.sh 'YOUR_NEON_CONNECTION_STRING'"
    echo ""
    echo "Steps:"
    echo "1. Go to: https://console.neon.tech/app/projects"
    echo "2. Create new project named 'prompt-goat'"
    echo "3. Copy the connection string"
    echo "4. Run: ./setup-neon.sh 'postgresql://user:pass@host/db?sslmode=require'"
    echo ""
    exit 1
fi

DATABASE_URL="$1"

echo "📝 Creating .env file..."
cat > .env << EOF
DATABASE_URL=$DATABASE_URL
NEXTAUTH_SECRET=5ooRMkcwLRSWXJo35A8IJgvQpb9O7ggqKzK6Im6HrJU=
NEXTAUTH_URL=http://localhost:3000
EOF

echo "✅ .env file created"
echo ""

echo "🔨 Generating Prisma client..."
bun run prisma:generate
echo ""

echo "📊 Running database migrations..."
bun run prisma:migrate
echo ""

echo "🌱 Seeding database with example data..."
bun run prisma:seed
echo ""

echo "✅ Database setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Add DATABASE_URL to Netlify:"
echo "   https://app.netlify.com/sites/prompt-goat/settings/env"
echo ""
echo "2. Set these environment variables:"
echo "   DATABASE_URL=$DATABASE_URL"
echo "   NEXTAUTH_SECRET=5ooRMkcwLRSWXJo35A8IJgvQpb9O7ggqKzK6Im6HrJU="
echo "   NEXTAUTH_URL=https://prompt-goat.netlify.app"
echo ""
echo "3. Redeploy on Netlify:"
echo "   https://app.netlify.com/sites/prompt-goat/deploys"
echo ""
echo "4. Your site will be live! 🚀"
echo ""
