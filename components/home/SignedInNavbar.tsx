/*
 * components/home/SignedInNavbar.tsx
 * Renders the navigation bar for signed-in users with links
 * to Volunteer, Rewards, Profile with Avatar, and a Sign Out button.
 * Responsive design with hamburger menu for mobile/tablet devices.
 */

"use client";

import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { LogOut, Sprout, Menu, X, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Session } from "next-auth";
import { getInitials } from "@/lib/utils";

const SignedInNavbar = ({ session }: { session: Session }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-700 rounded-lg flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-5 h-5 sm:w-6 sm:h-6"
              stroke="white"
              strokeWidth="2"
            >
              <Sprout color="white" />
            </svg>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-green-800 hover:text-green-900 transition-colors">
            ʻĀina Bucks
          </span>
        </div>

        {/* Desktop Navigation Menu - Hidden on mobile/tablet */}
        <div className="hidden lg:flex items-center gap-8">
          <NavigationMenu>
            <NavigationMenuList className="gap-6">
              {/* Admin Panel - Only visible to admins */}
              {session.user.role === "ADMIN" && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 text-purple-700 hover:text-purple-800 font-medium transition-colors border border-purple-200 rounded-lg hover:bg-purple-50"
                    >
                      Admin Panel
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}

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

          {/* Sign Out Button */}
          <div className="flex gap-3">
            <LogOut
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-6 h-6 text-red-700 hover:text-red-900 hover:cursor-pointer transition-colors"
            />
          </div>
        </div>

        {/* Mobile Menu Button - Visible on mobile/tablet */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 text-gray-700 hover:text-green-700 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu - Visible on mobile/tablet when open */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-4">
            {/* Profile Section */}
            <Link
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2"
            >
              <Avatar>
                <AvatarImage />
                <AvatarFallback className="bg-blue-200">
                  {getInitials(session?.user?.name || "")}
                </AvatarFallback>
              </Avatar>
              <span
                className={
                  pathname === "/profile"
                    ? "text-green-700 font-medium"
                    : "text-gray-700 hover:text-green-700 font-medium transition-colors"
                }
              >
                {session?.user?.name || "Profile"}
              </span>
            </Link>

            {/* Navigation Links */}
            <Link
              href="/volunteer"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-2 ${
                pathname === "/volunteer"
                  ? "text-green-700 font-medium"
                  : "text-gray-700 hover:text-green-700 font-medium transition-colors"
              }`}
            >
              Volunteer
            </Link>

            <Link
              href="/rewards"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-2 ${
                pathname === "/rewards"
                  ? "text-green-700 font-medium"
                  : "text-gray-700 hover:text-green-700 font-medium transition-colors"
              }`}
            >
              Rewards
            </Link>

            {/* Admin Panel - Only visible to admins */}
            {session.user.role === "ADMIN" && (
              <Link
                href="/admin/events"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-purple-700 hover:text-purple-800 font-medium transition-colors border border-purple-200 px-3 py-1.5 rounded-lg hover:bg-purple-50"
              >
                <Shield className="w-5 h-5" />
                Admin Panel
              </Link>
            )}

            {/* Sign Out */}
            <button
              className="p-2 text-gray-400 hover:text-red-800 hover:cursor-pointer transition-colors"
              aria-label="Logout"
            >
              <LogOut
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="w-5 h-5"
              />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default SignedInNavbar;
