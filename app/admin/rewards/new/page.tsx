/**
 * app/admin/rewards/new/page.tsx
 * Page for creating a new reward
 */

import React from "react";
import { RewardCreationForm } from "@/components/admin/rewards/RewardCreationForm";

const NewRewardPage = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Reward</h1>
        <p className="text-gray-600 mt-1">
          Add a new reward that users can redeem with their ʻĀina Bucks
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <RewardCreationForm />
      </div>
    </div>
  );
};

export default NewRewardPage;
