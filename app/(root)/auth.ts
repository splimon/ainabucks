/*
 * app/(root)/auth.ts
 * Sets up NextAuth for user authentication using credentials.
 * It defines how users are authenticated and how sessions are managed.
 */

import NextAuth, { User } from "next-auth";
import { db } from "@/database/drizzle";
import { usersTable } from "@/database/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    // Validate user credentials
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Fetch user from database
        const user = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, credentials.email.toString()))
          .limit(1);

        // If user not found or password invalid, return null
        if (!user || user.length === 0) return null;

        // Compare provided password with stored hash
        const isPasswordValid = await compare(
          credentials.password.toString(),
          user[0].passwordHash,
        );

        // If password is invalid, return null
        if (!isPasswordValid) return null;

        // Return user object on successful authentication
        return {
          id: user[0].id.toString(),
          email: user[0].email,
          name: user[0].fullName,
        } as User;
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    // Include user ID and name in JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    // Include user ID and name in session object
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
});
