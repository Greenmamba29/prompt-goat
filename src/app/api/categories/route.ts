import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface CategoryWithCount {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  isNew: boolean;
  _count: { prompts: number };
}

export async function GET() {
  try {
    const categories = await prisma.promptCategory.findMany({
      include: {
        _count: {
          select: { prompts: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    const result = (categories as CategoryWithCount[]).map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      description: cat.description,
      icon: cat.icon,
      isNew: cat.isNew,
      promptCount: cat._count.prompts,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
