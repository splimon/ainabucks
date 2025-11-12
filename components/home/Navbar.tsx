"use client";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sprout } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  const handleSignInClick = () => {
    router.push("/sign-in");
  };

  const handleSignUpClick = () => {
    router.push("/sign-up");
  };

  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center cursor-pointer">
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
          </Link>
          <Link
            className="text-2xl font-bold text-green-800 hover:text-green-900 transition-colors"
            href="/"
          >
            ʻĀina Bucks
          </Link>
        </div>

        {/* Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList className="gap-6">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/volunteer"
                  className={
                    pathname === "/volunteer"
                      ? "text-green-700 bg-green-100 font-medium"
                      : "text-gray-700 hover:text-green-700 hover:scale-105 font-medium transition-colors"
                  }
                >
                  Volunteer
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/rewards"
                  className={
                    pathname === "/rewards"
                      ? "text-green-700 bg-green-100 font-medium"
                      : "text-gray-700 hover:text-green-700 hover:scale-105 font-medium transition-colors"
                  }
                >
                  Rewards
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSignInClick}
            variant="outline"
            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold hover:border-green-700 hover:text-green-700 hover:scale-105 hover:cursor-pointer"
          >
            Sign In
          </Button>
          <Button
            onClick={handleSignUpClick}
            className="px-6 py-2.5 bg-green-700 text-white font-semibold hover:bg-green-800 hover:scale-105 hover:cursor-pointer"
          >
            Join Now
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
