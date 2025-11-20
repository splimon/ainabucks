"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, getInitials } from "@/lib/utils";
import {
  Home,
  Users,
  Book,
  UserPlus,
  LogOut,
  Sprout,
  ArrowLeft,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

interface SidebarProps {
  className?: string;
  session?: Session | null;
}

const Sidebar: React.FC<SidebarProps> = ({ className, session }) => {
  const pathname = usePathname();

  const menuItems = [
    { id: "home", label: "Home", icon: Home, route: "/admin" },
    { id: "users", label: "All Users", icon: Users, route: "/admin/users" },
    { id: "books", label: "All Events", icon: Book, route: "/admin/events" },
    {
      id: "account",
      label: "Account Requests",
      icon: UserPlus,
      route: "/admin/requests",
    },
  ];

  return (
    <div
      className={cn(
        "w-64 bg-white border-r border-gray-200 flex flex-col h-screen justify-between fixed left-0 top-0 z-40",
        className,
      )}
    >
      {/* Logo Section */}
      <div>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center">
              <Sprout color="white" className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-green-700 transition-colors">
              ʻĀina Bucks
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col mt-6 px-3 space-y-1">
          {/* Back to User View Button */}
          <Link href="/profile">
            <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors cursor-pointer text-gray-600 hover:bg-gray-100 border border-gray-200">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to User View</span>
            </div>
          </Link>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected =
              (item.route !== "/admin" &&
                pathname.includes(item.route) &&
                item.route.length > 1) ||
              pathname === item.route;

            return (
              <Link href={item.route} key={item.id}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer",
                    isSelected
                      ? "bg-green-700 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="relative">
            <Avatar>
              <AvatarFallback className="bg-blue-200 text-green-900 font-semibold">
                {getInitials(session?.user?.name || "User")}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {session?.user?.name || "John Doe"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {session?.user?.email || "johndoe@example.com"}
            </p>
          </div>
          <button
            className="p-2 text-gray-400 hover:text-red-800 hover:cursor-pointer transition-colors"
            aria-label="Logout"
          >
            <LogOut
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-5 h-5"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
