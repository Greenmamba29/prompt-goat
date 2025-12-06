import { Card, CardContent } from '@/components/ui/card'
import { SectionHeader } from '@/components/ui/section-header'
import { StarIcon } from '@/components/ui/icons'

const stats = [
  { value: '4.9', label: 'Star Rating' },
  { value: '2,500+', label: 'Happy Customers' },
  { value: '50,000+', label: 'Prompts Copied' },
  { value: '10,000+', label: 'Hours Saved' },
]

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Marketing Director',
    content: 'Prompt Goat cut my content creation time in half. The marketing prompts are incredibly well-crafted—I get usable copy on the first try now.',
    rating: 5,
  },
  {
    name: 'David Park',
    role: 'Freelance Writer',
    content: 'I was skeptical about prompt libraries, but this is different. Each prompt has clear instructions and actually works across different AI tools. Worth every penny.',
    rating: 5,
  },
  {
    name: 'Emma Rodriguez',
    role: 'E-commerce Owner',
    content: 'The product description prompts alone have paid for themselves ten times over. My conversion rate jumped 23% after rewriting all my listings.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Startup Founder',
    content: 'As a solo founder, I wear too many hats. Prompt Goat gives me expert-level outputs for sales, marketing, and operations without hiring a team.',
    rating: 5,
  },
  {
    name: 'Lisa Thompson',
    role: 'Course Creator',
    content: 'The education prompts helped me outline and script my entire course in a weekend. What used to take months now takes days.',
    rating: 5,
  },
  {
    name: 'James Wilson',
    role: 'Agency Owner',
    content: 'We use Prompt Goat across our entire team. Consistent quality, faster turnaround, happier clients. It\'s become essential to our workflow.',
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <SectionHeader
          badge="Social Proof"
          title="Trusted by Thousands"
          description="See what creators, marketers, and professionals are saying about Prompt Goat."
        />

        {/* Testimonials grid */}
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 text-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground">&ldquo;{testimonial.content}&rdquo;</p>
                <div>
                  <div className="font-medium">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
