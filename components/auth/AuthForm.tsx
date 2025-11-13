/*
 *   components/auth/AuthForm.tsx
 *   This component is a generic authentication form that can handle both sign-in and sign-up.
 *   It uses Zod for schema validation and React Hook Form for form state management.
 *   To implement the form, provide the appropriate schema, default values, and submission handler via props.
 *   Referenced: https://ui.shadcn.com/docs/components/form
 */

"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { ZodType } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FIELD_NAMES, FIELD_PLACEHOLDERS, FIELD_TYPES } from "@/constants";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const router = useRouter();
  const isSignIn = type === "SIGN_IN";

  const form: UseFormReturn<T> = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);
    if (result.success) {
      toast.success(
        isSignIn
          ? "You have successfully signed in."
          : "You have successfully signed up.",
      );
      router.push("/");
    } else {
      toast.error(result.error ?? "An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {isSignIn
            ? "Welcome Back to ʻĀina Bucks!"
            : "Create Your ʻĀina Bucks Account"}
        </h1>
        <p className="text-gray-600 text-md mb-3">
          {isSignIn
            ? "Volunteer. Earn. Redeem."
            : "Join our community of volunteers making a difference"}
        </p>
      </div>

      {/* Tab Toggle */}
      <div className="auth-tabs">
        <Link
          href="/sign-in"
          className={`auth-tab ${isSignIn ? "auth-tab-active" : ""}`}
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className={`auth-tab ${!isSignIn ? "auth-tab-active" : ""}`}
        >
          Sign Up
        </Link>
      </div>

      {/* Form Section */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 w-full"
        >
          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field }) => (
                <FormItem>
                  {/* Form Label (e.g. Name, Email, Password) */}
                  <FormLabel className="capitalize">
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    {/* Input Fields */}
                    <Input
                      required
                      type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                      placeholder={
                        FIELD_PLACEHOLDERS[
                          field.name as keyof typeof FIELD_PLACEHOLDERS
                        ]
                      }
                      className="auth-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white py-6 mt-5 text-lg font-semibold rounded-xl"
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </Form>

      {/* Footer Link */}
      <p className="text-center text-gray-600 mt-4 mb-4">
        {isSignIn ? "Don't have an account? " : "Already have an account? "}

        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="text-gray-900 font-semibold hover:text-green-700"
        >
          {isSignIn ? "Sign Up" : "Sign In"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
