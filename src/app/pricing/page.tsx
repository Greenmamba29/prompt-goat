'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { Skeleton } from '@/components/ui/skeleton';
import { FAQAccordion } from '@/components/ui/faq-accordion';

interface Plan {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  billingInterval: string;
  features: string[];
  isPopular: boolean;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function PricingPage() {
  const { data: session } = useSession();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, faqsRes] = await Promise.all([
          fetch('/api/plans'),
          fetch('/api/faq'),
        ]);
        const plansData = await plansRes.json();
        const faqsData = await faqsRes.json();
        
        // Filter to show only main plans (exclude monthly for cleaner display)
        const mainPlans = plansData.filter((p: Plan) => p.billingInterval === 'LIFETIME');
        setPlans(mainPlans);
        setFaqs(faqsData.slice(0, 6)); // Show first 6 FAQs
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCheckout = async (planId: string) => {
    if (!session) {
      window.location.href = '/login?redirect=/pricing';
      return;
    }

    setCheckoutLoading(planId);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        // In a real app, redirect to Stripe checkout
        // For now, show success and redirect to prompts
        alert('Subscription activated! Redirecting to prompts...');
        window.location.href = '/prompts';
      } else {
        alert(data.error || 'Checkout failed. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(0)}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Simple Pricing"
            title="Invest in Your AI Productivity"
            description="One-time payment. Lifetime access. No subscriptions, no hidden fees. Choose the plan that fits your needs."
          />
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-8 w-24 mb-4" />
                  <Skeleton className="h-12 w-32 mb-4" />
                  <Skeleton className="h-4 w-full mb-8" />
                  <div className="space-y-3">
                    {[...Array(5)].map((_, j) => (
                      <Skeleton key={j} className="h-4 w-full" />
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative flex flex-col ${
                    plan.isPopular
                      ? 'border-cyan-500 shadow-lg shadow-cyan-500/20 scale-105'
                      : ''
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white border-0 px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-8 pt-8">
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-white">
                        {formatPrice(plan.priceCents)}
                      </span>
                      <span className="text-slate-400 ml-2">one-time</span>
                    </div>
                    <CardDescription>
                      {plan.slug === 'starter' && 'Perfect for beginners getting started with AI'}
                      {plan.slug === 'pro' && 'Best value for professionals and creators'}
                      {plan.slug === 'ultimate' && 'Everything you need for maximum productivity'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <svg
                            className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-8">
                    <Button
                      className="w-full"
                      variant={plan.isPopular ? 'default' : 'outline'}
                      size="lg"
                      onClick={() => handleCheckout(plan.id)}
                      disabled={checkoutLoading === plan.id}
                    >
                      {checkoutLoading === plan.id ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        `Get ${plan.name}`
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="flex items-center gap-2 text-slate-400">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Instant Access</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>7-Day Money Back</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Lifetime Updates</span>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Everything You Get"
            description="All plans include these powerful features to supercharge your AI workflow."
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: '📚',
                title: '100+ Premium Prompts',
                description: 'Curated prompts for every use case, from marketing to coding.',
              },
              {
                icon: '🔄',
                title: 'Regular Updates',
                description: 'New prompts added monthly. Stay ahead with the latest AI techniques.',
              },
              {
                icon: '🤖',
                title: 'Multi-Model Support',
                description: 'Prompts optimized for ChatGPT, Claude, Gemini, and more.',
              },
              {
                icon: '⚡',
                title: 'Copy & Paste Ready',
                description: 'Every prompt is ready to use. No setup or configuration needed.',
              },
            ].map((feature, index) => (
              <Card key={index} className="text-center p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="py-16 border-t border-slate-800">
          <div className="container mx-auto px-4">
            <SectionHeader
              title="Frequently Asked Questions"
              description="Got questions? We've got answers."
              className="mb-12"
            />
            <div className="max-w-3xl mx-auto">
              <FAQAccordion items={faqs} />
            </div>
            <div className="text-center mt-8">
              <Link href="/prompt-library#faq">
                <Button variant="ghost">View All FAQs →</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-16 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Transform Your AI Workflow?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already saving hours every week with Prompt Goat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => {
                const popularPlan = plans.find((p) => p.isPopular);
                if (popularPlan) handleCheckout(popularPlan.id);
              }}
              disabled={loading}
            >
              Get Started Now
            </Button>
            <Link href="/prompts">
              <Button variant="outline" size="lg">
                Browse Free Prompts
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
