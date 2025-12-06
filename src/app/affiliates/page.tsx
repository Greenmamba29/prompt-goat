'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/ui/section-header';

export default function AffiliatesPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <SectionHeader
          badge="Partner With Us"
          title="Affiliate Program"
          description="Earn 30% commission on every sale you refer. Join hundreds of creators earning passive income with Prompt Goat."
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <p className="text-4xl font-bold text-cyan-400 mb-2">30%</p>
              <p className="text-slate-400">Commission Rate</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <p className="text-4xl font-bold text-violet-400 mb-2">90 Days</p>
              <p className="text-slate-400">Cookie Duration</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <p className="text-4xl font-bold text-green-400 mb-2">$50</p>
              <p className="text-slate-400">Min Payout</p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Sign Up',
                description: 'Apply to join our affiliate program. We review applications within 24-48 hours.',
              },
              {
                step: '2',
                title: 'Share Your Link',
                description: 'Get your unique referral link and share it with your audience via social media, email, or content.',
              },
              {
                step: '3',
                title: 'Get Paid',
                description: 'Earn 30% commission on every sale. Payouts processed monthly via PayPal or bank transfer.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Why Partner With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: '💰',
                title: 'Generous Commissions',
                description: 'Earn 30% on every sale, with no cap on earnings. Some affiliates earn $1,000+ monthly.',
              },
              {
                icon: '🔗',
                title: 'Long Cookie Duration',
                description: '90-day cookie means you get credit for sales even if customers take time to decide.',
              },
              {
                icon: '📊',
                title: 'Real-Time Dashboard',
                description: 'Track clicks, conversions, and earnings in real-time with our affiliate dashboard.',
              },
              {
                icon: '🎨',
                title: 'Marketing Materials',
                description: 'Get access to banners, email templates, and promotional content to help you succeed.',
              },
              {
                icon: '🤝',
                title: 'Dedicated Support',
                description: 'Our affiliate team is here to help you maximize your earnings and answer questions.',
              },
              {
                icon: '⚡',
                title: 'Fast Payouts',
                description: 'Get paid monthly via PayPal or bank transfer once you hit the $50 minimum.',
              },
            ].map((benefit) => (
              <Card key={benefit.title}>
                <CardContent className="p-6 flex gap-4">
                  <span className="text-3xl">{benefit.icon}</span>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                    <p className="text-sm text-slate-400">{benefit.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div className="max-w-md mx-auto mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Apply to Join</CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Application Received!</h3>
                  <p className="text-slate-400">
                    We'll review your application and get back to you within 24-48 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-200">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="website" className="text-sm font-medium text-slate-200">
                      Website / Social Media
                    </label>
                    <Input
                      id="website"
                      type="text"
                      placeholder="https://yoursite.com or @handle"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="audience" className="text-sm font-medium text-slate-200">
                      Estimated Audience Size
                    </label>
                    <select
                      id="audience"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                    >
                      <option value="">Select audience size</option>
                      <option value="under-1k">Under 1,000</option>
                      <option value="1k-10k">1,000 - 10,000</option>
                      <option value="10k-50k">10,000 - 50,000</option>
                      <option value="50k-100k">50,000 - 100,000</option>
                      <option value="100k+">100,000+</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    Submit Application
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
