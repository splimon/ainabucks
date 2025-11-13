/*
 * app/(auth)/sign-in/page.tsx
 * Sign-In page component that includes the sign-in form.
 */

"use client";

import React from "react";
import { Sprout } from "lucide-react";
import AuthForm from "@/components/auth/AuthForm";
import { SignInSchema } from "@/lib/validations";
import { signInWithCredentials } from "@/lib/actions/auth";

const SignIn = () => {
  return (
    <div className="auth-container">
      {/* Logo */}
      <div className="auth-logo">
        <div className="w-12 h-12 bg-green-700 rounded-xl flex items-center justify-center">
          <Sprout className="w-7 h-7" color="white" />
        </div>
        <span className="text-3xl font-bold text-green-800">ʻĀina Bucks</span>
      </div>

      {/* Auth Card */}
      <div className="auth-card">
        <AuthForm
          type="SIGN_IN"
          schema={SignInSchema}
          defaultValues={{
            email: "",
            password: "",
          }}
          onSubmit={signInWithCredentials}
        />
      </div>
    </div>
  );
};

export default SignIn;
