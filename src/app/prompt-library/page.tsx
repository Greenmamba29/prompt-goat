import { prisma } from '@/lib/prisma'
import { SectionHeader } from '@/components/ui/section-header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FAQAccordion } from '@/components/ui/faq-accordion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Library, Megaphone, TrendingUp, PenTool, Search, ShoppingCart, Zap, GraduationCap, DollarSign, Rocket, Palette } from 'lucide-react'

interface CategoryWithCount {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  isNew: boolean;
  order: number;
  _count: { prompts: number };
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Megaphone, TrendingUp, PenTool, Search, ShoppingCart, Zap, GraduationCap, DollarSign, Rocket, Palette, Library,
}

async function getCategories(): Promise<CategoryWithCount[]> {
  return prisma.promptCategory.findMany({
    include: { _count: { select: { prompts: true } } },
    orderBy: { order: 'asc' },
  }) as Promise<CategoryWithCount[]>
}

async function getFAQs(): Promise<FAQItem[]> {
  return prisma.fAQItem.findMany({ orderBy: { order: 'asc' } }) as Promise<FAQItem[]>
}

export default async function PromptLibraryPage() {
  const [categories, faqs] = await Promise.all([getCategories(), getFAQs()])

  return (
    <>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <Badge className="mb-4">100+ Prompts</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            The Prompt Library
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Browse expertly crafted prompts organized by category. Each one tested across multiple AI models to deliver consistent, high-quality results.
          </p>
          <Link href="/prompts">
            <Button size="lg">Browse All Prompts →</Button>
          </Link>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader
            badge="Categories"
            title="Find Your Perfect Prompt"
            description="Select a category to explore prompts tailored for your specific needs."
          />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = iconMap[category.icon || 'Library'] || Library
              return (
                <Link key={category.id} href={`/prompts?category=${category.slug}`}>
                  <Card className="h-full hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        {category.isNew && <Badge variant="new">New</Badge>}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                      <div className="text-sm text-primary font-medium">
                        {category._count.prompts} prompts →
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Value Strip */}
      <section className="py-16 bg-card/30">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-muted-foreground">Ready-to-use prompts</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">6</div>
              <div className="text-muted-foreground">AI models supported</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10</div>
              <div className="text-muted-foreground">Categories covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <SectionHeader
            badge="FAQ"
            title="Common Questions"
            description="Everything you need to know about the Prompt Library."
          />
          <div className="mt-12">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>
    </>
  )
}
