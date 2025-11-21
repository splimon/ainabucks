/**
 * components/rewards/RewardCard.tsx
 * Component for displaying a single reward card
 */

"use client";

import React, { useState } from "react";
import { Reward } from "@/database/schema";
import { Button } from "@/components/ui/button";
import { redeemReward } from "@/lib/actions/rewards";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RewardCardProps {
  reward: Reward;
  userBalance: number;
}

export const RewardCard = ({ reward, userBalance }: RewardCardProps) => {
  const router = useRouter();
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Calculate available inventory
  const availableQuantity =
    reward.quantityAvailable === -1
      ? "Unlimited"
      : reward.quantityAvailable - reward.quantityRedeemed;

  // Check if user can afford the reward
  const canAfford = userBalance >= reward.ainaBucksCost;

  // Check if reward is in stock
  const isInStock =
    reward.quantityAvailable === -1 ||
    reward.quantityAvailable - reward.quantityRedeemed > 0;

  // Handle redeem action
  const handleRedeem = async () => {
    // Confirm redemption
    if (
      !confirm(
        `Redeem "${reward.name}" for ${reward.ainaBucksCost} ʻĀina Bucks?`,
      )
    ) {
      return;
    }

    setIsRedeeming(true);

    try {
      const result = await redeemReward({
        rewardId: reward.id,
        quantity: 1,
      });

      if (result.success) {
        toast.success("Reward redeemed successfully! 🎉");
        router.refresh(); // Refresh the page to update balance and inventory
      } else {
        toast.error(result.error || "Failed to redeem reward");
      }
    } catch (error) {
      console.error("Error redeeming reward:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-1">
      {/* Reward Image */}
      <div className="relative w-full h-56 bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden">
        {reward.imageUrl ? (
          <img
            src={reward.imageUrl}
            alt={reward.name}
            className="object-cover w-full h-56 group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-300 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
            <span className="text-gray-400 text-sm font-medium">
              No image available
            </span>
          </div>
        )}

        {/* Stock badge */}
        {!isInStock && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
            Out of Stock
          </div>
        )}

        {/* Low stock badge */}
        {isInStock &&
          typeof availableQuantity === "number" &&
          availableQuantity <= 5 && (
            <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
              Only {availableQuantity} left!
            </div>
          )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Reward Details */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-green-600 transition-colors">
          {reward.name}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-10">
          {reward.description}
        </p>

        {/* Cost and Inventory Section */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {reward.ainaBucksCost}
            </span>
            <span className="text-sm text-gray-500 font-medium">ʻĀB</span>
          </div>

          <div className="text-right">
            {typeof availableQuantity === "number" ? (
              <div>
                <span
                  className={`text-sm font-semibold ${
                    availableQuantity <= 5 ? "text-orange-600" : "text-gray-600"
                  }`}
                >
                  {availableQuantity} left
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-semibold text-blue-600">
                  {availableQuantity}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Redeem Button */}
        <Button
          onClick={handleRedeem}
          disabled={isRedeeming || !canAfford || !isInStock}
          className={`w-full h-11 font-semibold text-base transition-all duration-200 ${
            !canAfford || !isInStock
              ? "bg-gray-100 text-gray-500 border-2 border-gray-200 hover:bg-gray-100 cursor-not-allowed"
              : "bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg"
          }`}
        >
          {isRedeeming ? (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Redeeming...</span>
            </div>
          ) : !isInStock ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
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
              Out of Stock
            </span>
          ) : !canAfford ? (
            <span className="text-sm">
              Need {reward.ainaBucksCost - userBalance} more ʻĀB
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Redeem Now
            </span>
          )}
        </Button>

        {/* User balance message */}
        {!canAfford && isInStock && (
          <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800 text-center font-medium">
              Your balance: {userBalance} ʻĀina Bucks
            </p>
          </div>
        )}

        {/* Success message for affordable items */}
        {canAfford && isInStock && (
          <p className="text-xs text-green-600 mt-3 text-center font-medium">
            ✓ You can redeem this reward!
          </p>
        )}
      </div>
    </div>
  );
};
