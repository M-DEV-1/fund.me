import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { assertRole } from '@/lib/rbac';
import { updateDonationSchema } from '@/lib/zod';

// PATCH /api/donations/[id] - NGO (if to their NGO) or Admin
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const roleCheck = assertRole(user, ['NGO', 'ADMIN']);
    if (roleCheck) return roleCheck;

    // Find the donation
    const donation = await prisma.donation.findUnique({
      where: { id },
      select: { ngoId: true },
    });

    if (!donation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      );
    }

    // Check if NGO owns this donation
    if (user!.role === 'NGO' && donation.ngoId !== user!.ngoId) {
      return NextResponse.json(
        { error: 'You can only update donations to your NGO' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validation = updateDonationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const updatedDonation = await prisma.donation.update({
      where: { id },
      data: {
        status: validation.data.status,
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

    return NextResponse.json({
      message: 'Donation status updated successfully',
      donation: updatedDonation,
    });
  } catch (error) {
    console.error('Update donation error:', error);
    return NextResponse.json(
      { error: 'Failed to update donation' },
      { status: 500 }
    );
  }
}
