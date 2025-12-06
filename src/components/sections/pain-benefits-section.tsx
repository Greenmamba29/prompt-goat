import { SectionHeader } from '@/components/ui/section-header'
import { X, Check } from 'lucide-react'

const comparisons = [
  { old: 'Writing ad copy from scratch every time', new: 'Copy-paste proven ad frameworks instantly' },
  { old: 'Vague prompts that give generic results', new: 'Specific prompts engineered for quality output' },
  { old: 'Hours spent learning prompt engineering', new: 'Ready-to-use prompts tested across models' },
  { old: 'Inconsistent outputs you have to fix', new: 'Reliable results you can use right away' },
  { old: 'One-size-fits-all approaches that fail', new: 'Prompts tailored for each use case and model' },
  { old: 'Starting over with each new AI tool', new: 'Cross-platform prompts that work everywhere' },
  { old: 'Guessing what makes a good prompt', new: 'Learning from documented best practices' },
  { old: 'Wasting tokens on trial and error', new: 'Efficient prompts that get it right first try' },
]

export function PainBenefitsSection() {
  return (
    <section className="py-20 bg-card/30">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          badge="Before vs After"
          title="Stop Fighting Your AI Tools"
          description="See what changes when you use prompts designed by experts."
        />

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {/* Old Way */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2 mb-4">
              <X className="w-5 h-5" /> The Frustrating Way
            </h3>
            {comparisons.map((item) => (
              <div
                key={item.old}
                className="flex items-start gap-3 p-4 rounded-lg bg-red-500/5 border border-red-500/20"
              >
                <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item.old}</span>
              </div>
            ))}
          </div>

          {/* New Way */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2 mb-4">
              <Check className="w-5 h-5" /> The Prompt Goat Way
            </h3>
            {comparisons.map((item) => (
              <div
                key={item.new}
                className="flex items-start gap-3 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20"
              >
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item.new}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
