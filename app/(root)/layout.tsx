import SignedInNavbar from "@/components/home/SignedInNavbar";
import SignedOutNavbar from "@/components/home/SignedOutNavbar";
import React, { ReactNode } from "react";
import { auth } from "./auth";
import Profile from "@/components/profile/Profile";
import MainHome from "@/components/home/MainHome";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  return (
    <main className="root-container">
      <div className="mx-auto max-w">
        <div>
          {session ? <SignedInNavbar /> : <SignedOutNavbar />}
          {session ? <Profile /> : <MainHome />}
          {children}
          </div>
      </div>
    </main>
  );
};

export default Layout;
