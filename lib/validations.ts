/*
 * lib/validations.ts
 * Zod schemas for validating sign-up and sign-in forms.
 */

import { z } from "zod";

/* Sign-Up Form Validation Schema */
export const SignUpSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(8, "Password must be the same as above"),
});

/* Sign-In Form Validation Schema */
export const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
