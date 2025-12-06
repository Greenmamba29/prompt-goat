'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/ui/section-header';

export default function PromptGeneratorPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="new" className="mb-4">Coming Soon</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            AI Prompt Generator
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            Create custom, high-quality prompts with our AI-powered generator. 
            Tell us what you need, and we'll craft the perfect prompt for any AI model.
          </p>
        </div>

        {/* Preview */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-slate-800 p-4 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-slate-400 text-sm ml-2">Prompt Generator Preview</span>
                </div>
              </div>
              <div className="p-8 bg-slate-900/50">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      What do you want to create?
                    </label>
                    <div className="bg-slate-800 rounded-lg p-4 text-slate-300 border border-slate-700">
                      <span className="text-cyan-400">Example:</span> A persuasive email to convince my boss to approve my budget for a new marketing campaign...
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">ChatGPT</Badge>
                    <Badge variant="outline">Claude</Badge>
                    <Badge variant="outline">Gemini</Badge>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Generated Prompt
                    </label>
                    <div className="bg-slate-950 rounded-lg p-4 border border-cyan-500/30 blur-sm">
                      <p className="text-slate-300 font-mono text-sm">
                        You are an expert business communication specialist with 15 years of experience in corporate persuasion and budget negotiations. I need you to help me write a compelling email to my direct manager requesting approval for a new marketing campaign budget...
                      </p>
                    </div>
                  </div>
                  <Button disabled className="w-full">
                    Generate Prompt
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto mb-16">
          <SectionHeader
            title="What You'll Get"
            description="Powerful features to create the perfect prompts"
            className="mb-8"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: '🎯',
                title: 'Smart Generation',
                description: 'Our AI understands context and creates targeted prompts for your specific use case.',
              },
              {
                icon: '🔧',
                title: 'Customizable Output',
                description: 'Adjust tone, length, and style to match your needs perfectly.',
              },
              {
                icon: '🤖',
                title: 'Multi-Model Support',
                description: 'Optimized prompts for ChatGPT, Claude, Gemini, Midjourney, and more.',
              },
              {
                icon: '📁',
                title: 'Save & Organize',
                description: 'Save your favorite prompts and organize them into collections.',
              },
              {
                icon: '📋',
                title: 'Template Library',
                description: 'Start from proven templates and customize to your needs.',
              },
              {
                icon: '♾️',
                title: 'Unlimited Generations',
                description: 'Generate as many prompts as you need with no limits.',
              },
            ].map((feature) => (
              <Card key={feature.title}>
                <CardContent className="p-6 flex gap-4">
                  <span className="text-3xl">{feature.icon}</span>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-400">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Waitlist */}
        <div className="max-w-md mx-auto">
          <Card className="border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 to-violet-500/10">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Be the First to Know
              </h2>
              <p className="text-slate-300 mb-6">
                Join the waitlist to get early access when the Prompt Generator launches.
              </p>
              {submitted ? (
                <div className="py-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold">You're on the list!</p>
                  <p className="text-slate-400 text-sm mt-2">We'll notify you when we launch.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full">
                    Join Waitlist
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
