// lib/auth.ts
import { auth } from "@/auth"; // Ensure this points to your auth.ts config file

// Keep your interface for typing
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * HELPER: Use this in your Route Handlers to get the user
 * In v5, auth() works in API Routes, Server Components, and Actions.
 */
export async function getAuthUser() {
  const session = await auth();
  
  if (!session || !session.user) return null;

  // v5 typically attaches custom fields directly to the user object 
  // if you've configured your callbacks correctly in auth.ts
  return {
    userId: session.user.id,
    email: session.user.email,
    role: (session.user as any).role, // Casting if types aren't augmented yet
  } as TokenPayload;
}
