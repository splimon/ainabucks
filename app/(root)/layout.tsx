/*
 * app/(root)/layout.tsx
 * Root layout component that conditionally renders navigation bars
 * based on user authentication status.
 */

import SignedInNavbar from "@/components/home/SignedInNavbar";
import SignedOutNavbar from "@/components/home/SignedOutNavbar";
import React, { ReactNode } from "react";
import { auth } from "./auth";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  return (
    <main className="root-container">
      <div className="mx-auto max-w">
        <div>
          {session ? <SignedInNavbar session={session} /> : <SignedOutNavbar />}
          <div className="pt-[73px]">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Layout;
