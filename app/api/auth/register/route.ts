import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signAccessToken, signRefreshToken } from '@/lib/auth';
import { setAuthCookies } from '@/lib/cookies';
import { registerSchema } from '@/lib/zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { name, email, password, role, ngo } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user and NGO if role is NGO
    let user;
    if (role === 'NGO' && ngo) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role,
          ngo: {
            create: {
              name: ngo.name,
              description: ngo.description,
              verified: false,
            },
          },
        },
        include: {
          ngo: true,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role,
        },
        include: {
          ngo: true,
        },
      });
    }

    // Create JWT tokens
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      ngoId: user.ngo?.id,
    };

    const accessToken = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);

    // Set cookies
    await setAuthCookies(accessToken, refreshToken);

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          ngoId: user.ngo?.id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
