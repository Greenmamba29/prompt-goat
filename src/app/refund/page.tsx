import Link from 'next/link';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function RefundPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <SectionHeader
          badge="Our Guarantee"
          title="Refund Policy"
          description="We want you to be completely satisfied with your purchase."
        />

        {/* Guarantee Highlight */}
        <div className="max-w-2xl mx-auto mt-12 mb-12">
          <Card className="border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 to-violet-500/10">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">7-Day Money-Back Guarantee</h2>
              <p className="text-slate-300 text-lg">
                If you're not satisfied with Prompt Goat for any reason, simply contact us within 7 days
                of your purchase for a full refund. No questions asked.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto prose prose-invert prose-slate">
          <div className="space-y-8 text-slate-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Eligibility</h2>
              <p>
                To be eligible for a refund, you must request it within 7 days of your original
                purchase date. Refunds are available for all our pricing plans, including:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
                <li>Starter Plan</li>
                <li>Pro Plan</li>
                <li>Ultimate Plan</li>
                <li>Monthly Subscription (prorated)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">How to Request a Refund</h2>
              <p>
                Requesting a refund is simple. Just follow these steps:
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-2 text-slate-400">
                <li>
                  Send an email to{' '}
                  <a href="mailto:refunds@promptgoat.com" className="text-cyan-400 hover:text-cyan-300">
                    refunds@promptgoat.com
                  </a>
                </li>
                <li>Include your order confirmation number or the email used for purchase</li>
                <li>Briefly mention why you're requesting a refund (optional but helpful)</li>
              </ol>
              <p className="mt-4">
                We aim to process all refund requests within 2-3 business days. Once approved, the
                refund will be credited to your original payment method within 5-10 business days,
                depending on your bank or card issuer.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">After the 7-Day Period</h2>
              <p>
                While our standard refund policy covers the first 7 days, we understand that
                exceptional circumstances may arise. If you're outside the refund window but have
                a valid concern, please reach out to us. We'll do our best to work with you on
                a case-by-case basis.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Subscription Cancellations</h2>
              <p>
                For monthly subscriptions, you can cancel at any time from your account settings.
                Your access will continue until the end of your current billing period, and you
                won't be charged again. Partial-month refunds are available within the 7-day
                window of each billing cycle.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Questions?</h2>
              <p>
                If you have any questions about our refund policy or need assistance, our support
                team is here to help.
              </p>
            </section>
          </div>
        </div>

        <div className="max-w-xl mx-auto mt-12 text-center">
          <Link href="/contact">
            <Button size="lg">Contact Support</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
