# 🐐 Prompt Goat

A modern SaaS platform for discovering and managing AI prompts across multiple models.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.1-2D3748)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC)

## ✨ Features

- 🔐 **Secure Authentication** - Email/password auth with NextAuth
- 📚 **Prompt Library** - Categorized prompts for ChatGPT, Claude, Gemini, Midjourney, DALL-E
- 🏷️ **Tag-Based Filtering** - Find prompts quickly with tags
- 💎 **Premium Content** - Subscription-based access to exclusive prompts
- 👥 **User Management** - Role-based access control (User/Admin)
- 📊 **Usage Analytics** - Track prompt usage and popularity
- 💳 **Subscription Plans** - Lifetime, monthly, and yearly options
- 🎨 **Modern UI** - Built with TailwindCSS and Lucide icons
- 🕷️ **Universal Scraper Protocol (USP)** - Python-based framework for scraping prompts from multiple sources

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase recommended)
- Netlify account (for deployment)

### Local Development

1. **Clone and install**
   ```bash
   git clone <your-repo-url>
   cd prompt-goat-netlify
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your values:
   ```env
   DATABASE_URL="postgresql://user:pass@host:5432/dbname?schema=public"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Set up database**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed  # Optional: seed with example data
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth
- **Deployment**: Netlify
- **Icons**: Lucide React

## 🗄️ Database Schema

```
User ──────────┐
               │
               ├─ UserSubscription ─── Plan
               │
PromptCategory ─── Prompt (with tags, model, premium flag)
               
FAQItem
NewsletterSubscriber
```

See [PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md) for detailed schema documentation.

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

### Quick Deploy to Netlify

1. Push to GitHub
2. Import project in Netlify
3. Set environment variables
4. Deploy!

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

## 📚 Documentation

### Main Application
- [PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md) - Architecture and technical analysis
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide
- `.env.example` - Environment variable template

### Universal Scraper Protocol (USP)
- [USP Overview](./docs/usp/README.md) - Introduction and features
- [Quick Start Guide](./docs/usp/QUICK_START.md) - Get started in 5 minutes
- [Architecture](./docs/usp/USP_ARCHITECTURE.md) - System design and components
- [MetricMule Setup](./docs/usp/METRICMULE_SETUP.md) - MetricMule scraper guide
- [Add New Scrapers](./docs/usp/ADD_NEW_SCRAPER.md) - Developer guide for new scrapers

## 🔐 Security

- Passwords hashed with bcrypt
- JWT-based session management
- Role-based access control
- Environment variables for secrets
- HTTPS enforced in production

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your needs.

## 📄 License

MIT License - feel free to use this project as a template for your own SaaS applications.

## 🆘 Support

For issues and questions:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting section
2. Review [PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md)
3. Open an issue on GitHub

## 🗺️ Roadmap

- [ ] Prompt search functionality
- [ ] User prompt favorites
- [ ] Prompt sharing between users
- [ ] AI-powered prompt suggestions
- [ ] Public prompt gallery
- [ ] Browser extension
- [ ] API for integrations

---

Built with ❤️ using Next.js and deployed on Netlify
