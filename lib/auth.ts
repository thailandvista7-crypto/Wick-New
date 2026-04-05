import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
}

export function generateToken(payload: any) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, getJwtSecret()) as any;
  } catch (error) {
    return null;
  }
}

export function getAuthUser(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return null;

  return verifyToken(token);
}