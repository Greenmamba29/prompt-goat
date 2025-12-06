import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/ui/section-header'

const milestones = [
  {
    date: 'Nov 2022',
    title: 'ChatGPT Launches',
    description: 'OpenAI releases ChatGPT, sparking the AI revolution and making conversational AI accessible to everyone.',
  },
  {
    date: 'Mar 2023',
    title: 'GPT-4 Arrives',
    description: 'The most capable language model yet transforms how professionals approach complex tasks and reasoning.',
  },
  {
    date: 'Jul 2023',
    title: 'Claude 2 Released',
    description: 'Anthropic\'s Claude brings nuanced, helpful AI with a focus on safety and detailed analysis.',
  },
  {
    date: 'Dec 2023',
    title: 'Gemini Debuts',
    description: 'Google enters the arena with multimodal capabilities, expanding what AI assistants can understand.',
  },
  {
    date: 'Mar 2024',
    title: 'Claude 3 Opus',
    description: 'A new benchmark in AI intelligence—near-human reasoning for the most demanding professional tasks.',
  },
  {
    date: 'May 2024',
    title: 'GPT-4o Launched',
    description: 'Real-time voice, vision, and text in one model. AI becomes truly multimodal and instantaneous.',
  },
  {
    date: 'Now',
    title: 'Your Turn',
    description: 'The tools are ready. The only question is: are you using them to their full potential?',
    highlight: true,
  },
]

export function TimelineSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          badge="The AI Era"
          title="How AI Changed the Game"
          description="The past two years have transformed what's possible. Here's the journey that brought us here—and why the right prompts matter more than ever."
        />

        <div className="mt-16 relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.date}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-primary -translate-x-1.5 md:-translate-x-1.5 mt-6">
                  {milestone.highlight && (
                    <span className="absolute inset-0 rounded-full bg-primary animate-ping" />
                  )}
                </div>

                {/* Content */}
                <div className={`md:w-1/2 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                  <Card className={milestone.highlight ? 'border-primary shadow-lg shadow-primary/10' : ''}>
                    <CardContent className="p-6">
                      <Badge variant={milestone.highlight ? 'default' : 'secondary'} className="mb-3">
                        {milestone.date}
                      </Badge>
                      <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden md:block md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
