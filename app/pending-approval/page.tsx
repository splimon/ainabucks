/**
 * app/pending-approval/page.tsx
 * Page shown to users whose accounts are pending admin approval
 */

import React from "react";
import { auth, signOut } from "@/app/(root)/auth";
import { redirect } from "next/navigation";

const PendingApprovalPage = async () => {
  const session = await auth();

  // If user is not logged in, redirect to sign in
  if (!session) {
    redirect("/sign-in");
  }

  // If user is approved, redirect to home
  if (session.user.status === "APPROVED") {
    redirect("/");
  }

  // If user is rejected, show rejection message
  if (session.user.status === "REJECTED") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Account Request Denied
            </h2>
            <p className="text-gray-600">
              Unfortunately, your account creation request has been denied by an
              administrator. If you believe this is an error, please contact
              support.
            </p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/sign-in" });
            }}
          >
            <button
              type="submit"
              className="w-full rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
            >
              Return to Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // User is pending approval
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <svg
              className="h-8 w-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Account Pending Approval
          </h2>
          <p className="mb-4 text-gray-600">
            Thank you for creating your ʻĀina Bucks account,{" "}
            <span className="font-semibold">{session.user.name}</span>!
          </p>
          <p className="text-gray-600">
            Your account is currently pending approval from an administrator. We
            will notify you via email once your account has been reviewed and
            approved.
          </p>
        </div>
        <div className="rounded-md bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            <strong>What&apos;s next?</strong> Once approved, you&apos;ll be
            able to browse volunteer opportunities, earn ʻĀina Bucks, and redeem
            rewards!
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/sign-in" });
          }}
        >
          <button
            type="submit"
            className="w-full rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
