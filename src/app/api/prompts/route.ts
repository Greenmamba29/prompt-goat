import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface PromptWithCategory {
  id: string;
  title: string;
  shortDescription: string;
  fullPromptText: string;
  model: string;
  tags: string[];
  isPremium: boolean;
  createdAt: Date;
  category: { name: string; slug: string };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const model = searchParams.get('model') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');
    
    const skip = (page - 1) * pageSize;

    // Build where clause dynamically
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search.toLowerCase()] } },
      ];
    }
    
    if (category) {
      where.category = { slug: category };
    }
    
    if (model) {
      where.model = model;
    }

    const [prompts, total] = await Promise.all([
      prisma.prompt.findMany({
        where,
        include: {
          category: {
            select: { name: true, slug: true },
          },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.prompt.count({ where }),
    ]);

    // Check if user has active subscription
    const hasActiveSubscription = session?.user?.hasActiveSubscription || false;

    const result = (prompts as PromptWithCategory[]).map((prompt) => ({
      id: prompt.id,
      title: prompt.title,
      shortDescription: prompt.shortDescription,
      // Only show full text if not premium OR user has active subscription
      fullPromptText: prompt.isPremium && !hasActiveSubscription
        ? prompt.fullPromptText.substring(0, 100) + '...'
        : prompt.fullPromptText,
      model: prompt.model,
      category: prompt.category,
      tags: prompt.tags,
      isPremium: prompt.isPremium,
      isLocked: prompt.isPremium && !hasActiveSubscription,
    }));

    return NextResponse.json({
      prompts: result,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}
