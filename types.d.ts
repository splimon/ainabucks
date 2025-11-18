/*
* types.d.ts
* Shared TypeScript types
*/

interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Standard server action response
interface ServerActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}