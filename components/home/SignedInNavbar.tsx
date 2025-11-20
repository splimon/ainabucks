/*
 * components/home/SignedInNavbar.tsx
 * Renders the navigation bar for signed-in users with links
 * to Volunteer, Rewards, Profile with Avatar, and a Sign Out button.
 */

"use client";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { LogOut, Sprout } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Session } from "next-auth";
import { getInitials } from "@/lib/utils";

const SignedInNavbar = ({ session }: { session: Session }) => {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-6 h-6"
              stroke="white"
              strokeWidth="2"
            >
              <Sprout color="white" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-green-800 hover:text-green-900 transition-colors">
            ʻĀina Bucks
          </span>
        </div>

        {/* Navigation Menu */}
        <div className="flex items-center gap-8">
          <NavigationMenu>
            <NavigationMenuList className="gap-6">
              {/* Volunteer */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/volunteer"
                    className={
                      pathname === "/volunteer"
                        ? "text-green-700 font-medium"
                        : " hover:text-green-700 hover:scale-105 font-medium transition-colors"
                    }
                  >
                    Volunteer
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Rewards */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/rewards"
                    className={
                      pathname === "/rewards"
                        ? "text-green-700 font-medium"
                        : " hover:text-green-700 hover:scale-105 font-medium transition-colors"
                    }
                  >
                    Rewards
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Profile */}
              <NavigationMenuItem>
                <div className="flex items-center gap-0.5">
                  <Avatar>
                    <AvatarImage />
                    <AvatarFallback className="bg-blue-200">
                      {getInitials(session?.user?.name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/profile"
                      className={
                        pathname === "/profile"
                          ? "text-green-700 font-medium"
                          : " hover:text-green-700 hover:scale-105 font-medium transition-colors"
                      }
                    >
                      {session?.user?.name || "Profile"}
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Buttons */}
          <div className="flex gap-3">
            {/*<Button
              variant="outline"
              className="px-6 py-2.5 border-2 border-red-300 text-red-700 font-semibold hover:border-red-700 hover:scale-105 hover: cursor-pointer"
            >
              Sign Out
            </Button>*/}
            <LogOut
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-6 h-6 text-red-700 hover:text-red-900 hover:cursor-pointer transition-colors"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SignedInNavbar;
