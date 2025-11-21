import { Search } from "lucide-react";
import { Session } from "next-auth";
import React from "react";
import { Input } from "../ui/input";

const Header = ({ session }: { session: Session }) => {
  return (
    <header className="sticky top-0 px-8 py-4 z-30 bg-white border-b">
      <div className="flex items-center justify-between gap-8">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Welcome, {session?.user?.name || "Admin"}!
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Monitor all of your users and volunteer events here
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
