import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/cookies';

export async function POST(request: NextRequest) {
  try {
    await clearAuthCookies();

    return NextResponse.json({
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}
