import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { assertRole } from '@/lib/rbac';
import { createDonationSchema } from '@/lib/zod';

// GET /api/donations - Role-aware (Donor: mine, NGO: to my NGO, Admin: all)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let where: any = {};

    if (user.role === 'DONOR') {
      where.donorId = user.userId;
    } else if (user.role === 'NGO' && user.ngoId) {
      where.ngoId = user.ngoId;
    }
    // Admin sees all donations (no filter)

    const donations = await prisma.donation.findMany({
      where,
      include: {
        donor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ngo: {
          select: {
            id: true,
            name: true,
          },
        },
        request: {
          select: {
            id: true,
            itemName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ donations });
  } catch (error) {
    console.error('Get donations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
      { status: 500 }
    );
  }
}

// POST /api/donations - Donor only (create donation)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const roleCheck = assertRole(user, ['DONOR']);
    if (roleCheck) return roleCheck;

    const body = await request.json();
    
    // Validate input
    const validation = createDonationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { ngoId, requestId, donationType, quantity, notes } = validation.data;

    // Verify NGO exists and is verified
    const ngo = await prisma.nGO.findUnique({
      where: { id: ngoId },
      select: { verified: true },
    });

    if (!ngo) {
      return NextResponse.json(
        { error: 'NGO not found' },
        { status: 404 }
      );
    }

    if (!ngo.verified) {
      return NextResponse.json(
        { error: 'Cannot donate to unverified NGO' },
        { status: 400 }
      );
    }

    // If requestId provided, verify it belongs to the NGO
    if (requestId) {
      const requestExists = await prisma.request.findFirst({
        where: {
          id: requestId,
          ngoId,
        },
      });

      if (!requestExists) {
        return NextResponse.json(
          { error: 'Request not found or does not belong to this NGO' },
          { status: 404 }
        );
      }
    }

    const donation = await prisma.donation.create({
      data: {
        donorId: user!.userId,
        ngoId,
        requestId,
        donationType,
        quantity,
        notes,
      },
      include: {
        donor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ngo: {
          select: {
            id: true,
            name: true,
          },
        },
        request: {
          select: {
            id: true,
            itemName: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: 'Donation created successfully', donation },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create donation error:', error);
    return NextResponse.json(
      { error: 'Failed to create donation' },
      { status: 500 }
    );
  }
}
