import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { assertRole } from '@/lib/rbac';
import { updateRequestSchema } from '@/lib/zod';

// PATCH /api/requests/[id] - NGO (owner) or Admin
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const roleCheck = assertRole(user, ['NGO', 'ADMIN']);
    if (roleCheck) return roleCheck;

    // Find the request
    const existingRequest = await prisma.request.findUnique({
      where: { id },
      select: { ngoId: true },
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    // Check ownership (NGO can only edit their own requests)
    if (user!.role === 'NGO' && existingRequest.ngoId !== user!.ngoId) {
      return NextResponse.json(
        { error: 'You can only edit your own requests' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validation = updateRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const updatedRequest = await prisma.request.update({
      where: { id },
      data: validation.data,
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

    return NextResponse.json({
      message: 'Request updated successfully',
      request: updatedRequest,
    });
  } catch (error) {
    console.error('Update request error:', error);
    return NextResponse.json(
      { error: 'Failed to update request' },
      { status: 500 }
    );
  }
}

// DELETE /api/requests/[id] - NGO (owner) or Admin
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const roleCheck = assertRole(user, ['NGO', 'ADMIN']);
    if (roleCheck) return roleCheck;

    // Find the request
    const existingRequest = await prisma.request.findUnique({
      where: { id },
      select: { ngoId: true },
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    // Check ownership (NGO can only delete their own requests)
    if (user!.role === 'NGO' && existingRequest.ngoId !== user!.ngoId) {
      return NextResponse.json(
        { error: 'You can only delete your own requests' },
        { status: 403 }
      );
    }

    await prisma.request.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Request deleted successfully',
    });
  } catch (error) {
    console.error('Delete request error:', error);
    return NextResponse.json(
      { error: 'Failed to delete request' },
      { status: 500 }
    );
  }
}
