/**
 * app/admin/rewards/[id]/edit/page.tsx
 * Page for editing an existing reward
 */

import React from "react";
import { getRewardById } from "@/lib/admin/actions/rewards";
import { EditRewardForm } from "@/components/admin/rewards/EditRewardForm";
import { notFound } from "next/navigation";
import { Reward } from "@/database/schema";

interface EditRewardPageProps {
  params: {
    id: string;
  };
}

const EditRewardPage = async ({ params }: EditRewardPageProps) => {
  // Fetch the reward data
  const result = await getRewardById(params.id);

  // Handle error or not found case
  if (!result.success || !result.data) {
    notFound();
  }

  const reward = result.data as Reward;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Reward</h1>
        <p className="text-gray-600 mt-1">Update reward details and settings</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <EditRewardForm reward={reward} />
      </div>
    </div>
  );
};

export default EditRewardPage;
