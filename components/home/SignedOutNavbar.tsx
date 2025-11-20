/*
 * components/home/SignedOutNavbar.tsx
 * Navbar component displayed when the user is signed out.
 * Responsive design with hamburger menu for mobile/tablet devices.
 */

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sprout, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

const SignedOutNavbar = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If sign in button is clicked, navigate to sign-in page
  const handleSignInClick = () => {
    setIsMobileMenuOpen(false);
    router.push("/sign-in");
  };

  // If sign up button is clicked, navigate to sign-up page
  const handleSignUpClick = () => {
    setIsMobileMenuOpen(false);
    router.push("/sign-up");
  };

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

        {/* Desktop Auth Buttons - Hidden on mobile */}
        <div className="hidden sm:flex gap-3">
          {/*Sign In Button */}
          <Button
            onClick={handleSignInClick}
            variant="outline"
            className="px-4 md:px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold hover:border-green-700 hover:text-green-700 hover:scale-105 hover:cursor-pointer"
          >
            Sign In
          </Button>

          {/* Join Now Button */}
          <Button
            onClick={handleSignUpClick}
            className="px-4 md:px-6 py-2.5 bg-green-700 text-white font-semibold hover:bg-green-800 hover:scale-105 hover:cursor-pointer"
          >
            Join Now
          </Button>
        </div>

        {/* Mobile Menu Button - Visible on mobile only */}
        <button
          onClick={toggleMobileMenu}
          className="sm:hidden p-2 text-gray-700 hover:text-green-700 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu - Visible on mobile when open */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            {/* Sign In Button */}
            <Button
              onClick={handleSignInClick}
              variant="outline"
              className="w-full px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold hover:border-green-700 hover:text-green-700"
            >
              Sign In
            </Button>

            {/* Join Now Button */}
            <Button
              onClick={handleSignUpClick}
              className="w-full px-6 py-2.5 bg-green-700 text-white font-semibold hover:bg-green-800"
            >
              Join Now
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default SignedOutNavbar;
