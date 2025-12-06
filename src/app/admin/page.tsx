'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

type Tab = 'prompts' | 'categories' | 'faq' | 'plans' | 'users';

interface Prompt {
  id: string;
  title: string;
  model: string;
  isPremium: boolean;
  category: { name: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  promptCount: number;
  isNew: boolean;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

interface Plan {
  id: string;
  name: string;
  priceCents: number;
  billingInterval: string;
  isPopular: boolean;
}

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('prompts');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Check auth
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login?redirect=/admin');
      return;
    }
    
    if (session.user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  // Fetch data based on active tab
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'prompts':
          const promptsRes = await fetch('/api/prompts?pageSize=100');
          const promptsData = await promptsRes.json();
          setPrompts(promptsData.prompts || []);
          break;
        case 'categories':
          const categoriesRes = await fetch('/api/categories');
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
          break;
        case 'faq':
          const faqRes = await fetch('/api/faq');
          const faqData = await faqRes.json();
          setFaqs(faqData);
          break;
        case 'plans':
          const plansRes = await fetch('/api/plans');
          const plansData = await plansRes.json();
          setPlans(plansData);
          break;
        case 'users':
          const usersRes = await fetch('/api/admin/users');
          const usersData = await usersRes.json();
          setUsers(usersData.users || []);
          break;
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchData();
    }
  }, [session, fetchData]);

  if (status === 'loading' || !session || session.user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'prompts', label: 'Prompts' },
    { key: 'categories', label: 'Categories' },
    { key: 'faq', label: 'FAQ' },
    { key: 'plans', label: 'Plans' },
    { key: 'users', label: 'Users' },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage your Prompt Goat content and settings.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <p className="text-slate-400 text-sm">Total Prompts</p>
              <p className="text-2xl font-bold text-white">{prompts.length || '—'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-slate-400 text-sm">Categories</p>
              <p className="text-2xl font-bold text-white">{categories.length || '—'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-slate-400 text-sm">FAQ Items</p>
              <p className="text-2xl font-bold text-white">{faqs.length || '—'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-slate-400 text-sm">Plans</p>
              <p className="text-2xl font-bold text-white">{plans.length || '—'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-800 mb-6">
          <nav className="flex gap-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <>
              {/* Prompts Tab */}
              {activeTab === 'prompts' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Prompts ({prompts.length})</h2>
                    <Button size="sm">+ Add Prompt</Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">Title</th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">Category</th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">Model</th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">Premium</th>
                          <th className="text-right py-3 px-4 text-slate-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prompts.map((prompt) => (
                          <tr key={prompt.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                            <td className="py-3 px-4 text-white">{prompt.title}</td>
                            <td className="py-3 px-4 text-slate-300">{prompt.category.name}</td>
                            <td className="py-3 px-4">
                              <Badge variant="outline">{prompt.model}</Badge>
                            </td>
                            <td className="py-3 px-4">
                              {prompt.isPremium ? (
                                <Badge variant="warning">Premium</Badge>
                              ) : (
                                <Badge variant="outline">Free</Badge>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="ghost" size="sm">Edit</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Categories Tab */}
              {activeTab === 'categories' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Categories ({categories.length})</h2>
                    <Button size="sm">+ Add Category</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <Card key={category.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-white">{category.name}</h3>
                            {category.isNew && <Badge variant="new">New</Badge>}
                          </div>
                          <p className="text-sm text-slate-400 mb-2">/{category.slug}</p>
                          <p className="text-sm text-slate-400">{category.promptCount} prompts</p>
                          <div className="mt-3 flex gap-2">
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm" className="text-red-400">Delete</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ Tab */}
              {activeTab === 'faq' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">FAQ Items ({faqs.length})</h2>
                    <Button size="sm">+ Add FAQ</Button>
                  </div>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <Card key={faq.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-slate-500">#{index + 1}</span>
                                <h3 className="font-medium text-white">{faq.question}</h3>
                              </div>
                              <p className="text-sm text-slate-400 line-clamp-2">{faq.answer}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm" className="text-red-400">Delete</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Plans Tab */}
              {activeTab === 'plans' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Pricing Plans ({plans.length})</h2>
                    <Button size="sm">+ Add Plan</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {plans.map((plan) => (
                      <Card key={plan.id} className={plan.isPopular ? 'border-cyan-500' : ''}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-white">{plan.name}</h3>
                            {plan.isPopular && <Badge>Popular</Badge>}
                          </div>
                          <p className="text-2xl font-bold text-white mb-1">
                            ${(plan.priceCents / 100).toFixed(0)}
                          </p>
                          <p className="text-sm text-slate-400 mb-3">{plan.billingInterval.toLowerCase()}</p>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Users ({users.length})</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">Email</th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">Name</th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">Role</th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">Joined</th>
                          <th className="text-right py-3 px-4 text-slate-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                            <td className="py-3 px-4 text-white">{user.email}</td>
                            <td className="py-3 px-4 text-slate-300">{user.name || '—'}</td>
                            <td className="py-3 px-4">
                              <Badge variant={user.role === 'ADMIN' ? 'default' : 'outline'}>
                                {user.role}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-slate-400">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="ghost" size="sm">View</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
