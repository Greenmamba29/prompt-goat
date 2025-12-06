import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GoatIcon, StarIcon } from '@/components/ui/icons'
import Link from 'next/link'

const models = ['ChatGPT', 'Claude', 'Gemini', 'Midjourney', 'DALL-E', 'Llama']

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column */}
          <div className="space-y-8">
            {/* Social proof badge */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-amber-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                Loved by 2,500+ creators & marketers
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Your AI Prompt{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Swiss Army Knife
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-muted-foreground max-w-lg">
              Stop wasting hours crafting prompts from scratch. Get instant access to 100+ battle-tested prompts that deliver results across all major AI tools.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/prompt-library">
                <Button size="lg" className="gap-2">
                  Explore Prompts
                  <span aria-hidden="true">→</span>
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline">
                  Unlock Full Bundle
                </Button>
              </Link>
            </div>

            {/* Supported models */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Works with:</span>
              {models.map((model) => (
                <Badge key={model} variant="outline" className="text-xs">
                  {model}
                </Badge>
              ))}
            </div>
          </div>

          {/* Right column - Hero illustration */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Main card */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-card to-secondary/20 border border-border shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <GoatIcon className="w-32 h-32 text-primary" />
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 px-4 py-2 rounded-xl bg-card border border-border shadow-lg">
                  <span className="text-sm font-medium">100+ Prompts</span>
                </div>
                <div className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl bg-card border border-border shadow-lg">
                  <span className="text-sm font-medium">6 AI Models</span>
                </div>
                <div className="absolute top-1/2 -right-8 px-4 py-2 rounded-xl bg-primary text-primary-foreground shadow-lg">
                  <span className="text-sm font-medium">Copy & Use</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
