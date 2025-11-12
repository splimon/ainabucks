import SignedOutNavbar from "@/components/home/SignedOutNavbar";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="root-container">
      <div className="mx-auto max-w">
        <SignedOutNavbar />
        <div>{children}</div>
      </div>
    </main>
  );
};

export default Layout;
