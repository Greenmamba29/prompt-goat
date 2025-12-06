import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';

const products = [
  {
    title: 'AI Prompt Library',
    description: 'Our flagship collection of 100+ premium prompts across 10 categories. Perfect for marketers, creators, and professionals.',
    price: '$79',
    badge: 'Best Seller',
    features: ['100+ curated prompts', '10 categories', 'All AI models', 'Lifetime updates'],
    href: '/pricing',
    popular: true,
  },
  {
    title: 'Complete AI Bundle',
    description: 'Everything you need to master AI. Includes all prompts, exclusive templates, and bonus resources.',
    price: '$149',
    badge: 'Most Value',
    features: ['Everything in Library', 'Exclusive templates', 'Video tutorials', 'Priority support'],
    href: '/complete-ai-bundle',
    popular: false,
  },
  {
    title: 'Prompt Generator',
    description: 'Create custom prompts with our AI-powered prompt generator. Perfect for unique use cases.',
    price: 'Coming Soon',
    badge: 'New',
    features: ['AI-powered generation', 'Custom templates', 'Export options', 'Unlimited generations'],
    href: '/prompt-generator',
    popular: false,
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <SectionHeader
          badge="Our Products"
          title="AI Tools for Modern Professionals"
          description="Explore our suite of AI productivity tools designed to help you work smarter, not harder."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-12">
          {products.map((product) => (
            <Card
              key={product.title}
              className={`flex flex-col ${product.popular ? 'border-cyan-500 shadow-lg shadow-cyan-500/20' : ''}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={product.popular ? 'default' : product.badge === 'New' ? 'new' : 'outline'}>
                    {product.badge}
                  </Badge>
                </div>
                <CardTitle>{product.title}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-3xl font-bold text-white mb-4">{product.price}</p>
                <ul className="space-y-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-slate-300 text-sm">
                      <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href={product.href} className="w-full">
                  <Button
                    className="w-full"
                    variant={product.popular ? 'default' : 'outline'}
                    disabled={product.price === 'Coming Soon'}
                  >
                    {product.price === 'Coming Soon' ? 'Coming Soon' : 'Learn More'}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="mt-20">
          <SectionHeader
            title="Why Choose Prompt Goat?"
            description="We're committed to helping you get the most out of AI."
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: '✨',
                title: 'Quality First',
                description: 'Every prompt is tested and refined for optimal results.',
              },
              {
                icon: '🔄',
                title: 'Regular Updates',
                description: 'New prompts and features added every month.',
              },
              {
                icon: '🎯',
                title: 'Multi-Model',
                description: 'Works with ChatGPT, Claude, Gemini, and more.',
              },
              {
                icon: '💬',
                title: 'Great Support',
                description: 'Our team is here to help you succeed.',
              },
            ].map((item) => (
              <Card key={item.title} className="text-center">
                <CardContent className="p-6">
                  <span className="text-4xl mb-4 block">{item.icon}</span>
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Supercharge Your AI Workflow?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already saving hours every week with Prompt Goat.
          </p>
          <Link href="/pricing">
            <Button size="lg">View Pricing</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
