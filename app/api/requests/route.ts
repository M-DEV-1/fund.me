import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { assertRole } from '@/lib/rbac';
import { createRequestSchema } from '@/lib/zod';

// GET /api/requests - Public (list open requests) or NGO-filtered
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const ngoId = searchParams.get('ngoId');

    const where: any = {};
    
    if (status) {
      where.status = status;
    } else {
      where.status = 'OPEN'; // Default to OPEN requests
    }

    if (ngoId) {
      where.ngoId = ngoId;
    }

    const requests = await prisma.request.findMany({
      where,
      include: {
        ngo: {
          select: {
            id: true,
            name: true,
            verified: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Get requests error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

// POST /api/requests - NGO only (create request)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const roleCheck = assertRole(user, ['NGO']);
    if (roleCheck) return roleCheck;

    if (!user?.ngoId) {
      return NextResponse.json(
        { error: 'NGO not found for this user' },
        { status: 400 }
      );
    }

    // Check if NGO is verified
    const ngo = await prisma.nGO.findUnique({
      where: { id: user.ngoId },
      select: { verified: true },
    });

    if (!ngo?.verified) {
      return NextResponse.json(
        { error: 'Your NGO must be verified before creating requests' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validation = createRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { itemName, quantity, unit, description } = validation.data;

    const newRequest = await prisma.request.create({
      data: {
        ngoId: user.ngoId,
        itemName,
        quantity,
        unit,
        description,
      },
      include: {
        ngo: {
          select: {
            id: true,
            name: true,
            verified: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: 'Request created successfully', request: newRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create request error:', error);
    return NextResponse.json(
      { error: 'Failed to create request' },
      { status: 500 }
    );
  }
}
