/*
 * lib/actions/auth.ts
 *
 * This file contains server-side actions for user authentication, including sign-up and sign-in functionalities.
 * It interacts with the database to create new users and validate existing ones.
 * It also incorporates rate limiting to prevent DDoS attacks during the sign-in/sign-up process.
 */

"use server";

import { db } from "@/database/drizzle";
import { usersTable } from "@/database/schema";
import { eq } from "drizzle-orm";
import { hash, genSalt } from "bcryptjs";
import { signIn } from "@/app/(root)/auth";
import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";

/* Helper function to sign in user after sign up */
export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">,
) => {
  const { email, password } = params;

  // Get user IP address from headers for rate limiting or logging purposes
  const ip = (await headers()).get("x-forwarded-for") || "unknown";
  const {success} = await ratelimit.limit(ip); // Implement rate limiting logic as needed

  if (!success) return redirect('/too-fast');

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // If sign in failed, return error message
    if (result?.error) {
      return { success: false, message: result.error };
    }

    // Sign in successful
    return { success: true, message: "Sign in successful" };
  } catch (error) {
    console.log(error, "SIGN IN ERROR");
    return { success: false, message: "SIGN IN ERROR" };
  }
};

/* Main sign up function */
export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, password, confirmPassword } = params;

  // Get user IP address from headers for rate limiting or logging purposes
  const ip = (await headers()).get("x-forwarded-for") || "unknown";
  const {success} = await ratelimit.limit(ip); // Implement rate limiting logic as needed

  if (!success) return redirect('/too-fast');

  // Check if the user already exists
  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  // If user exists, return an error
  if (existingUser.length > 0) {
    return { success: false, message: "User already exists" };
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return { success: false, message: "Passwords do not match" };
  }

  // Hash the password
  const salt = await genSalt(10); // Salt = Complexity upon which password is hashed
  const hashedPassword = await hash(password, salt);

  // Create the new user
  try {
    await db.insert(usersTable).values({
      fullName,
      email,
      passwordHash: hashedPassword,
    });
    await signInWithCredentials({ email, password });
    return { success: true, message: "User created successfully" };
  } catch (error) {
    console.log(error, "SIGN UP ERROR");
    return { success: false, message: "SIGN UP ERROR" };
  }
};
