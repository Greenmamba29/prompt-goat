# Prompt Goat - Netlify Deployment Guide

## Project Overview
Prompt Goat is a Next.js 14 application for managing AI prompts with:
- NextAuth authentication
- Prisma ORM with PostgreSQL
- TailwindCSS styling
- User subscriptions and premium content

## Prerequisites

### 1. PostgreSQL Database
You need a PostgreSQL database. Options:
- **Supabase** (recommended): Free tier available at https://supabase.com
- **Neon**: Serverless PostgreSQL at https://neon.tech
- **Railway**: https://railway.app
- **ElephantSQL**: https://www.elephantsql.com

### 2. Netlify Account
Sign up at https://netlify.com

## Deployment Steps

### Step 1: Initialize Git Repository
```bash
cd /Users/paco/prompt-goat-netlify
git init
git add .
git commit -m "Initial commit - Prompt Goat for Netlify"
```

### Step 2: Push to GitHub/GitLab
```bash
# Create a new repository on GitHub, then:
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

### Step 3: Set Up Database

#### Option A: Supabase (Recommended)
1. Go to https://supabase.com and create a new project
2. Wait for the database to provision
3. Go to Settings > Database
4. Copy the "Connection string" (URI mode)
5. Add `?schema=public` to the end

#### Option B: Neon
1. Go to https://neon.tech and create a new project
2. Copy the connection string
3. Add `?sslmode=require` to the end

### Step 4: Run Database Migrations

With your DATABASE_URL set locally:
```bash
# Create .env file
cp .env.example .env

# Edit .env with your database URL
# DATABASE_URL="postgresql://user:pass@host:5432/dbname?schema=public"

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed
```

### Step 5: Deploy to Netlify

#### Via Netlify UI:
1. Log into Netlify
2. Click "Add new site" > "Import an existing project"
3. Connect to your Git provider (GitHub/GitLab)
4. Select the prompt-goat-netlify repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: `18`

#### Environment Variables (CRITICAL):
Add these in Netlify UI under Site settings > Environment variables:

```
DATABASE_URL=postgresql://your-connection-string
NEXTAUTH_SECRET=your-generated-secret-key
NEXTAUTH_URL=https://your-app-name.netlify.app
```

To generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### Step 6: Install Netlify Next.js Plugin

The `netlify.toml` file already configures the Next.js plugin. Netlify will automatically install it.

### Step 7: Deploy!

Click "Deploy site" in Netlify. The build will:
1. Install dependencies
2. Generate Prisma client
3. Build Next.js application
4. Deploy to Netlify's CDN

## Post-Deployment

### Update NEXTAUTH_URL
After first deployment:
1. Copy your Netlify URL (e.g., `https://prompt-goat-xyz.netlify.app`)
2. Update the `NEXTAUTH_URL` environment variable in Netlify
3. Trigger a redeploy

### Custom Domain (Optional)
1. In Netlify: Site settings > Domain management
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain

## Database Management

### View Data
- Supabase: Use built-in Table Editor
- Others: Use Prisma Studio locally:
  ```bash
  npx prisma studio
  ```

### Run Migrations
For schema changes:
```bash
# Edit prisma/schema.prisma
npm run prisma:generate
npm run prisma:migrate
```

Then redeploy on Netlify.

## Troubleshooting

### Build Fails: "Prisma Client not found"
Add to build command in Netlify:
```
npx prisma generate && npm run build
```

### Database Connection Issues
- Ensure DATABASE_URL includes `?schema=public` or `?sslmode=require`
- Check database allows connections from Netlify IPs (usually 0.0.0.0/0 for serverless)
- Verify connection string is correct (test locally first)

### NextAuth Errors
- Ensure NEXTAUTH_SECRET is set and has at least 32 characters
- Ensure NEXTAUTH_URL matches your deployed URL exactly
- Check that your database has NextAuth tables (run migrations)

## Project Structure
```
prompt-goat-netlify/
├── src/
│   ├── app/              # Next.js 14 App Router
│   ├── components/       # React components
│   ├── lib/             # Utilities and configurations
│   └── types/           # TypeScript types
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed data
├── netlify.toml         # Netlify configuration
├── package.json         # Dependencies
└── next.config.js       # Next.js configuration
```

## Features to Configure

### Admin Account
After deployment, create an admin user in the database:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

### Subscription Plans
Seed data includes default plans. Customize in `prisma/seed.ts` before seeding.

## Maintenance

### Update Dependencies
```bash
npm update
git add package*.json
git commit -m "Update dependencies"
git push
```

### Backup Database
- Supabase: Automatic daily backups
- Others: Use pg_dump or provider's backup tools

## Support & Resources
- Next.js Docs: https://nextjs.org/docs
- Netlify Docs: https://docs.netlify.com
- Prisma Docs: https://www.prisma.io/docs
- NextAuth Docs: https://next-auth.js.org
