/*
* app/(auth)/sign-up/page.tsx
* Sign-Up page component that includes the sign-up form.
*/

"use client";

import React from "react";
import { Sprout } from "lucide-react";
import AuthForm from "@/components/auth/AuthForm";
import { SignUpSchema } from "@/lib/validations";
import Link from "next/link";
import { signUp } from "@/lib/actions/auth";

const SignUp = () => {
  return (
    <div className="auth-container">
      {/* Logo */}
      <div className="auth-logo">
        <div className="w-12 h-12 bg-green-700 rounded-xl flex items-center justify-center">
          <Sprout className="w-7 h-7" color="white" />
        </div>
        <Link className="text-3xl font-bold text-green-800" href="/">
          ʻĀina Bucks
        </Link>
      </div>

      {/* Auth Card */}
      <div className="auth-card">
        <AuthForm
          type="SIGN_UP"
          schema={SignUpSchema}
          defaultValues={{
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={signUp}
        />
      </div>
    </div>
  );
};

export default SignUp;
