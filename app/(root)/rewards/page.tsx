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
    <div className="background-gradient min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold leading-tight mb-3">
            Rewards Store
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-4">
            Redeem your ʻĀina Bucks for awesome rewards!
          </p>

          {/* User Balance Card */}
          <div className="bg-linear-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-sm font-medium opacity-90">
                  Your Available Balance
                </h2>
                <p className="text-4xl font-bold mt-1">
                  {userData?.currentAinaBucks || 0} ʻĀB
                </p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-sm opacity-90">Total Earned</p>
                  <p className="text-xl font-semibold">
                    {userData?.totalAinaBucksEarned || 0} ʻĀB
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Total Redeemed</p>
                  <p className="text-xl font-semibold">
                    {userData?.totalAinaBucksRedeemed || 0} ʻĀB
                  </p>
                </div>
              </div>
            </div>
          </div>
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
