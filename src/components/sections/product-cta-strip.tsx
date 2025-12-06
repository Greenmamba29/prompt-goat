import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Library, Package, ShoppingBag, HelpCircle } from 'lucide-react'
import Link from 'next/link'

const products = [
  {
    icon: Library,
    title: 'Prompt Library',
    description: 'Browse 100+ prompts organized by category and AI model.',
    href: '/prompt-library',
    cta: 'Browse Prompts',
  },
  {
    icon: Package,
    title: 'Complete Bundle',
    description: 'Get everything: all prompts, guides, and lifetime updates.',
    href: '/pricing',
    cta: 'Get Bundle',
  },
  {
    icon: ShoppingBag,
    title: 'Digital Products',
    description: 'Templates, courses, and tools to supercharge your AI workflow.',
    href: '/products',
    cta: 'View Products',
  },
  {
    icon: HelpCircle,
    title: 'Need Help?',
    description: 'Questions? Our team is ready to assist you.',
    href: '/contact',
    cta: 'Contact Us',
  },
]

export function ProductCTAStrip() {
  return (
    <section className="py-16 bg-card/30">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.title}
              className="group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <product.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{product.title}</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
                <Link href={product.href}>
                  <Button variant="ghost" size="sm" className="group-hover:text-primary">
                    {product.cta} →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
