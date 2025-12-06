# Netlify Setup Instructions

## Your Project is Ready! 🎉

**GitHub Repository**: https://github.com/Greenmamba29/prompt-goat  
**NEXTAUTH_SECRET**: `5ooRMkcwLRSWXJo35A8IJgvQpb9O7ggqKzK6Im6HrJU=`

## Deploy to Netlify (3 minutes)

### Step 1: Import Project
1. Go to: https://app.netlify.com/start
2. Click "Import from Git"
3. Choose "GitHub"
4. Select repository: **Greenmamba29/prompt-goat**

### Step 2: Configure Build Settings
Netlify should auto-detect these from `netlify.toml`:
- **Build command**: `npx prisma generate && npm run build`
- **Publish directory**: `.next`
- **Site name**: `prompt-goat` (or choose your own)

### Step 3: Add Environment Variables
Click "Add environment variables" and add these **3 required variables**:

```
DATABASE_URL=postgresql://your-connection-string-here
NEXTAUTH_SECRET=5ooRMkcwLRSWXJo35A8IJgvQpb9O7ggqKzK6Im6HrJU=
NEXTAUTH_URL=https://prompt-goat.netlify.app
```

⚠️ **IMPORTANT**: You need a PostgreSQL database first!

### Option A: Use Supabase (Recommended - Free)
1. Go to https://supabase.com/dashboard
2. Create new project
3. Wait 2-3 minutes for provisioning
4. Go to Settings > Database
5. Copy "Connection string" (URI mode)
6. Add `?schema=public` to the end
7. Use this as your `DATABASE_URL`

### Option B: Use Neon (Also Free)
1. Go to https://neon.tech
2. Create new project  
3. Copy connection string
4. Add `?sslmode=require` to the end
5. Use this as your `DATABASE_URL`

### Step 4: Deploy!
Click "Deploy site"

Build will take 3-5 minutes. You'll see:
1. Installing dependencies
2. Generating Prisma client
3. Building Next.js app
4. Publishing to Netlify CDN

### Step 5: Run Database Migrations
After first deployment succeeds, you need to set up the database:

1. Install dependencies locally (if not done):
   ```bash
   cd /Users/paco/prompt-goat-netlify
   bun install
   ```

2. Create `.env` file:
   ```bash
   echo 'DATABASE_URL=your-database-url-here' > .env
   echo 'NEXTAUTH_SECRET=5ooRMkcwLRSWXJo35A8IJgvQpb9O7ggqKzK6Im6HrJU=' >> .env
   echo 'NEXTAUTH_URL=http://localhost:3000' >> .env
   ```

3. Run migrations:
   ```bash
   bun run prisma:generate
   bun run prisma:migrate
   ```

4. (Optional) Seed with example data:
   ```bash
   bun run prisma:seed
   ```

### Step 6: Update NEXTAUTH_URL
After deployment, copy your actual Netlify URL and update the environment variable:
1. Go to Site settings > Environment variables
2. Edit `NEXTAUTH_URL` 
3. Change to your actual URL (e.g., `https://prompt-goat.netlify.app`)
4. Trigger redeploy

## View Your Site
Once deployed, your site will be at: https://prompt-goat.netlify.app (or your chosen name)

## Troubleshooting

### Build fails: "Prisma Client not found"
- Already fixed in netlify.toml ✅

### "Database connection failed"
- Make sure DATABASE_URL is set correctly
- Test connection locally first
- Add `?schema=public` or `?sslmode=require` to connection string

### "NEXTAUTH_URL must be set"
- Make sure all 3 environment variables are added in Netlify
- Make sure NEXTAUTH_URL matches your deployed URL

## Next Steps
1. Create admin account (update role in database)
2. Configure custom domain (optional)
3. Set up monitoring
4. Add more prompts!

---

Need help? Check DEPLOYMENT.md for detailed instructions.
