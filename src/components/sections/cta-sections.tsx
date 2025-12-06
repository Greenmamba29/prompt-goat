'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SectionHeader } from '@/components/ui/section-header'
import { Shield, Check, Sparkles, BookOpen, RefreshCw, Infinity } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// Guarantee Section
export function GuaranteeSection() {
  return (
    <section className="py-20 bg-card/30">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <Shield className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-4">7-Day Risk-Free Guarantee</h2>
        <p className="text-xl text-muted-foreground mb-6">
          Try Prompt Goat for a full week. If the prompts don&apos;t help you get better results from your AI tools, email us and we&apos;ll refund every cent. No hoops, no hassle, no hard feelings.
        </p>
        <p className="text-muted-foreground">
          We&apos;re confident you&apos;ll love it—but if not, the risk is on us.
        </p>
      </div>
    </section>
  )
}

// Newsletter Section
export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="py-20">
      <div className="mx-auto max-w-xl px-4 text-center">
        <SectionHeader
          badge="Newsletter"
          title="Level Up Your AI Game Weekly"
          description="Join 5,000+ professionals getting prompt tips, AI news, and exclusive content every Tuesday."
        />
        <form onSubmit={handleSubmit} className="mt-8 flex gap-3">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Joining...' : 'Join Free'}
          </Button>
        </form>
        {status === 'success' && (
          <p className="mt-4 text-sm text-emerald-400">Welcome aboard! Check your inbox.</p>
        )}
        {status === 'error' && (
          <p className="mt-4 text-sm text-red-400">Something went wrong. Please try again.</p>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}

// Final CTA Section
const benefits = [
  { icon: Sparkles, text: '100+ expertly crafted prompts' },
  { icon: BookOpen, text: 'Step-by-step usage guides' },
  { icon: RefreshCw, text: 'Lifetime updates included' },
  { icon: Infinity, text: 'Permanent access, no subscription' },
]

export function FinalCTASection() {
  return (
    <section className="py-20 bg-gradient-to-b from-card/30 to-background">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6">
          Ready to Transform How You Use AI?
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Get instant access to everything you need to unlock better AI results today.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-10">
          {benefits.map((benefit) => (
            <div key={benefit.text} className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <benefit.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm">{benefit.text}</span>
            </div>
          ))}
        </div>

        <Link href="/pricing">
          <Button size="lg" className="text-lg px-10 py-6 h-auto">
            Get Prompt Goat Now →
          </Button>
        </Link>
      </div>
    </section>
  )
}
