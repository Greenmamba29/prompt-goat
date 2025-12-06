import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, Zap, RefreshCw, Headphones } from 'lucide-react'
import Link from 'next/link'

const trustBadges = [
  { icon: Shield, label: '7-Day Guarantee' },
  { icon: Zap, label: 'Instant Access' },
  { icon: RefreshCw, label: 'Lifetime Updates' },
  { icon: Headphones, label: 'Priority Support' },
]

export function BundleCTASection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <Badge className="mb-6">Complete Solution</Badge>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6">
          That&apos;s Why We Created{' '}
          <span className="text-primary">The Prompt Goat Bundle</span>
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          For marketers, creators, solopreneurs, and professionals who want to unlock the full power of AI without the learning curve. Everything you need, nothing you don&apos;t.
        </p>

        <Link href="/pricing">
          <Button size="lg" className="text-lg px-8 py-6 h-auto">
            Get Prompt Goat Bundle →
          </Button>
        </Link>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 text-muted-foreground">
              <badge.icon className="w-5 h-5 text-primary" />
              <span className="text-sm">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
