import { Search } from "lucide-react";
import { Session } from "next-auth";
import React from "react";
import { Input } from "../ui/input";

const Header = ({ session }: { session: Session }) => {
  return (
    <header className="sticky top-0 px-8 py-4 z-30 backdrop-blur-lg">
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

        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search users, events by title, date, or location"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
