import SignedInNavbar from "@/components/home/SignedInNavbar";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="root-container">
      <div className="mx-auto max-w">
        <SignedInNavbar />
        <div>{children}</div>
      </div>
    </main>
  );
};

export default Layout;
