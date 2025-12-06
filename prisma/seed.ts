import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Define enum values as constants to work before prisma generate
const Role = {
  ADMIN: 'ADMIN' as const,
  USER: 'USER' as const,
}

const Model = {
  CHATGPT: 'CHATGPT' as const,
  CLAUDE: 'CLAUDE' as const,
  GEMINI: 'GEMINI' as const,
  MIDJOURNEY: 'MIDJOURNEY' as const,
  DALLE: 'DALLE' as const,
  OTHER: 'OTHER' as const,
}

const BillingInterval = {
  LIFETIME: 'LIFETIME' as const,
  MONTHLY: 'MONTHLY' as const,
  YEARLY: 'YEARLY' as const,
}

async function main() {
  console.log('🌱 Starting seed...')

  // Clean existing data
  await prisma.userSubscription.deleteMany()
  await prisma.prompt.deleteMany()
  await prisma.promptCategory.deleteMany()
  await prisma.plan.deleteMany()
  await prisma.fAQItem.deleteMany()
  await prisma.newsletterSubscriber.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@promptgoat.com',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  })
  console.log('✅ Created admin user')

  // Create test user
  const userPassword = await bcrypt.hash('user123', 10)
  await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'user@promptgoat.com',
      passwordHash: userPassword,
      role: Role.USER,
    },
  })
  console.log('✅ Created test user')

  // Create categories
  const categories = await Promise.all([
    prisma.promptCategory.create({
      data: {
        slug: 'marketing',
        name: 'Marketing & Ads',
        description: 'Craft compelling marketing copy, ad campaigns, and brand messaging that converts.',
        icon: 'Megaphone',
        order: 1,
      },
    }),
    prisma.promptCategory.create({
      data: {
        slug: 'sales',
        name: 'Sales & Outreach',
        description: 'Close more deals with persuasive emails, proposals, and sales scripts.',
        icon: 'TrendingUp',
        order: 2,
      },
    }),
    prisma.promptCategory.create({
      data: {
        slug: 'content-writing',
        name: 'Content Writing',
        description: 'Create blog posts, articles, and long-form content that engages readers.',
        icon: 'PenTool',
        order: 3,
      },
    }),
    prisma.promptCategory.create({
      data: {
        slug: 'seo',
        name: 'SEO & Keywords',
        description: 'Optimize your content for search engines and drive organic traffic.',
        icon: 'Search',
        order: 4,
      },
    }),
    prisma.promptCategory.create({
      data: {
        slug: 'ecommerce',
        name: 'E-Commerce',
        description: 'Product descriptions, store copy, and conversion-focused content for online stores.',
        icon: 'ShoppingCart',
        order: 5,
      },
    }),
    prisma.promptCategory.create({
      data: {
        slug: 'productivity',
        name: 'Productivity',
        description: 'Streamline workflows, automate tasks, and get more done in less time.',
        icon: 'Zap',
        order: 6,
      },
    }),
    prisma.promptCategory.create({
      data: {
        slug: 'education',
        name: 'Education & Learning',
        description: 'Create courses, lesson plans, and educational content that teaches effectively.',
        icon: 'GraduationCap',
        order: 7,
        isNew: true,
      },
    }),
    prisma.promptCategory.create({
      data: {
        slug: 'finance',
        name: 'Finance & Analysis',
        description: 'Financial reports, analysis frameworks, and data-driven insights.',
        icon: 'DollarSign',
        order: 8,
      },
    }),
    prisma.promptCategory.create({
      data: {
        slug: 'solopreneurs',
        name: 'Solopreneurs',
        description: 'One-person business prompts for founders wearing many hats.',
        icon: 'Rocket',
        order: 9,
        isNew: true,
      },
    }),
    prisma.promptCategory.create({
      data: {
        slug: 'creative',
        name: 'Creative & Design',
        description: 'Image generation, creative concepts, and visual content prompts.',
        icon: 'Palette',
        order: 10,
      },
    }),
  ])
  console.log('✅ Created categories')

  // Create prompts
  const promptsData = [
    // Marketing prompts
    { category: 'marketing', title: 'Facebook Ad Copy Generator', short: 'Create scroll-stopping Facebook ad copy with hooks, benefits, and CTAs.', full: 'You are an expert Facebook advertising copywriter. Create compelling ad copy for [PRODUCT/SERVICE]. Include:\n\n1. **Primary Text**: Write 3 variations of primary text (125 characters max each) with strong hooks\n2. **Headline**: 3 headline options (40 characters max)\n3. **Description**: 2 description options (30 characters max)\n4. **Call-to-Action**: Recommend the best CTA button\n\nFocus on:\n- Pain points and emotional triggers\n- Social proof elements\n- Urgency without being pushy\n- Benefits over features\n\nProduct/Service: [INSERT DETAILS]\nTarget Audience: [INSERT AUDIENCE]\nMain Benefit: [INSERT BENEFIT]', model: Model.CHATGPT, tags: ['facebook', 'ads', 'copywriting'], isPremium: false },
    { category: 'marketing', title: 'Email Campaign Sequence Builder', short: 'Design a complete email nurture sequence that converts subscribers to customers.', full: 'Create a 5-email nurture sequence for [PRODUCT/SERVICE]. For each email provide:\n\n**Email 1 - Welcome & Value**\n- Subject line (3 options)\n- Preview text\n- Body copy (200-300 words)\n- CTA\n\n**Email 2 - Problem Agitation**\n- Subject line (3 options)\n- Story-driven content about the pain point\n- Soft CTA\n\n**Email 3 - Solution Introduction**\n- Subject line (3 options)\n- How your product solves the problem\n- Social proof\n- CTA\n\n**Email 4 - Objection Handling**\n- Subject line (3 options)\n- Address common objections\n- FAQ format\n- CTA\n\n**Email 5 - Urgency & Close**\n- Subject line (3 options)\n- Limited time offer or bonus\n- Final CTA\n\nProduct: [INSERT]\nAudience: [INSERT]\nMain objections: [INSERT]', model: Model.CHATGPT, tags: ['email', 'sequence', 'nurture'], isPremium: true },
    { category: 'marketing', title: 'Brand Voice Guidelines Creator', short: 'Develop comprehensive brand voice and tone guidelines for consistent messaging.', full: 'Create comprehensive brand voice guidelines for [BRAND NAME]. Include:\n\n**1. Brand Personality**\n- 5 key personality traits\n- Brand archetype\n- Emotional tone\n\n**2. Voice Characteristics**\n- Formality level (1-10)\n- Humor usage\n- Technical vs. conversational\n\n**3. Do\'s and Don\'ts**\n- Words we use vs. avoid\n- Phrases that align with our voice\n- Common mistakes to avoid\n\n**4. Examples**\n- Social media post example\n- Email example\n- Customer service response example\n\n**5. Audience Adaptation**\n- How to adjust for different platforms\n- B2B vs. B2C considerations\n\nBrand: [INSERT]\nIndustry: [INSERT]\nTarget Audience: [INSERT]\nCompetitors to differentiate from: [INSERT]', model: Model.CLAUDE, tags: ['branding', 'voice', 'guidelines'], isPremium: true },
    { category: 'marketing', title: 'Landing Page Copy Framework', short: 'Write high-converting landing page copy using proven frameworks.', full: 'Write landing page copy for [PRODUCT/SERVICE] using the PAS framework:\n\n**Above the Fold:**\n- Headline (benefit-driven, 10 words max)\n- Subheadline (clarify the offer)\n- Hero CTA button text\n- 3 trust badges/social proof elements\n\n**Problem Section:**\n- Paint the pain in 3-4 sentences\n- Use "you" language\n- Be specific about frustrations\n\n**Agitation Section:**\n- Consequences of not solving\n- Emotional cost\n- Time/money being wasted\n\n**Solution Section:**\n- Introduce the product\n- Key features as benefits\n- How it works (3 simple steps)\n\n**Social Proof Section:**\n- 3 testimonial templates\n- Stats/numbers\n\n**CTA Section:**\n- Final headline\n- Button text\n- Risk reversal (guarantee)\n\nProduct: [INSERT]\nPrice: [INSERT]\nMain benefit: [INSERT]', model: Model.CHATGPT, tags: ['landing-page', 'copywriting', 'conversion'], isPremium: false },
    { category: 'marketing', title: 'Social Media Content Calendar', short: 'Plan a month of engaging social media content with themes and post ideas.', full: 'Create a 30-day social media content calendar for [BRAND/BUSINESS]. Include:\n\n**Weekly Themes:**\n- Week 1: [Theme]\n- Week 2: [Theme]\n- Week 3: [Theme]\n- Week 4: [Theme]\n\n**Daily Posts (for each day provide):**\n- Platform (Instagram/LinkedIn/Twitter)\n- Content type (carousel, single image, video, text)\n- Caption (platform-appropriate length)\n- Hashtags (5-10 relevant)\n- Best posting time\n- Engagement prompt/CTA\n\n**Content Mix:**\n- 40% Value/Educational\n- 25% Engagement/Community\n- 20% Promotional\n- 15% Behind-the-scenes/Personal\n\nBusiness: [INSERT]\nIndustry: [INSERT]\nGoal: [INSERT]\nTone: [INSERT]', model: Model.CLAUDE, tags: ['social-media', 'calendar', 'planning'], isPremium: true },
    
    // Sales prompts
    { category: 'sales', title: 'Cold Email Outreach Templates', short: 'Write personalized cold emails that get responses and book meetings.', full: 'Create 5 cold email templates for [PRODUCT/SERVICE] targeting [ROLE]. For each template:\n\n**Subject Line:** (Keep under 50 characters, no spam triggers)\n\n**Opening Line:** (Personalized, reference something specific)\n\n**Value Proposition:** (One sentence, focus on outcome)\n\n**Social Proof:** (Brief mention of results or clients)\n\n**CTA:** (Specific, low-friction ask)\n\n**Email Length:** Keep under 100 words\n\n**Variations:**\n1. Problem-focused approach\n2. Curiosity-driven approach\n3. Direct value approach\n4. Mutual connection approach\n5. Industry insight approach\n\nProduct: [INSERT]\nTarget Role: [INSERT]\nMain Pain Point: [INSERT]\nKey Result: [INSERT]', model: Model.CHATGPT, tags: ['cold-email', 'outreach', 'b2b'], isPremium: false },
    { category: 'sales', title: 'Sales Call Script Builder', short: 'Structure discovery calls that uncover needs and close deals.', full: 'Create a complete sales call script for [PRODUCT/SERVICE]:\n\n**Opening (2 min)**\n- Rapport building opener\n- Agenda setting\n- Permission to ask questions\n\n**Discovery (15 min)**\n- Current situation questions (3)\n- Pain point questions (3)\n- Impact questions (3)\n- Future state questions (2)\n\n**Presentation (10 min)**\n- Transition statement\n- Key feature presentations (tied to their pain)\n- Case study mention\n- ROI calculation framework\n\n**Objection Handling**\n- Price objection response\n- Timing objection response\n- Need to consult objection response\n- Competitor objection response\n\n**Closing (5 min)**\n- Summary of value\n- Next steps\n- Alternative closes if needed\n\nProduct: [INSERT]\nPrice range: [INSERT]\nTypical objections: [INSERT]', model: Model.CHATGPT, tags: ['sales-call', 'script', 'discovery'], isPremium: true },
    { category: 'sales', title: 'Proposal Template Generator', short: 'Create professional proposals that win business and justify pricing.', full: 'Generate a winning proposal template for [SERVICE]. Include:\n\n**Cover Page**\n- Title format\n- Key information to include\n\n**Executive Summary**\n- Their challenge (restate)\n- Our solution (overview)\n- Expected outcomes\n- Investment summary\n\n**Understanding Your Needs**\n- Paraphrase their situation\n- Key challenges identified\n- Goals they mentioned\n\n**Proposed Solution**\n- Our approach\n- Deliverables (detailed list)\n- Timeline with milestones\n- Team members involved\n\n**Investment**\n- Pricing options (3 tiers)\n- Payment terms\n- What\'s included/excluded\n\n**Why Choose Us**\n- 3 differentiators\n- Relevant case studies\n- Guarantees offered\n\n**Next Steps**\n- How to proceed\n- Validity period\n- Contact information\n\nService: [INSERT]\nClient industry: [INSERT]', model: Model.CLAUDE, tags: ['proposal', 'b2b', 'closing'], isPremium: true },
    { category: 'sales', title: 'LinkedIn Connection Request', short: 'Craft connection requests that get accepted and start conversations.', full: 'Write 10 LinkedIn connection request messages for [TARGET ROLE]. Each should be:\n\n- Under 300 characters\n- Personalized placeholder for [SPECIFIC DETAIL]\n- No immediate pitch\n- Genuine reason to connect\n- Conversation starter\n\n**Approach Types:**\n1. Mutual connection reference\n2. Content they posted\n3. Company news/achievement\n4. Shared industry interest\n5. Event/webinar mention\n6. Career transition congrats\n7. Thought leadership appreciation\n8. Geographic connection\n9. Alumni connection\n10. Industry challenge discussion\n\nTarget Role: [INSERT]\nYour Role: [INSERT]\nYour Value: [INSERT]', model: Model.CHATGPT, tags: ['linkedin', 'networking', 'outreach'], isPremium: false },
    { category: 'sales', title: 'Follow-Up Email Sequence', short: 'Never let a lead go cold with strategic follow-up emails.', full: 'Create a 7-email follow-up sequence for leads who haven\'t responded:\n\n**Email 1 (Day 2)**\n- Subject: Brief check-in\n- Approach: Add value, share resource\n\n**Email 2 (Day 5)**\n- Subject: Different angle\n- Approach: Ask a question\n\n**Email 3 (Day 9)**\n- Subject: Social proof\n- Approach: Share relevant case study\n\n**Email 4 (Day 14)**\n- Subject: Insight share\n- Approach: Industry observation\n\n**Email 5 (Day 21)**\n- Subject: Direct ask\n- Approach: "Did I miss something?"\n\n**Email 6 (Day 30)**\n- Subject: Break-up email\n- Approach: Permission to close file\n\n**Email 7 (Day 45)**\n- Subject: Re-engagement\n- Approach: New reason to connect\n\nFor each email: Subject line + 50-word body + CTA\n\nOriginal offer: [INSERT]\nTarget: [INSERT]', model: Model.CHATGPT, tags: ['follow-up', 'sequence', 'persistence'], isPremium: true },

    // Content Writing prompts
    { category: 'content-writing', title: 'Blog Post Outline Generator', short: 'Create comprehensive blog post outlines that rank and engage readers.', full: 'Create a detailed blog post outline for the topic: [TOPIC]\n\n**SEO Research:**\n- Primary keyword: [INSERT]\n- Secondary keywords (5-7)\n- Search intent analysis\n\n**Title Options (5):**\n- Include number/power word variations\n- Keep under 60 characters\n\n**Meta Description:**\n- 155 characters max\n- Include primary keyword\n- Clear value proposition\n\n**Outline Structure:**\n\n**H1: [Main Title]**\n\n**Introduction (150 words)**\n- Hook statement\n- Problem identification\n- Promise of value\n- What they\'ll learn\n\n**H2 Sections (5-7):**\nFor each section provide:\n- H2 heading\n- Key points to cover (3-4 bullets)\n- H3 subsections if needed\n- Examples/data to include\n- Internal link opportunity\n\n**Conclusion:**\n- Key takeaways\n- Action step\n- CTA\n\n**Word count target:** [INSERT]\n**Tone:** [INSERT]', model: Model.CLAUDE, tags: ['blog', 'outline', 'seo'], isPremium: false },
    { category: 'content-writing', title: 'Article Introduction Writer', short: 'Hook readers from the first sentence with compelling introductions.', full: 'Write 5 different introduction styles for an article about [TOPIC]. Each intro should be 100-150 words:\n\n**1. Story Hook**\n- Start with a brief anecdote\n- Connect to reader\'s experience\n- Transition to topic\n\n**2. Statistic Shock**\n- Lead with surprising data\n- Contextualize the number\n- Bridge to why it matters\n\n**3. Question Opening**\n- Ask a thought-provoking question\n- Acknowledge the challenge\n- Promise the answer\n\n**4. Contrarian Statement**\n- Challenge conventional wisdom\n- Create curiosity\n- Set up the argument\n\n**5. Problem Agitation**\n- Describe the pain point vividly\n- Show understanding\n- Offer hope\n\nFor each intro, end with a thesis statement and preview of what\'s coming.\n\nTopic: [INSERT]\nTarget audience: [INSERT]\nDesired action after reading: [INSERT]', model: Model.CHATGPT, tags: ['article', 'introduction', 'hooks'], isPremium: true },
    { category: 'content-writing', title: 'Case Study Framework', short: 'Turn client wins into compelling case studies that generate leads.', full: 'Create a case study template for [CLIENT/PROJECT]:\n\n**Title Formula:**\n"How [CLIENT] [ACHIEVED RESULT] in [TIMEFRAME]"\n\n**Quick Stats Banner:**\n- 3-4 key metrics with before/after\n\n**The Challenge (200 words)**\n- Client background\n- Specific problems faced\n- Failed solutions tried\n- Stakes of not solving\n\n**The Solution (300 words)**\n- Why they chose you\n- Implementation overview\n- Key strategies used\n- Timeline of work\n\n**The Results (200 words)**\n- Quantifiable outcomes\n- Qualitative improvements\n- Unexpected benefits\n- Client quote\n\n**Key Takeaways**\n- 3-5 lessons applicable to readers\n\n**CTA Section**\n- "Ready for similar results?"\n- Contact/demo button\n\n**Sidebar Elements:**\n- Client logo\n- Industry\n- Company size\n- Products used\n\nClient: [INSERT]\nResult achieved: [INSERT]\nTimeframe: [INSERT]', model: Model.CLAUDE, tags: ['case-study', 'b2b', 'social-proof'], isPremium: true },
    { category: 'content-writing', title: 'Newsletter Content Generator', short: 'Write engaging newsletter editions that get opened and clicked.', full: 'Create a newsletter edition for [NEWSLETTER NAME] on [TOPIC]:\n\n**Subject Lines (5 options):**\n- Use curiosity, numbers, or urgency\n- Under 50 characters\n- Avoid spam triggers\n\n**Preview Text:**\n- Complement the subject line\n- Under 100 characters\n\n**Structure:**\n\n**Opening Hook (2-3 sentences)**\n- Personal anecdote or observation\n- Transition to main content\n\n**Main Content Section**\n- Valuable insight or lesson\n- Supporting examples\n- Actionable advice\n- 300-400 words\n\n**Quick Wins Section**\n- 3-5 bite-sized tips\n- Bullet format\n\n**Resource of the Week**\n- Tool, article, or video recommendation\n- Why it\'s valuable\n\n**CTA**\n- One clear action\n- Low friction\n\n**Sign-off**\n- Personal touch\n- Signature\n\nNewsletter focus: [INSERT]\nAudience: [INSERT]\nTone: [INSERT]', model: Model.CHATGPT, tags: ['newsletter', 'email', 'content'], isPremium: false },
    { category: 'content-writing', title: 'Thought Leadership Article', short: 'Position yourself as an expert with insightful, original content.', full: 'Write a thought leadership article about [TOPIC] for [PLATFORM]. Include:\n\n**Angle Development:**\n- Unique perspective: [What do you believe that others don\'t?]\n- Supporting evidence: [Your experience/data]\n- Contrarian element: [What conventional wisdom do you challenge?]\n\n**Article Structure (1500-2000 words):**\n\n**Opening:**\n- Bold claim or observation\n- Why now? (Timeliness)\n- Stakes of the issue\n\n**The Shift (Section 1)**\n- What\'s changing in the industry\n- Evidence and examples\n- Implications\n\n**Your Framework (Section 2)**\n- Introduce your unique approach\n- Break it down into steps\n- Show how it differs from common advice\n\n**Case in Point (Section 3)**\n- Real example demonstrating your framework\n- Results achieved\n- Lessons learned\n\n**Looking Forward (Section 4)**\n- Where this is heading\n- How to prepare\n- Action steps\n\n**Closing:**\n- Call to rethink\n- Final memorable statement\n\nTopic: [INSERT]\nYour unique angle: [INSERT]\nPlatform: [INSERT]', model: Model.CLAUDE, tags: ['thought-leadership', 'linkedin', 'expertise'], isPremium: true },

    // SEO prompts
    { category: 'seo', title: 'Keyword Research Prompt', short: 'Uncover high-value keywords your competitors are missing.', full: 'Conduct comprehensive keyword research for [BUSINESS/WEBSITE]:\n\n**1. Seed Keyword Analysis**\nFor seed keyword [KEYWORD], provide:\n- Search volume estimate\n- Keyword difficulty assessment\n- Search intent (informational/commercial/transactional)\n- SERP features present\n\n**2. Long-tail Variations (20)**\n- Question-based keywords (5)\n- How-to keywords (5)\n- Comparison keywords (5)\n- Location-based keywords (5)\n\n**3. LSI Keywords (15)**\n- Related terms\n- Semantic variations\n- Industry terminology\n\n**4. Content Cluster Map**\n- Pillar page topic\n- 5-7 cluster article topics\n- Internal linking strategy\n\n**5. Competitor Gap Analysis**\n- Keywords competitors rank for\n- Untapped opportunities\n- Quick win keywords\n\n**6. Priority Matrix**\n- High volume + low difficulty\n- High intent keywords\n- 90-day target list\n\nMain keyword: [INSERT]\nBusiness type: [INSERT]\nCurrent domain authority: [INSERT]', model: Model.CHATGPT, tags: ['seo', 'keywords', 'research'], isPremium: false },
    { category: 'seo', title: 'SEO-Optimized Meta Tags', short: 'Write meta titles and descriptions that improve CTR and rankings.', full: 'Create SEO meta tags for [PAGE/URL]:\n\n**Page Analysis:**\n- Primary topic: [INSERT]\n- Target keyword: [INSERT]\n- Secondary keywords: [INSERT]\n- Page type: [homepage/product/blog/category]\n\n**Meta Title (5 variations)**\nRequirements:\n- Under 60 characters\n- Primary keyword near beginning\n- Brand name if space allows\n- Power word or number\n- Avoid keyword stuffing\n\n**Meta Description (5 variations)**\nRequirements:\n- 150-155 characters\n- Include primary keyword naturally\n- Clear value proposition\n- Call to action\n- Unique selling point\n\n**Open Graph Tags:**\n- og:title\n- og:description\n- Recommended image specs\n\n**Schema Markup Recommendation:**\n- Appropriate schema type\n- Key properties to include\n\nURL: [INSERT]\nBrand name: [INSERT]\nMain CTA: [INSERT]', model: Model.CHATGPT, tags: ['meta-tags', 'seo', 'ctr'], isPremium: true },
    { category: 'seo', title: 'Content Optimization Audit', short: 'Analyze and improve existing content for better search rankings.', full: 'Perform a content optimization audit for [URL/CONTENT]:\n\n**Current State Analysis:**\n- Primary keyword: [INSERT]\n- Current ranking: [INSERT]\n- Word count: [INSERT]\n\n**On-Page SEO Checklist:**\n\n**Title Tag:**\n- Current: [INSERT]\n- Optimized version:\n- Changes made and why\n\n**H1 Tag:**\n- Alignment with search intent\n- Keyword inclusion\n- Suggested improvements\n\n**Content Structure:**\n- H2 headings analysis\n- H3 usage\n- Suggested restructuring\n\n**Keyword Optimization:**\n- Current keyword density\n- Missing keywords to add\n- Over-optimized sections\n- TF-IDF recommendations\n\n**Content Gaps:**\n- Topics competitors cover that you don\'t\n- Questions to answer\n- Data/examples to add\n\n**Technical SEO:**\n- Internal linking opportunities\n- External link suggestions\n- Image alt text improvements\n\n**Action Plan:**\n- Priority 1 changes (immediate)\n- Priority 2 changes (this week)\n- Priority 3 changes (this month)', model: Model.CLAUDE, tags: ['audit', 'optimization', 'seo'], isPremium: true },
    { category: 'seo', title: 'Local SEO Strategy Builder', short: 'Dominate local search results for your service area.', full: 'Create a local SEO strategy for [BUSINESS NAME]:\n\n**Business Information:**\n- Business name: [INSERT]\n- Address: [INSERT]\n- Service area: [INSERT]\n- Primary services: [INSERT]\n\n**Google Business Profile Optimization:**\n- Category recommendations (primary + secondary)\n- Description (750 characters)\n- Services to list\n- Attributes to enable\n- Photo strategy\n- Post schedule\n\n**Local Keywords (25)**\n- [City] + [service] variations\n- Near me variations\n- Neighborhood-specific terms\n- Question keywords\n\n**Local Content Strategy:**\n- Location pages structure\n- Local blog topics (10)\n- Community involvement content\n- Local news tie-ins\n\n**Citation Building:**\n- Top 20 directories to target\n- NAP consistency checklist\n- Industry-specific directories\n\n**Review Strategy:**\n- Review request templates (3)\n- Response templates (positive/negative)\n- Review monitoring setup\n\n**Local Link Building:**\n- Local partnerships\n- Sponsorship opportunities\n- Local PR angles', model: Model.CHATGPT, tags: ['local-seo', 'gmb', 'citations'], isPremium: true },

    // E-commerce prompts
    { category: 'ecommerce', title: 'Product Description Writer', short: 'Transform features into benefits that sell products.', full: 'Write a compelling product description for [PRODUCT NAME]:\n\n**Product Information:**\n- Name: [INSERT]\n- Category: [INSERT]\n- Price point: [INSERT]\n- Key features: [INSERT]\n- Target customer: [INSERT]\n\n**Description Format:**\n\n**Headline (under 70 chars)**\n- Benefit-focused\n- Include key differentiator\n\n**Short Description (150 words)**\n- Opening hook\n- Main benefits (3-4)\n- Social proof element\n- Urgency/scarcity if applicable\n\n**Feature-Benefit Bullets (5-7)**\nFormat: Feature → Benefit → Outcome\n- Each bullet: specific, scannable, benefit-driven\n\n**Long Description (300 words)**\n- Story/context\n- Problem it solves\n- How it works\n- Quality/craftsmanship details\n- Comparison to alternatives\n- Perfect for [use case]\n\n**SEO Elements:**\n- Primary keyword integration\n- Alt text for images\n- Schema markup suggestions\n\n**Variations:**\n- Amazon listing version\n- Website version\n- Social media version', model: Model.CHATGPT, tags: ['product', 'description', 'ecommerce'], isPremium: false },
    { category: 'ecommerce', title: 'Abandoned Cart Email Sequence', short: 'Recover lost sales with strategic cart abandonment emails.', full: 'Create an abandoned cart email sequence for [STORE NAME]:\n\n**Email 1 - Reminder (1 hour after)**\nSubject lines (3):\n- \nBody: Friendly reminder, show cart contents, single CTA\nLength: 100 words\n\n**Email 2 - Help Offered (24 hours)**\nSubject lines (3):\n- \nBody: Ask if they had issues, offer help, customer service focus\nInclude: FAQ link, contact options\n\n**Email 3 - Social Proof (48 hours)**\nSubject lines (3):\n- \nBody: Customer reviews, ratings, testimonials for items in cart\nInclude: Trust badges, guarantee reminder\n\n**Email 4 - Incentive (72 hours)**\nSubject lines (3):\n- \nBody: Limited discount or free shipping offer\nInclude: Expiration on offer, cart contents, CTA\n\n**Email 5 - Last Chance (7 days)**\nSubject lines (3):\n- \nBody: Cart expiring, final offer, FOMO elements\nInclude: Countdown, urgent CTA\n\n**For each email include:**\n- Mobile-optimized layout notes\n- Product image placement\n- CTA button text and color\n\nStore: [INSERT]\nAverage order value: [INSERT]\nDiscount capacity: [INSERT]', model: Model.CLAUDE, tags: ['abandoned-cart', 'email', 'recovery'], isPremium: true },
    { category: 'ecommerce', title: 'Collection Page Copy', short: 'Write category and collection page copy that guides and converts.', full: 'Write collection page copy for [COLLECTION NAME]:\n\n**Page Elements:**\n\n**SEO Title:**\n- Under 60 characters\n- Include category + brand\n\n**Meta Description:**\n- 155 characters\n- Include key benefits and CTA\n\n**H1 Heading:**\n- Clear, keyword-rich\n- Not duplicate of title\n\n**Collection Description (200 words)**\n- What products are included\n- Who they\'re for\n- Why choose this collection\n- Key benefits/features\n- Trust elements\n\n**Filter Labels:**\n- Size naming conventions\n- Color naming\n- Price range labels\n- Feature filter names\n\n**Empty State Copy:**\n- No products found message\n- Helpful suggestions\n\n**Promotional Banner Copy:**\n- Sale banner text\n- New arrival highlight\n- Free shipping reminder\n\n**Cross-sell Section:**\n- "Complete the look" heading\n- Related collection suggestions\n\nCollection: [INSERT]\nProducts included: [INSERT]\nTarget audience: [INSERT]\nBrand voice: [INSERT]', model: Model.CHATGPT, tags: ['collection', 'category', 'ecommerce'], isPremium: false },

    // Productivity prompts
    { category: 'productivity', title: 'Meeting Agenda Creator', short: 'Structure meetings that are focused, efficient, and actionable.', full: 'Create a meeting agenda template for [MEETING TYPE]:\n\n**Pre-Meeting:**\n- Objective statement: [What decision/outcome needed?]\n- Required attendees: [Roles needed]\n- Optional attendees: [Who might benefit]\n- Pre-read materials: [What to review beforehand]\n\n**Agenda Structure:**\n\n**Opening (5 min)**\n- Meeting purpose recap\n- Desired outcomes\n- Ground rules reminder\n\n**Item 1: [TOPIC] (X min)**\n- Owner: [Name]\n- Goal: [Decision/Discussion/Update]\n- Key questions to answer\n- Required materials\n\n**Item 2: [TOPIC] (X min)**\n- [Same structure]\n\n**Item 3: [TOPIC] (X min)**\n- [Same structure]\n\n**Wrap-up (5 min)**\n- Decisions made recap\n- Action items with owners and deadlines\n- Next meeting preview\n- Parking lot items\n\n**Post-Meeting:**\n- Notes template\n- Action item tracking format\n- Follow-up email template\n\nMeeting type: [INSERT]\nDuration: [INSERT]\nFrequency: [INSERT]', model: Model.CHATGPT, tags: ['meetings', 'agenda', 'productivity'], isPremium: false },
    { category: 'productivity', title: 'Weekly Review Template', short: 'Reflect on your week and plan the next one systematically.', full: 'Create a weekly review template for [ROLE/FOCUS]:\n\n**Part 1: Week in Review (15 min)**\n\n**Wins & Accomplishments**\n- What went well?\n- What am I proud of?\n- What moved the needle?\n\n**Challenges & Lessons**\n- What didn\'t go as planned?\n- What did I learn?\n- What would I do differently?\n\n**Energy Audit**\n- What energized me?\n- What drained me?\n- Patterns to note\n\n**Metrics Check**\n- Key metrics this week vs. target\n- Trends to address\n\n**Part 2: Week Ahead (15 min)**\n\n**Priority Setting**\n- Top 3 outcomes for next week\n- Must-do tasks\n- Could-do tasks\n- Won\'t-do list\n\n**Calendar Audit**\n- Meetings to keep/cancel/reschedule\n- Focus time blocks needed\n- Buffer time for unexpected\n\n**Preparation Needed**\n- Materials to prepare\n- People to contact\n- Decisions to make\n\n**Self-Care Planning**\n- Exercise plan\n- Social commitments\n- Rest/recovery time\n\nRole: [INSERT]\nKey focus areas: [INSERT]\nTop metrics: [INSERT]', model: Model.CLAUDE, tags: ['weekly-review', 'planning', 'reflection'], isPremium: true },
    { category: 'productivity', title: 'SOP Documentation Generator', short: 'Document processes so anyone can follow them consistently.', full: 'Create a Standard Operating Procedure for [PROCESS NAME]:\n\n**Document Header:**\n- SOP Title: [PROCESS]\n- Version: 1.0\n- Last Updated: [DATE]\n- Owner: [ROLE]\n- Approver: [ROLE]\n\n**Purpose**\n- Why this SOP exists\n- What problem it solves\n- Who should use it\n\n**Scope**\n- What\'s included\n- What\'s excluded\n- When to use this SOP\n\n**Prerequisites**\n- Access/permissions needed\n- Tools required\n- Training completed\n- Prior SOPs to reference\n\n**Procedure Steps**\n\n**Step 1: [Action]**\n- Detailed instructions\n- Screenshot/diagram placeholder\n- Expected outcome\n- Common errors to avoid\n\n**Step 2: [Action]**\n[Continue for all steps]\n\n**Quality Checks**\n- How to verify completion\n- Acceptance criteria\n- Who to notify\n\n**Troubleshooting**\n- Common issues and solutions\n- Escalation path\n- Support contacts\n\n**Revision History**\n| Version | Date | Changes | Author |\n\nProcess: [INSERT]\nAudience: [INSERT]\nComplexity: [INSERT]', model: Model.CHATGPT, tags: ['sop', 'documentation', 'processes'], isPremium: true },

    // Education prompts
    { category: 'education', title: 'Course Curriculum Builder', short: 'Design engaging online courses that deliver real learning outcomes.', full: 'Design a course curriculum for [COURSE TOPIC]:\n\n**Course Overview:**\n- Title: [INSERT]\n- Duration: [INSERT]\n- Target student: [INSERT]\n- Learning outcomes (5): Students will be able to...\n\n**Module Structure:**\n\n**Module 1: [Foundation]**\n- Learning objectives (3)\n- Lessons:\n  1. [Topic] - Video (X min)\n  2. [Topic] - Reading\n  3. [Topic] - Exercise\n- Assessment: Quiz (10 questions)\n- Resources: Templates, checklists\n\n**Module 2: [Core Concepts]**\n[Same structure]\n\n**Module 3: [Advanced Application]**\n[Same structure]\n\n**Module 4: [Real-World Practice]**\n[Same structure]\n\n**Module 5: [Mastery & Next Steps]**\n[Same structure]\n\n**Course Elements:**\n- Welcome video script\n- Discussion prompts per module\n- Peer review activities\n- Final project brief\n- Certificate criteria\n\n**Engagement Features:**\n- Gamification elements\n- Community touchpoints\n- Live Q&A schedule\n\nTopic: [INSERT]\nStudent level: [INSERT]\nDelivery platform: [INSERT]', model: Model.CLAUDE, tags: ['course', 'curriculum', 'education'], isPremium: true },
    { category: 'education', title: 'Lesson Plan Generator', short: 'Create structured lesson plans with clear objectives and activities.', full: 'Create a lesson plan for teaching [TOPIC]:\n\n**Lesson Information:**\n- Subject: [INSERT]\n- Grade/Level: [INSERT]\n- Duration: [INSERT]\n- Class size: [INSERT]\n\n**Learning Objectives:**\nStudents will be able to:\n1. [Knowledge objective - remember/understand]\n2. [Skill objective - apply/analyze]\n3. [Attitude objective - evaluate/create]\n\n**Materials Needed:**\n- [List all materials]\n- Technology requirements\n- Handouts to prepare\n\n**Lesson Structure:**\n\n**Hook (5 min)**\n- Attention grabber activity\n- Connection to prior knowledge\n- Today\'s agenda preview\n\n**Direct Instruction (15 min)**\n- Key concepts to cover\n- Examples to demonstrate\n- Check for understanding prompts\n\n**Guided Practice (15 min)**\n- Activity description\n- Student grouping\n- Teacher role during activity\n\n**Independent Practice (10 min)**\n- Individual work assignment\n- Differentiation options\n- Support for struggling learners\n\n**Closure (5 min)**\n- Summary activity\n- Exit ticket question\n- Preview of next lesson\n\n**Assessment:**\n- Formative assessment strategies\n- Rubric/criteria\n\n**Differentiation:**\n- For advanced learners\n- For struggling learners\n- For ELL students\n\nTopic: [INSERT]\nPrior knowledge assumed: [INSERT]', model: Model.CHATGPT, tags: ['lesson-plan', 'teaching', 'education'], isPremium: false },
    { category: 'education', title: 'Quiz Question Generator', short: 'Create varied assessment questions that test real understanding.', full: 'Generate quiz questions for [TOPIC]:\n\n**Topic Coverage:**\n- Main concept: [INSERT]\n- Subtopics: [INSERT]\n- Learning objectives assessed: [INSERT]\n\n**Question Types (5 each):**\n\n**Multiple Choice**\n1. Question:\n   a) [Answer]\n   b) [Answer]\n   c) [Answer]\n   d) [Answer]\n   Correct: [Letter]\n   Explanation: [Why correct/incorrect]\n\n**True/False**\n1. Statement:\n   Answer: [T/F]\n   Explanation:\n\n**Fill in the Blank**\n1. _______ [sentence with blank]\n   Answer:\n   Acceptable variations:\n\n**Short Answer**\n1. Question:\n   Model answer:\n   Key points required:\n   Rubric:\n\n**Scenario-Based**\n1. Scenario:\n   Question:\n   Model answer:\n   Scoring guide:\n\n**Difficulty Distribution:**\n- Easy (recall): 30%\n- Medium (application): 50%\n- Hard (analysis): 20%\n\n**Answer Key:**\n[Compiled answers with explanations]\n\nTopic: [INSERT]\nAudience level: [INSERT]\nTime limit: [INSERT]', model: Model.CHATGPT, tags: ['quiz', 'assessment', 'education'], isPremium: true },

    // Finance prompts
    { category: 'finance', title: 'Financial Report Summary', short: 'Summarize complex financial data into clear executive insights.', full: 'Create a financial report summary template:\n\n**Report Header:**\n- Period: [INSERT]\n- Prepared by: [INSERT]\n- Date: [INSERT]\n\n**Executive Summary (1 page)**\n- Key performance highlights (3-5 bullets)\n- Critical alerts/concerns\n- Recommended actions\n\n**Revenue Analysis**\n- Total revenue vs. target vs. prior period\n- Revenue by segment/product\n- Growth drivers\n- Headwinds\n- Trend analysis\n\n**Expense Analysis**\n- Total expenses vs. budget\n- Expense by category\n- Cost savings achieved\n- Overruns explained\n\n**Profitability Metrics**\n- Gross margin\n- Operating margin\n- Net margin\n- Trends and comparisons\n\n**Cash Flow Highlights**\n- Operating cash flow\n- Free cash flow\n- Cash position\n- Runway/burn rate\n\n**Key Ratios**\n- [Industry-relevant ratios]\n- Comparison to benchmarks\n\n**Forward Look**\n- Next period forecast\n- Risks and opportunities\n- Action items with owners\n\n**Appendix**\n- Detailed tables\n- Methodology notes', model: Model.CLAUDE, tags: ['financial', 'report', 'summary'], isPremium: true },
    { category: 'finance', title: 'Budget Planning Template', short: 'Build comprehensive budgets with proper categorization and forecasting.', full: 'Create a budget planning framework for [TIMEFRAME]:\n\n**Budget Overview:**\n- Period: [INSERT]\n- Department/Project: [INSERT]\n- Total budget request: [INSERT]\n\n**Revenue Projections (if applicable)**\n| Source | Current | Projected | Growth % | Assumptions |\n\n**Fixed Costs**\n| Category | Monthly | Annual | Notes |\n- Salaries & benefits\n- Rent & utilities\n- Software subscriptions\n- Insurance\n\n**Variable Costs**\n| Category | Unit Cost | Est. Units | Total | Notes |\n- Marketing spend\n- Contractor fees\n- Travel\n- Materials\n\n**Capital Expenditures**\n| Item | Cost | Depreciation | Timing |\n\n**Contingency**\n- Amount: [X% of total]\n- Conditions for use\n\n**Monthly Breakdown**\n| Month | Revenue | Expenses | Net | Cumulative |\n\n**Variance Analysis Framework**\n- Tracking frequency\n- Threshold for escalation\n- Reforecast triggers\n\n**Approval Chain**\n| Amount Range | Approver |\n\n**Supporting Documentation**\n- Quotes obtained\n- Historical data reference\n- Benchmark comparisons', model: Model.CHATGPT, tags: ['budget', 'planning', 'finance'], isPremium: false },
    { category: 'finance', title: 'Investment Analysis Framework', short: 'Evaluate investment opportunities with structured analysis.', full: 'Create an investment analysis for [OPPORTUNITY]:\n\n**Investment Overview:**\n- Name: [INSERT]\n- Amount: [INSERT]\n- Type: [INSERT]\n- Time horizon: [INSERT]\n\n**Thesis Statement**\n- Core investment thesis (2-3 sentences)\n- Key assumption\n\n**Market Analysis**\n- Market size (TAM/SAM/SOM)\n- Growth rate\n- Key trends\n- Competitive landscape\n\n**Financial Analysis**\n\n**Revenue Model**\n- How does it make money?\n- Unit economics\n- Pricing power\n\n**Historical Performance**\n| Metric | Year 1 | Year 2 | Year 3 |\n- Revenue\n- Growth rate\n- Margins\n\n**Projections**\n| Metric | Year 1 | Year 2 | Year 3 | Year 5 |\n- Bear case\n- Base case\n- Bull case\n\n**Valuation**\n- Method used\n- Comparable analysis\n- DCF (if applicable)\n- Entry multiple\n- Expected exit multiple\n\n**Risk Assessment**\n| Risk | Probability | Impact | Mitigation |\n\n**Decision Framework**\n- Go criteria\n- No-go criteria\n- Key metrics to monitor\n\n**Recommendation**\n- Invest / Pass / Need more info\n- Conviction level\n- Position sizing suggestion', model: Model.CLAUDE, tags: ['investment', 'analysis', 'finance'], isPremium: true },

    // Solopreneur prompts
    { category: 'solopreneurs', title: 'One-Person Business Plan', short: 'Plan your solo business with clarity on priorities and resources.', full: 'Create a one-person business plan for [BUSINESS IDEA]:\n\n**Vision & Mission**\n- One-sentence vision\n- Mission statement\n- Why you\'re uniquely qualified\n\n**Value Proposition**\n- Problem you solve\n- For whom specifically\n- How you\'re different\n- Why now\n\n**Business Model**\n- Revenue streams (prioritized)\n- Pricing strategy\n- Delivery method\n- Customer lifetime value target\n\n**Target Customer**\n- Ideal customer profile\n- Where they hang out\n- How they make decisions\n- Budget range\n\n**Solo Capacity Planning**\n- Hours available per week\n- Revenue target per hour\n- Maximum client capacity\n- Time allocation breakdown\n\n**Minimum Viable Tech Stack**\n| Need | Tool | Cost/mo |\n- Website\n- Email\n- Payments\n- Scheduling\n- Project management\n\n**90-Day Launch Plan**\n- Month 1 priorities\n- Month 2 priorities\n- Month 3 priorities\n- First revenue milestone\n\n**Financial Projections**\n- Startup costs\n- Monthly overhead\n- Break-even point\n- Year 1 revenue target\n\n**Risk Mitigation**\n- Biggest risks\n- Mitigation strategies\n- Pivot triggers\n\nBusiness idea: [INSERT]\nYour skills: [INSERT]\nTime commitment: [INSERT]', model: Model.CHATGPT, tags: ['business-plan', 'solopreneur', 'startup'], isPremium: true },
    { category: 'solopreneurs', title: 'Service Offering Creator', short: 'Package and price your services for maximum value and clarity.', full: 'Design service offerings for [YOUR SERVICE]:\n\n**Service Analysis**\n- Core skill/service: [INSERT]\n- Target client: [INSERT]\n- Problem solved: [INSERT]\n\n**Tiered Offerings**\n\n**Tier 1: Starter**\n- Name: [Clever package name]\n- Price: $[X]\n- Deliverables (3-4)\n- Turnaround time\n- Ideal for: [Client type]\n- Limits/exclusions\n\n**Tier 2: Professional (Anchor)**\n- Name: [Clever package name]\n- Price: $[X]\n- Deliverables (5-7)\n- Turnaround time\n- Ideal for: [Client type]\n- Bonus inclusions\n\n**Tier 3: Premium**\n- Name: [Clever package name]\n- Price: $[X]\n- Deliverables (all-inclusive)\n- Priority turnaround\n- Ideal for: [Client type]\n- VIP perks\n\n**Add-Ons**\n| Add-on | Price | Description |\n- [5 optional add-ons]\n\n**Productized Service**\n- Recurring revenue option\n- Retainer structure\n- Subscription model\n\n**Pricing Psychology**\n- Why this pricing works\n- Value anchoring strategy\n- Objection pre-handlers\n\nService type: [INSERT]\nHourly rate baseline: [INSERT]\nCapacity: [INSERT]', model: Model.CLAUDE, tags: ['services', 'pricing', 'packaging'], isPremium: false },
    { category: 'solopreneurs', title: 'Client Onboarding System', short: 'Create a smooth onboarding experience that impresses clients.', full: 'Design a client onboarding system for [YOUR BUSINESS]:\n\n**Pre-Onboarding**\n\n**Welcome Email**\n- Subject line\n- Body (excitement, next steps, timeline)\n- What they need to prepare\n\n**Client Intake Form**\nQuestions to ask:\n1. Business information\n2. Goals and objectives\n3. Challenges faced\n4. Previous solutions tried\n5. Success metrics\n6. Timeline expectations\n7. Communication preferences\n8. Access/credentials needed\n\n**Onboarding Call Agenda**\n- Introductions (5 min)\n- Project walkthrough (15 min)\n- Process explanation (10 min)\n- Q&A (10 min)\n- Next steps (5 min)\n\n**Onboarding Checklist**\n\n**Day 1**\n- [ ] Send welcome packet\n- [ ] Create client folder\n- [ ] Add to project management\n- [ ] Schedule kickoff call\n\n**Day 2-3**\n- [ ] Review intake form\n- [ ] Conduct kickoff call\n- [ ] Send meeting notes\n\n**Day 4-5**\n- [ ] Begin work\n- [ ] Send first check-in\n- [ ] Deliver quick win\n\n**Welcome Packet Contents**\n- Thank you note\n- What to expect document\n- Timeline overview\n- Communication guidelines\n- FAQ\n- Emergency contact\n\n**Automation Opportunities**\n- Email sequences\n- Form submissions\n- Calendar scheduling\n- Folder creation\n\nBusiness type: [INSERT]\nTypical project length: [INSERT]', model: Model.CHATGPT, tags: ['onboarding', 'clients', 'systems'], isPremium: true },

    // Creative prompts
    { category: 'creative', title: 'Midjourney Prompt Architect', short: 'Craft detailed prompts that generate stunning AI images.', full: 'Create Midjourney prompts for [CONCEPT/VISION]:\n\n**Prompt Structure:**\n[Subject] + [Style] + [Composition] + [Lighting] + [Color] + [Technical Parameters]\n\n**Base Prompt:**\n[Describe the main subject in detail]\n\n**Style Variations (5):**\n\n1. **Photorealistic**\n[Full prompt with --v 6 --ar 16:9 --style raw]\n\n2. **Cinematic**\n[Full prompt with film references, anamorphic, cinematic lighting]\n\n3. **Illustration**\n[Full prompt with illustration style, artist references]\n\n4. **3D Render**\n[Full prompt with 3D software references, materials]\n\n5. **Abstract/Artistic**\n[Full prompt with artistic movement references]\n\n**Modifier Library:**\n- Lighting: [5 options]\n- Camera angles: [5 options]\n- Color palettes: [5 options]\n- Moods: [5 options]\n- Textures: [5 options]\n\n**Negative Prompts:**\n--no [unwanted elements]\n\n**Parameter Combinations:**\n- For portraits: --ar 3:4 --s 250\n- For landscapes: --ar 16:9 --s 500\n- For logos: --ar 1:1 --s 100\n\n**Iteration Strategy:**\n- Start broad, refine specific elements\n- Vary one parameter at a time\n- Use /describe on reference images\n\nVision: [INSERT]\nIntended use: [INSERT]\nMood: [INSERT]', model: Model.MIDJOURNEY, tags: ['midjourney', 'image', 'ai-art'], isPremium: false },
    { category: 'creative', title: 'Brand Visual Concept Generator', short: 'Develop cohesive visual concepts for brand identity projects.', full: 'Generate brand visual concepts for [BRAND NAME]:\n\n**Brand Input:**\n- Industry: [INSERT]\n- Values: [INSERT]\n- Target audience: [INSERT]\n- Competitors to differentiate from: [INSERT]\n\n**Concept 1: [Theme Name]**\n- Core concept description\n- Color palette (hex codes)\n- Typography recommendations\n- Logo direction\n- Pattern/texture elements\n- Photography style\n- Mood board description\n\n**Concept 2: [Theme Name]**\n[Same structure]\n\n**Concept 3: [Theme Name]**\n[Same structure]\n\n**Visual System Elements:**\n\n**Logo Variations**\n- Primary\n- Secondary\n- Icon only\n- Wordmark only\n\n**Color System**\n- Primary colors (2)\n- Secondary colors (3)\n- Neutral palette\n- Gradient combinations\n\n**Typography Scale**\n- Display font\n- Heading font\n- Body font\n- Accent font\n\n**Iconography Style**\n- Style description\n- Stroke weight\n- Corner radius\n- Example icons needed\n\n**Image Guidelines**\n- Photography style\n- Illustration style\n- Image treatment\n- Do\'s and don\'ts\n\nBrand: [INSERT]\nPersonality traits: [INSERT]', model: Model.CLAUDE, tags: ['branding', 'visual', 'identity'], isPremium: true },
    { category: 'creative', title: 'DALL-E Prompt Optimizer', short: 'Write prompts that maximize DALL-E image quality and accuracy.', full: 'Optimize DALL-E prompts for [IMAGE CONCEPT]:\n\n**Image Requirements:**\n- Subject: [INSERT]\n- Style: [INSERT]\n- Use case: [INSERT]\n- Aspect ratio needed: [INSERT]\n\n**Optimized Prompt Structure:**\n\n**Version 1: Detailed Description**\n"[Comprehensive prompt with subject, action, setting, style, lighting, composition, color scheme, mood]"\n\n**Version 2: Style-First**\n"[Style reference] of [subject description], [setting], [additional details]"\n\n**Version 3: Artist Reference**\n"[Subject] in the style of [artist/movement], [specific characteristics]"\n\n**Version 4: Photographic**\n"[Camera type] photo of [subject], [lens], [lighting type], [film stock if applicable]"\n\n**Version 5: Minimal**\n"[Core subject and style only for flexibility]"\n\n**Enhancement Modifiers:**\n- Quality: "high quality, detailed, sharp focus"\n- Lighting: "dramatic lighting, soft lighting, golden hour"\n- Composition: "centered, rule of thirds, symmetrical"\n- Atmosphere: "dreamy, gritty, ethereal, moody"\n\n**What to Avoid:**\n- Overly complex descriptions\n- Contradictory elements\n- Text in images\n- Specific named individuals\n\n**Iteration Tips:**\n- Generate 4 variations\n- Pick best, add specificity\n- Describe unwanted elements to exclude\n\nConcept: [INSERT]', model: Model.DALLE, tags: ['dalle', 'image', 'ai-art'], isPremium: false },
  ]

  const categoryMap = Object.fromEntries(categories.map(c => [c.slug, c.id]))

  for (const prompt of promptsData) {
    await prisma.prompt.create({
      data: {
        title: prompt.title,
        shortDescription: prompt.short,
        fullPromptText: prompt.full,
        model: prompt.model,
        categoryId: categoryMap[prompt.category],
        tags: prompt.tags,
        isPremium: prompt.isPremium,
      },
    })
  }
  console.log(`✅ Created ${promptsData.length} prompts`)

  // Create plans
  await prisma.plan.createMany({
    data: [
      {
        name: 'Starter Pack',
        slug: 'starter',
        priceCents: 2900,
        billingInterval: BillingInterval.LIFETIME,
        features: [
          'Access to 25 essential prompts',
          'ChatGPT & Claude compatible',
          'Basic prompt guides',
          'Community access',
        ],
        order: 1,
      },
      {
        name: 'Pro Bundle',
        slug: 'pro',
        priceCents: 7900,
        billingInterval: BillingInterval.LIFETIME,
        features: [
          'All 100+ premium prompts',
          'All AI models supported',
          'Detailed prompt tutorials',
          'Prompt customization guides',
          'Priority support',
          'Lifetime updates',
        ],
        isPopular: true,
        order: 2,
      },
      {
        name: 'Ultimate Access',
        slug: 'ultimate',
        priceCents: 14900,
        billingInterval: BillingInterval.LIFETIME,
        features: [
          'Everything in Pro Bundle',
          'Custom GPT templates',
          'AI workflow automations',
          '1-on-1 prompt coaching session',
          'White-label rights',
          'Early access to new prompts',
          'VIP community access',
        ],
        order: 3,
      },
      {
        name: 'Monthly Pro',
        slug: 'monthly',
        priceCents: 1900,
        billingInterval: BillingInterval.MONTHLY,
        features: [
          'All 100+ premium prompts',
          'All AI models supported',
          'Monthly new prompts',
          'Cancel anytime',
        ],
        order: 4,
      },
    ],
  })
  console.log('✅ Created plans')

  // Create FAQ items
  await prisma.fAQItem.createMany({
    data: [
      {
        question: 'What exactly is Prompt Goat?',
        answer: 'Prompt Goat is a curated library of expertly crafted AI prompts designed to help you get better results from ChatGPT, Claude, Midjourney, and other AI tools. Each prompt is tested and optimized for specific use cases like marketing, sales, content creation, and more.',
        order: 1,
      },
      {
        question: 'Which AI tools do these prompts work with?',
        answer: 'Our prompts are optimized for the major AI platforms including ChatGPT (GPT-4/4o), Claude, Gemini, Midjourney, and DALL-E. Most text-based prompts work across multiple platforms with minor adjustments.',
        order: 2,
      },
      {
        question: 'How do I use the prompts?',
        answer: 'Simply copy the prompt, fill in the bracketed placeholders with your specific information, and paste it into your AI tool of choice. Each prompt includes guidance on customization and tips for getting the best results.',
        order: 3,
      },
      {
        question: 'Are new prompts added regularly?',
        answer: 'Yes! We continuously add new prompts based on emerging AI capabilities, user requests, and industry trends. Pro and Ultimate members get lifetime access to all updates at no extra cost.',
        order: 4,
      },
      {
        question: 'Can I get a refund if I\'m not satisfied?',
        answer: 'Absolutely. We offer a 7-day money-back guarantee on all purchases. If the prompts don\'t help you achieve better AI results, just reach out and we\'ll process a full refund—no questions asked.',
        order: 5,
      },
      {
        question: 'Do I need technical skills to use these prompts?',
        answer: 'Not at all. Our prompts are designed for everyone from beginners to AI power users. Each comes with clear instructions and examples. If you can copy and paste, you can use Prompt Goat.',
        order: 6,
      },
      {
        question: 'What\'s the difference between free and premium prompts?',
        answer: 'Free prompts give you a taste of our library and cover common use cases. Premium prompts are more specialized, include detailed customization options, and often combine multiple techniques for superior results.',
        order: 7,
      },
      {
        question: 'Can I use these prompts for my business or clients?',
        answer: 'Yes! All plans allow personal and commercial use. The Ultimate Access tier also includes white-label rights, so you can use the prompts in products or services you sell to clients.',
        order: 8,
      },
      {
        question: 'How is Prompt Goat different from free prompt libraries?',
        answer: 'Unlike random collections of prompts, every Prompt Goat prompt is professionally written, tested across multiple AI models, and includes context on when and how to use it. We focus on quality over quantity.',
        order: 9,
      },
      {
        question: 'Do you offer team or enterprise plans?',
        answer: 'Yes, we offer custom team plans for organizations that need multiple seats or custom prompt development. Contact us at team@promptgoat.com for details.',
        order: 10,
      },
    ],
  })
  console.log('✅ Created FAQ items')

  // Give admin a subscription
  const proPlan = await prisma.plan.findUnique({ where: { slug: 'pro' } })
  if (proPlan) {
    await prisma.userSubscription.create({
      data: {
        userId: admin.id,
        planId: proPlan.id,
        status: 'ACTIVE',
      },
    })
    console.log('✅ Created admin subscription')
  }

  console.log('🌱 Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
