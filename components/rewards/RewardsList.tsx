/**
 * components/rewards/RewardsList.tsx
 * Component for displaying a grid of reward cards
 */

"use client";

import React from "react";
import { Reward } from "@/database/schema";
import { RewardCard } from "./RewardCard";

interface RewardsListProps {
  rewards: Reward[];
  userBalance: number;
}

export const RewardsList = ({ rewards, userBalance }: RewardsListProps) => {
  // Filter out archived rewards (just in case)
  const activeRewards = rewards.filter((reward) => reward.status === "ACTIVE");

  if (activeRewards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Rewards Available
          </h3>
          <p className="text-gray-600">
            Check back later for new rewards to redeem!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {activeRewards.map((reward) => (
        <RewardCard key={reward.id} reward={reward} userBalance={userBalance} />
      ))}
    </div>
  );
};
