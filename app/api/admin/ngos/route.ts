import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { assertRole } from '@/lib/rbac';
import { verifyNGOSchema } from '@/lib/zod';

// GET /api/admin/ngos - Admin only (list all NGOs)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const roleCheck = assertRole(user, ['ADMIN']);
    if (roleCheck) return roleCheck;

    const ngos = await prisma.nGO.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            requests: true,
            donations: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ ngos });
  } catch (error) {
    console.error('Get NGOs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NGOs' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/ngos - Admin only (verify/unverify NGO)
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const roleCheck = assertRole(user, ['ADMIN']);
    if (roleCheck) return roleCheck;

    const body = await request.json();
    
    // Validate input
    const validation = verifyNGOSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { ngoId, verified } = validation.data;

    // Check if NGO exists
    const ngo = await prisma.nGO.findUnique({
      where: { id: ngoId },
    });

    if (!ngo) {
      return NextResponse.json(
        { error: 'NGO not found' },
        { status: 404 }
      );
    }

    const updatedNGO = await prisma.nGO.update({
      where: { id: ngoId },
      data: { verified },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: `NGO ${verified ? 'verified' : 'unverified'} successfully`,
      ngo: updatedNGO,
    });
  } catch (error) {
    console.error('Verify NGO error:', error);
    return NextResponse.json(
      { error: 'Failed to update NGO verification status' },
      { status: 500 }
    );
  }
}
