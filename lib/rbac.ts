import { NextResponse } from 'next/server';
import { JWTPayload } from './auth';

type Role = 'DONOR' | 'NGO' | 'ADMIN';

export function requireRole(user: JWTPayload | null, allowedRoles: Role[]): boolean {
  if (!user) {
    return false;
  }

  return allowedRoles.includes(user.role);
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  );
}

export function forbiddenResponse(message = 'Forbidden') {
  return NextResponse.json(
    { error: message },
    { status: 403 }
  );
}

export function assertRole(
  user: JWTPayload | null,
  allowedRoles: Role[]
): NextResponse | null {
  if (!user) {
    return unauthorizedResponse();
  }

  if (!allowedRoles.includes(user.role)) {
    return forbiddenResponse('You do not have permission to access this resource');
  }

  return null;
}
