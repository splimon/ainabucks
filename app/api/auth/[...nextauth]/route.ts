/*
* app/api/auth/[...nextauth]/route.ts
* NextAuth route handler for authentication.
*/

import { handlers } from "@/app/(root)/auth"; // Referring to the /app/(root)/auth.ts file
export const { GET, POST } = handlers;
