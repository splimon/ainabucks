/*
 * components/home/SignedOutNavbar.tsx
 * Navbar component displayed when the user is signed out.
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Sprout } from "lucide-react";
import { useRouter } from "next/navigation";

const SignedOutNavbar = () => {
  const router = useRouter();

  // If sign in button is clicked, navigate to sign-in page
  const handleSignInClick = () => {
    router.push("/sign-in");
  };

  // If sign up button is clicked, navigate to sign-up page
  const handleSignUpClick = () => {
    router.push("/sign-up");
  };

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

        {/* Auth Buttons */}
        <div className="flex gap-3">
          {/*Sign In Button */}
          <Button
            onClick={handleSignInClick}
            variant="outline"
            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold hover:border-green-700 hover:text-green-700 hover:scale-105 hover:cursor-pointer"
          >
            Sign In
          </Button>

          {/* Join Now Button */}
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

export default SignedOutNavbar;
