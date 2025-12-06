# Setting Up Neon Database for Prompt Goat

## Quick Setup (2 minutes)

### Step 1: Create Neon Project
1. Go to: https://console.neon.tech/app/projects
2. Click "New Project"
3. Project settings:
   - **Name**: `prompt-goat`
   - **Region**: Choose closest to you (US East, EU West, etc.)
   - **Postgres version**: Latest (16)
4. Click "Create Project"

### Step 2: Get Connection String
After project is created (takes ~10 seconds):
1. You'll see the connection string automatically
2. Copy the connection string that looks like:
   ```
   postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Step 3: Add to Netlify
1. Go to your Netlify site: https://app.netlify.com/sites/prompt-goat/settings
2. Click "Environment variables"
3. Add/Update:
   ```
   DATABASE_URL=postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Click "Save"

### Step 4: Run Migrations Locally
```bash
cd /Users/paco/prompt-goat-netlify

# Create .env file with Neon URL
echo "DATABASE_URL=your-neon-connection-string-here" > .env
echo "NEXTAUTH_SECRET=5ooRMkcwLRSWXJo35A8IJgvQpb9O7ggqKzK6Im6HrJU=" >> .env
echo "NEXTAUTH_URL=http://localhost:3000" >> .env

# Run migrations
bun run prisma:generate
bun run prisma:migrate

# Seed database with example data
bun run prisma:seed
```

### Step 5: Redeploy on Netlify
1. Go to: https://app.netlify.com/sites/prompt-goat/deploys
2. Click "Trigger deploy" → "Deploy site"
3. Wait 3-5 minutes

## Neon Features (Free Tier)

- ✅ **500 MB storage**
- ✅ **Serverless Postgres** - Scales to zero when not in use
- ✅ **Instant branching** - Create database branches for testing
- ✅ **Auto-suspend** - Database sleeps after 5 minutes of inactivity
- ✅ **Point-in-time restore** - Backup and restore to any point
- ✅ **No credit card required** for free tier

## Connection String Format

Neon connection strings always include `?sslmode=require` at the end:
```
postgresql://[user]:[password]@[endpoint]/[database]?sslmode=require
```

Example:
```
postgresql://neondb_owner:abc123xyz@ep-cool-mountain-12345678.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## Troubleshooting

### "Connection refused"
- Make sure `?sslmode=require` is at the end of the connection string
- Check that you copied the full connection string including password

### "Database does not exist"
- Use the default database name `neondb` (included in connection string)
- Don't create a new database - use the one provided

### "SSL required"
- Neon requires SSL connections
- Always include `?sslmode=require` in the connection string

## After Setup

Once database is configured and migrations are run:

1. ✅ Build will succeed on Netlify
2. ✅ Site will be live
3. ✅ You can create accounts and login
4. ✅ Prompts will be visible

### Create Admin User
After seeding, you'll have demo accounts:
- Admin: `admin@promptgoat.com` / `admin123`
- User: `user@promptgoat.com` / `user123`

Or create your own admin via SQL:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## Management

### View Data
- **Neon Console**: https://console.neon.tech
- **Prisma Studio** (local): `bun run prisma studio`

### Backup
Neon automatically backs up your database. Point-in-time restore available in console.

### Branching
Create database branches for testing:
1. Go to Neon console
2. Click "Branches"
3. Click "New Branch"
4. Test changes without affecting production

---

**Total setup time**: ~2-3 minutes  
**Cost**: Free (up to 500 MB)  
**Next step**: Deploy to Netlify with DATABASE_URL set
