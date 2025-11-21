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
import Image from "next/image";

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Reward Image */}
      <div className="relative w-full h-48 bg-gray-200">
        {reward.imageUrl ? (
          <img
            src={reward.imageUrl}
            alt={reward.name}
            className="object-cover w-full h-48"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}

        {/* Stock badge */}
        {!isInStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Out of Stock
          </div>
        )}
      </div>

      {/* Reward Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {reward.name}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {reward.description}
        </p>

        {/* Cost and Inventory */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-600">
              {reward.ainaBucksCost}
            </span>
            <span className="text-sm text-gray-500">ʻĀina Bucks</span>
          </div>

          <div className="text-sm text-gray-500">
            {typeof availableQuantity === "number" ? (
              <span
                className={
                  availableQuantity <= 5 ? "text-orange-600 font-semibold" : ""
                }
              >
                {availableQuantity} left
              </span>
            ) : (
              <span className="text-blue-600 font-semibold">
                {availableQuantity}
              </span>
            )}
          </div>
        </div>

        {/* Redeem Button */}
        <Button
          onClick={handleRedeem}
          disabled={isRedeeming || !canAfford || !isInStock}
          className="w-full"
          variant={!canAfford || !isInStock ? "outline" : "default"}
        >
          {isRedeeming
            ? "Redeeming..."
            : !isInStock
              ? "Out of Stock"
              : !canAfford
                ? `Need ${reward.ainaBucksCost - userBalance} more ʻĀB`
                : "Redeem"}
        </Button>

        {/* User balance message */}
        {!canAfford && isInStock && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Your balance: {userBalance} ʻĀina Bucks
          </p>
        )}
      </div>
    </div>
  );
};
