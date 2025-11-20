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

// Extend NextAuth types to include role and status
declare module "next-auth" {
  interface User {
    role: "USER" | "ADMIN";
    status: "PENDING" | "APPROVED" | "REJECTED";
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "USER" | "ADMIN";
      status: "PENDING" | "APPROVED" | "REJECTED";
    };
  }
}

// NextAuth configuration
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

        // Return user object on successful authentication (including role and status)
        return {
          id: user[0].id.toString(),
          email: user[0].email,
          name: user[0].fullName,
          role: user[0].role,
          status: user[0].status,
        } as User;
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    // Include user ID, name, role, and status in JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
        token.status = user.status;
      }
      return token;
    },
    // Include user ID, name, role, and status in session object
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.role = token.role as "USER" | "ADMIN";
        session.user.status = token.status as
          | "PENDING"
          | "APPROVED"
          | "REJECTED";
      }
      return session;
    },
    // Redirect users based on their account status
    async authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const userStatus = auth?.user?.status;
      const userRole = auth?.user?.role;

      // Public routes that don't require authentication
      const isPublicRoute =
        pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

      // Allow access to pending approval page for pending users
      if (pathname === "/pending-approval") {
        return isLoggedIn;
      }

      // Redirect pending or rejected users to pending approval page
      if (
        isLoggedIn &&
        (userStatus === "PENDING" || userStatus === "REJECTED") &&
        !pathname.startsWith("/pending-approval") &&
        !isPublicRoute
      ) {
        const url = request.nextUrl.clone();
        url.pathname = "/pending-approval";
        return Response.redirect(url);
      }

      // Admin routes - only allow APPROVED admins
      if (pathname.startsWith("/admin")) {
        return isLoggedIn && userRole === "ADMIN" && userStatus === "APPROVED";
      }

      // Protected routes - require authentication and approved status
      if (!isPublicRoute) {
        return isLoggedIn && userStatus === "APPROVED";
      }

      // Public routes
      return true;
    },
  },
});
