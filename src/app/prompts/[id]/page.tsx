'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface PromptDetail {
  id: string;
  title: string;
  shortDescription: string;
  fullPromptText: string;
  model: string;
  tags: string[];
  isPremium: boolean;
  category: {
    name: string;
    slug: string;
  };
  createdAt: string;
}

export default function PromptDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState<PromptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const hasAccess = !prompt?.isPremium || session?.user?.hasActiveSubscription;

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const res = await fetch(`/api/prompts/${params.id}`);
        if (!res.ok) {
          throw new Error('Prompt not found');
        }
        const data = await res.json();
        setPrompt(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load prompt');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPrompt();
    }
  }, [params.id]);

  const handleCopy = async () => {
    if (!prompt || !hasAccess) return;
    
    try {
      await navigator.clipboard.writeText(prompt.fullPromptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getModelBadgeVariant = (model: string) => {
    switch (model) {
      case 'CHATGPT':
        return 'default';
      case 'CLAUDE':
        return 'secondary';
      case 'GEMINI':
        return 'outline';
      case 'MIDJOURNEY':
      case 'DALLE':
        return 'success';
      default:
        return 'outline';
    }
  };

  const formatModelName = (model: string) => {
    switch (model) {
      case 'CHATGPT':
        return 'ChatGPT';
      case 'CLAUDE':
        return 'Claude';
      case 'GEMINI':
        return 'Gemini';
      case 'MIDJOURNEY':
        return 'Midjourney';
      case 'DALLE':
        return 'DALL-E';
      default:
        return model;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Prompt Not Found</h1>
          <p className="text-slate-400 mb-8">{error || 'The prompt you&apos;re looking for doesn&apos;t exist.'}</p>
          <Link href="/prompts">
            <Button>Browse All Prompts</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-slate-400">
            <li>
              <Link href="/prompts" className="hover:text-cyan-400 transition-colors">
                Prompts
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={`/prompts?category=${prompt.category.slug}`}
                className="hover:text-cyan-400 transition-colors"
              >
                {prompt.category.name}
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-200 truncate max-w-[200px]">{prompt.title}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant={getModelBadgeVariant(prompt.model)}>
              {formatModelName(prompt.model)}
            </Badge>
            <Badge variant="outline">{prompt.category.name}</Badge>
            {prompt.isPremium && <Badge variant="warning">Premium</Badge>}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            {prompt.title}
          </h1>
          <p className="text-lg text-slate-400">{prompt.shortDescription}</p>
        </div>

        {/* Prompt Content Card */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Prompt</CardTitle>
            {hasAccess && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <svg
                      className="w-4 h-4"
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
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy Prompt
                  </>
                )}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {hasAccess ? (
              <div className="bg-slate-950 rounded-lg p-6 border border-slate-700">
                <pre className="whitespace-pre-wrap text-slate-200 font-mono text-sm leading-relaxed">
                  {prompt.fullPromptText}
                </pre>
              </div>
            ) : (
              <div className="relative">
                <div className="bg-slate-950 rounded-lg p-6 border border-slate-700 blur-sm select-none">
                  <pre className="whitespace-pre-wrap text-slate-200 font-mono text-sm leading-relaxed">
                    {prompt.fullPromptText.substring(0, 200)}...
                    {'\n\n'}
                    [Premium content - Subscribe to access the full prompt]
                    {'\n\n'}
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </pre>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 rounded-lg">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Premium Prompt
                    </h3>
                    <p className="text-slate-400 mb-6 max-w-sm">
                      Unlock this prompt and 100+ more with a Prompt Goat subscription.
                    </p>
                    <Link href="/pricing">
                      <Button size="lg">Unlock Premium Access</Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tags */}
        {prompt.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {prompt.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/prompts?search=${encodeURIComponent(tag)}`}
                  className="text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-full transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* How to Use */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">How to Use This Prompt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 font-bold">
                1
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Copy the prompt</h4>
                <p className="text-slate-400">
                  Click the &quot;Copy Prompt&quot; button above to copy the full prompt text to your clipboard.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 font-bold">
                2
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Open {formatModelName(prompt.model)}</h4>
                <p className="text-slate-400">
                  Navigate to {formatModelName(prompt.model)} in your browser or app.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 font-bold">
                3
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Paste and customize</h4>
                <p className="text-slate-400">
                  Paste the prompt and replace any placeholder text (like [YOUR TOPIC]) with your specific information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Prompts CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/prompts?category=${prompt.category.slug}`}>
            <Button variant="outline" className="w-full sm:w-auto">
              More {prompt.category.name} Prompts
            </Button>
          </Link>
          <Link href="/prompts">
            <Button variant="ghost" className="w-full sm:w-auto">
              Browse All Prompts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
