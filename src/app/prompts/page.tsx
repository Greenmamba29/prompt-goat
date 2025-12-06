'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/ui/section-header';
import { Skeleton } from '@/components/ui/skeleton';

interface Prompt {
  id: string;
  title: string;
  shortDescription: string;
  model: string;
  tags: string[];
  isPremium: boolean;
  category: {
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  slug: string;
  name: string;
  promptCount: number;
}

const MODEL_OPTIONS = [
  { value: '', label: 'All Models' },
  { value: 'CHATGPT', label: 'ChatGPT' },
  { value: 'CLAUDE', label: 'Claude' },
  { value: 'GEMINI', label: 'Gemini' },
  { value: 'MIDJOURNEY', label: 'Midjourney' },
  { value: 'DALLE', label: 'DALL-E' },
  { value: 'OTHER', label: 'Other' },
];

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  const fetchPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedCategory) params.set('category', selectedCategory);
      if (selectedModel) params.set('model', selectedModel);
      params.set('page', page.toString());
      params.set('pageSize', '12');

      const res = await fetch(`/api/prompts?${params.toString()}`);
      const data = await res.json();
      setPrompts(data.prompts || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedModel, page]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchPrompts();
    }, 300);
    return () => clearTimeout(debounce);
  }, [fetchPrompts]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
    setPage(1);
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Browse All Prompts"
            title="Find the Perfect Prompt"
            description="Explore our complete library of AI prompts. Search, filter, and discover prompts that will transform your workflow."
          />
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b border-slate-800 sticky top-16 bg-slate-950/95 backdrop-blur-sm z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search prompts..."
                value={search}
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name} ({cat.promptCount})
                  </option>
                ))}
              </select>
              <select
                value={selectedModel}
                onChange={handleModelChange}
                className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
              >
                {MODEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : prompts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg">No prompts found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('');
                  setSelectedModel('');
                  setPage(1);
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prompts.map((prompt) => (
                  <Link key={prompt.id} href={`/prompts/${prompt.id}`}>
                    <Card className="h-full hover:border-cyan-500/50 transition-colors cursor-pointer group">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg group-hover:text-cyan-400 transition-colors">
                            {prompt.title}
                          </CardTitle>
                          {prompt.isPremium && (
                            <Badge variant="warning" className="shrink-0">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="line-clamp-2">
                          {prompt.shortDescription}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={getModelBadgeVariant(prompt.model)}>
                            {formatModelName(prompt.model)}
                          </Badge>
                          <span className="text-slate-500 text-sm">
                            {prompt.category.name}
                          </span>
                        </div>
                        {prompt.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {prompt.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {prompt.tags.length > 3 && (
                              <span className="text-xs text-slate-500">
                                +{prompt.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-slate-400">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Unlock All Premium Prompts
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Get instant access to our entire library of premium prompts with a one-time purchase.
          </p>
          <Link href="/pricing">
            <Button size="lg">View Pricing Plans</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
