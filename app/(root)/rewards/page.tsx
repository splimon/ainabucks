/**
 * app/(root)/rewards/page.tsx
 * User rewards page - browse and redeem rewards with ʻĀina Bucks
 */

import React from "react";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import { getActiveRewards } from "@/lib/actions/rewards";
import { RewardsList } from "@/components/rewards/RewardsList";
import { db } from "@/database/drizzle";
import { usersTable } from "@/database/schema";
import { eq } from "drizzle-orm";
import { Reward } from "@/database/schema";

const Rewards = async () => {
  // Check if user is authenticated
  const session = await auth();

  // Redirect to home page if not authenticated
  if (!session || !session.user?.id) redirect("/");

  // Fetch user's current balance
  const [userData] = await db
    .select({
      currentAinaBucks: usersTable.currentAinaBucks,
      totalAinaBucksEarned: usersTable.totalAinaBucksEarned,
      totalAinaBucksRedeemed: usersTable.totalAinaBucksRedeemed,
    })
    .from(usersTable)
    .where(eq(usersTable.id, session.user.id))
    .limit(1);

  // Fetch active rewards
  const rewardsResult = await getActiveRewards();

  // Handle error case
  if (!rewardsResult.success) {
    return (
      <div className="background-gradient min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold">
              Error Loading Rewards
            </h2>
            <p className="text-red-600">{rewardsResult.error}</p>
          </div>
        </div>
      </div>
    );
  }

  const rewards = (rewardsResult.data as Reward[]) || [];

  return (
    <div className="background-gradient">
      <div className="mb-8 max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <h1 className="text-4xl font-bold leading-tight mb-3 mt-3">
          Rewards 🎁
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          Redeem your ʻĀina Bucks for some awesome rewards!
        </p>

        {/* User Balance Card - Enhanced Design */}
        <div className="mb-10 sm:mb-12">
          <div className="relative overflow-hidden bg-linear-to-r from-green-500 via-green-600 to-emerald-600 rounded-2xl shadow-2xl">
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
            </div>

            <div className="relative p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Main Balance */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h2 className="text-white text-sm sm:text-base font-medium uppercase tracking-wider">
                      Your Balance
                    </h2>
                  </div>
                  <p className="text-5xl sm:text-6xl font-extrabold text-white mb-1">
                    {userData?.currentAinaBucks || 0}
                  </p>
                  <p className="text-green-100 text-lg font-medium">
                    ʻĀina Bucks Available
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 lg:gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-1">
                      <svg
                        className="w-5 h-5 text-green-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                      <p className="text-green-100 text-xs sm:text-sm font-medium">
                        Total Earned
                      </p>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-white">
                      {userData?.totalAinaBucksEarned || 0}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-1">
                      <svg
                        className="w-5 h-5 text-green-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                        />
                      </svg>
                      <p className="text-green-100 text-xs sm:text-sm font-medium">
                        Redeemed
                      </p>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-white">
                      {userData?.totalAinaBucksRedeemed || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards Section Header */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Available Rewards
          </h2>
          <p className="text-gray-600 mb-6">
            {rewards.length} {rewards.length === 1 ? "reward" : "rewards"}{" "}
            available to redeem
          </p>
        </div>

        {/* Rewards Grid */}
        <RewardsList
          rewards={rewards}
          userBalance={userData?.currentAinaBucks || 0}
        />
      </div>
    </div>
  );
};

export default Rewards;
