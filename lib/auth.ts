import { NextRequest } from 'next/server';
import { getServerSession } from "next-auth/next"; // CRITICAL: Fixes Vercel Error
import { authOptions } from "./auth-config"; // Path to your NextAuth settings

// Keep your interface for typing
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * HELPER: Use this in your Route Handlers to get the user
 * This replaces your manual cookie/JWT check with NextAuth's secure check.
 */
export async function getAuthUser() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) return null;

  return {
    userId: (session.user as any).id,
    email: session.user.email,
    role: (session.user as any).role,
  } as TokenPayload;
}
