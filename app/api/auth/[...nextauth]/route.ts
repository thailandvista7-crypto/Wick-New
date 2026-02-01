// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth"; // Update path to your auth.ts
export const { GET, POST } = handlers;
