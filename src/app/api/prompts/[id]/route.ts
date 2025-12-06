import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;

    const prompt = await prisma.prompt.findUnique({
      where: { id },
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    });

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }

    // Check if user has active subscription
    const hasActiveSubscription = session?.user?.hasActiveSubscription || false;

    const result = {
      id: prompt.id,
      title: prompt.title,
      shortDescription: prompt.shortDescription,
      // Only show full text if not premium OR user has active subscription
      fullPromptText: prompt.isPremium && !hasActiveSubscription
        ? prompt.fullPromptText.substring(0, 200) + '...\n\n[Premium content - Subscribe to access the full prompt]'
        : prompt.fullPromptText,
      model: prompt.model,
      category: prompt.category,
      tags: prompt.tags,
      isPremium: prompt.isPremium,
      isLocked: prompt.isPremium && !hasActiveSubscription,
      createdAt: prompt.createdAt.toISOString(),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching prompt:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompt' },
      { status: 500 }
    );
  }
}
