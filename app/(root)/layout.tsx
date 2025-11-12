import Navbar from "@/components/home/Navbar";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="root-container">
      <div className="mx-auto max-w">
        <Navbar />
        <div>{children}</div>
      </div>
    </main>
  );
};

export default Layout;
