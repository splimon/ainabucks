/**
 * app/admin/rewards/page.tsx
 * Admin page for managing rewards
 */

import React from "react";
import { getAllRewardsAdmin } from "@/lib/admin/actions/rewards";
import { RewardsTable } from "@/components/admin/rewards/RewardsTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Reward } from "@/database/schema";
import { Plus } from "lucide-react";

const RewardsPage = async () => {
  // Fetch all rewards from the database
  const result = await getAllRewardsAdmin();

  // Handle error case
  if (!result.success) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error Loading Rewards</h2>
          <p className="text-red-600">{result.error}</p>
        </div>
      </div>
    );
  }

  const rewards = (result.data as Reward[]) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rewards</h1>
          <p className="text-gray-600 mt-1">
            Manage rewards that users can redeem with ʻĀina Bucks
          </p>
        </div>
        <Link href="/admin/rewards/new">
          <Button size="lg">
             <Plus className="w-5 h-5" />
            Create Reward
            </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Rewards</div>
          <div className="text-2xl font-bold text-gray-900">
            {rewards.length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Active Rewards</div>
          <div className="text-2xl font-bold text-green-600">
            {rewards.filter((r) => r.status === "ACTIVE").length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Redeemed</div>
          <div className="text-2xl font-bold text-blue-600">
            {rewards.reduce((sum, r) => sum + r.quantityRedeemed, 0)}
          </div>
        </div>
      </div>

      {/* Rewards Table */}
      <RewardsTable rewards={rewards} />
    </div>
  );
};

export default RewardsPage;

// Metadata for the page (for SEO and browser tabs)
export const metadata = {
  title: "Rewards | ʻĀina Bucks Admin",
  description: "Manage all rewards",
};
