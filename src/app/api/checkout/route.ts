import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to checkout' },
        { status: 401 }
      );
    }

    const { planId } = await request.json();

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    // Verify plan exists
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    // Calculate valid until date based on billing interval
    let validUntil: Date;
    const now = new Date();
    
    switch (plan.billingInterval) {
      case 'LIFETIME':
        // Set to far future date for lifetime plans
        validUntil = new Date('2099-12-31');
        break;
      case 'YEARLY':
        validUntil = new Date(now.setFullYear(now.getFullYear() + 1));
        break;
      case 'MONTHLY':
      default:
        validUntil = new Date(now.setMonth(now.getMonth() + 1));
        break;
    }

    // Check for existing active subscription
    const existingSubscription = await prisma.userSubscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
      },
    });

    if (existingSubscription) {
      // Update existing subscription
      await prisma.userSubscription.update({
        where: { id: existingSubscription.id },
        data: {
          planId,
          validUntil,
        },
      });
    } else {
      // Create new subscription
      await prisma.userSubscription.create({
        data: {
          userId: session.user.id,
          planId,
          status: 'ACTIVE',
          validUntil,
        },
      });
    }

    // In a real application, you would:
    // 1. Create a Stripe checkout session
    // 2. Redirect user to Stripe
    // 3. Handle webhook for successful payment
    // 4. Then create/update the subscription

    return NextResponse.json({
      success: true,
      message: 'Subscription activated successfully',
      // In production, this would be a Stripe checkout URL
      // checkoutUrl: stripeSession.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    );
  }
}
