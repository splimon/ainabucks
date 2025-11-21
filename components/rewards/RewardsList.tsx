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
      <div className="text-center py-16">
        <div className="bg-white rounded-2xl shadow-lg p-12 mx-auto border border-gray-100">
          {/* Gift Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-gray-100 to-gray-200 rounded-full mb-6">
            <svg
              className="w-10 h-10 text-gray-400"
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
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No Rewards Available Yet
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            We&apos;re working on adding exciting rewards for you to redeem with
            your ʻĀina Bucks. Check back soon!
          </p>

          {/* Decorative element */}
          <div className="flex justify-center gap-2 text-gray-300">
            <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-100"></div>
            <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {activeRewards.map((reward) => (
        <RewardCard key={reward.id} reward={reward} userBalance={userBalance} />
      ))}
    </div>
  );
};
