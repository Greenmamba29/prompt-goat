import { SectionHeader } from '@/components/ui/section-header'
import { GoatIcon } from '@/components/ui/icons'

export function AboutSection() {
  return (
    <section className="py-20 bg-card/30">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* About Prompt Goat */}
          <div className="space-y-6">
            <SectionHeader
              badge="Our Story"
              title="About Prompt Goat"
              align="left"
            />
            <p className="text-muted-foreground">
              Prompt Goat started with a simple frustration: AI tools are incredibly powerful, but getting consistent, high-quality results requires knowing exactly how to ask. Most people don&apos;t have time to become prompt engineers.
            </p>
            <p className="text-muted-foreground">
              We built this library to bridge that gap. Every prompt is crafted, tested, and refined to work across multiple AI models. No guesswork. No wasted time. Just results.
            </p>
            <p className="text-muted-foreground">
              Our mission is to make AI accessible to everyone—not just technical users. Whether you&apos;re a marketer, writer, entrepreneur, or educator, Prompt Goat helps you get more done with less effort.
            </p>
          </div>

          {/* Founder */}
          <div className="relative">
            <div className="bg-card rounded-2xl border border-border p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <GoatIcon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Alex Chen</h3>
                  <p className="text-sm text-muted-foreground">Founder, Prompt Goat</p>
                </div>
              </div>
              <blockquote className="text-muted-foreground italic border-l-2 border-primary pl-4">
                &ldquo;Hey! I&apos;m Alex, and I&apos;ve spent the last two years deep in the AI trenches. I went from manually writing prompts for every project to building systems that generate better content in seconds.
              </blockquote>
              <p className="text-muted-foreground">
                Along the way, I documented everything that worked. What started as my personal swipe file became Prompt Goat—a curated collection of the prompts that actually deliver.
              </p>
              <p className="text-muted-foreground">
                If you&apos;re tired of mediocre AI outputs and want to skip the trial-and-error phase, you&apos;re in the right place. Let&apos;s make your AI work harder for you.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
