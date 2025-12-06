import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';

const bundleIncludes = [
  {
    icon: '📚',
    title: 'Complete Prompt Library',
    description: 'All 100+ premium prompts across every category',
    value: '$79',
  },
  {
    icon: '📋',
    title: 'Exclusive Templates',
    description: '25+ ready-to-use templates for common workflows',
    value: '$49',
  },
  {
    icon: '🎥',
    title: 'Video Masterclass',
    description: '3+ hours of video tutorials on prompt engineering',
    value: '$99',
  },
  {
    icon: '📖',
    title: 'AI Strategy Guide',
    description: 'Comprehensive PDF guide on AI best practices',
    value: '$29',
  },
  {
    icon: '🔔',
    title: 'Priority Updates',
    description: 'Early access to new prompts and features',
    value: '$49',
  },
  {
    icon: '💬',
    title: 'Priority Support',
    description: 'Direct access to our support team',
    value: '$29',
  },
];

const totalValue = bundleIncludes.reduce((sum, item) => sum + parseInt(item.value.replace('$', '')), 0);

export default function CompleteAIBundlePage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4">Limited Time Offer</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            The Complete AI Bundle
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            Everything you need to master AI in one comprehensive package. Get our entire library
            plus exclusive bonuses at an unbeatable price.
          </p>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-baseline gap-3">
              <span className="text-slate-500 line-through text-2xl">${totalValue}</span>
              <span className="text-5xl font-bold text-white">$149</span>
              <span className="text-slate-400">one-time</span>
            </div>
            <Badge variant="success" className="text-lg px-4 py-1">
              Save ${totalValue - 149}!
            </Badge>
          </div>
        </div>

        {/* What's Included */}
        <div className="max-w-4xl mx-auto mb-16">
          <SectionHeader
            title="Everything That's Included"
            description="A complete AI toolkit worth over $300"
            className="mb-8"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bundleIncludes.map((item) => (
              <Card key={item.title}>
                <CardContent className="p-6 flex gap-4">
                  <span className="text-3xl">{item.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <span className="text-cyan-400 font-semibold">{item.value}</span>
                    </div>
                    <p className="text-sm text-slate-400">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Card */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="border-cyan-500 bg-gradient-to-br from-cyan-500/10 to-violet-500/10">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Get Instant Access Now
              </h2>
              <p className="text-slate-300 mb-6">
                One-time payment. Lifetime access. No subscriptions.
              </p>
              <div className="flex flex-col items-center gap-4">
                <Link href="/pricing">
                  <Button size="lg" className="text-lg px-8">
                    Get the Complete Bundle - $149
                  </Button>
                </Link>
                <p className="text-sm text-slate-400">
                  ✓ 7-day money-back guarantee &nbsp;&nbsp; ✓ Secure checkout
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison */}
        <div className="max-w-3xl mx-auto mb-16">
          <SectionHeader
            title="Bundle vs. Library Only"
            className="mb-8"
          />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-4 px-4 text-slate-400 font-medium">Feature</th>
                  <th className="text-center py-4 px-4 text-slate-400 font-medium">Library ($79)</th>
                  <th className="text-center py-4 px-4 text-cyan-400 font-medium">Bundle ($149)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['100+ Premium Prompts', true, true],
                  ['All Categories', true, true],
                  ['Lifetime Updates', true, true],
                  ['Exclusive Templates', false, true],
                  ['Video Masterclass', false, true],
                  ['AI Strategy Guide', false, true],
                  ['Priority Updates', false, true],
                  ['Priority Support', false, true],
                ].map(([feature, library, bundle], i) => (
                  <tr key={i} className="border-b border-slate-800/50">
                    <td className="py-4 px-4 text-slate-300">{feature}</td>
                    <td className="py-4 px-4 text-center">
                      {library ? (
                        <svg className="w-5 h-5 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-slate-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {bundle ? (
                        <svg className="w-5 h-5 text-cyan-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-slate-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title="Questions About the Bundle"
            className="mb-8"
          />
          <div className="space-y-6">
            {[
              {
                q: 'What format are the video tutorials?',
                a: 'The video masterclass is delivered in HD video format, accessible through your account dashboard. You can watch online or download for offline viewing.',
              },
              {
                q: 'Do I get lifetime access?',
                a: 'Yes! This is a one-time purchase with lifetime access to all included materials, plus all future updates.',
              },
              {
                q: 'Can I upgrade from the Library to the Bundle?',
                a: "Absolutely. If you've already purchased the Library, contact us and we'll credit your purchase toward the Bundle upgrade.",
              },
              {
                q: 'Is there a money-back guarantee?',
                a: "Yes, we offer a full 7-day money-back guarantee. If you're not satisfied, just let us know for a complete refund.",
              },
            ].map((item, i) => (
              <div key={i} className="border-b border-slate-800 pb-6">
                <h3 className="font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
