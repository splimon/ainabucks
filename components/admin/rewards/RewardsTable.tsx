/**
 * components/admin/rewards/RewardsTable.tsx
 * Component for displaying and managing rewards in the admin panel
 */

"use client";

import React, { useState } from "react";
import { Reward } from "@/database/schema";
import { Button } from "@/components/ui/button";
import { deleteReward, updateReward } from "@/lib/admin/actions/rewards";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RewardsTableProps {
  rewards: Reward[];
}

export const RewardsTable = ({ rewards }: RewardsTableProps) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Handle delete reward (soft delete - archives it)
  const handleDelete = async (rewardId: string, rewardName: string) => {
    if (
      !confirm(
        `Are you sure you want to archive "${rewardName}"? This action can be undone by changing its status.`,
      )
    ) {
      return;
    }

    setDeletingId(rewardId);

    try {
      const result = await deleteReward(rewardId);

      if (result.success) {
        toast.success("Reward archived successfully");
        router.refresh(); // Refresh the page to show updated data
      } else {
        toast.error(result.error || "Failed to archive reward");
      }
    } catch (error) {
      console.error("Error archiving reward:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  // Handle toggle active/inactive status
  const handleToggleStatus = async (reward: Reward) => {
    const newStatus = reward.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setTogglingId(reward.id);

    try {
      const result = await updateReward({
        id: reward.id,
        status: newStatus,
      });

      if (result.success) {
        toast.success(
          `Reward ${newStatus === "ACTIVE" ? "activated" : "deactivated"}`,
        );
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update reward status");
      }
    } catch (error) {
      console.error("Error updating reward status:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setTogglingId(null);
    }
  };

  // Handle edit - navigate to edit page
  const handleEdit = (rewardId: string) => {
    router.push(`/admin/rewards/${rewardId}/edit`);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "ACTIVE":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "INACTIVE":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "ARCHIVED":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reward
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inventory
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {rewards.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No rewards found. Create your first reward to get started!
                </td>
              </tr>
            ) : (
              rewards.map((reward) => (
                <tr key={reward.id} className="hover:bg-gray-50">
                  {/* Image */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {reward.imageUrl ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <img
                          src={reward.imageUrl}
                          alt={reward.name}
                          className="object-cover w-16 h-16 rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </td>

                  {/* Reward Name & Description */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {reward.name}
                    </div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {reward.description}
                    </div>
                  </td>

                  {/* Cost */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      {reward.ainaBucksCost} ʻĀB
                    </div>
                  </td>

                  {/* Inventory */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {reward.quantityAvailable === -1 ? (
                        <span className="text-blue-600 font-medium">
                          Unlimited
                        </span>
                      ) : (
                        <>
                          <span
                            className={
                              reward.quantityAvailable -
                                reward.quantityRedeemed <=
                              0
                                ? "text-red-600 font-semibold"
                                : ""
                            }
                          >
                            {reward.quantityAvailable - reward.quantityRedeemed}
                          </span>{" "}
                          / {reward.quantityAvailable}
                        </>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {reward.quantityRedeemed} redeemed
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(reward.status)}>
                      {reward.status}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(reward.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {/* Toggle Active/Inactive */}
                      {reward.status !== "ARCHIVED" && (
                        <Button
                          onClick={() => handleToggleStatus(reward)}
                          disabled={togglingId === reward.id}
                          variant="outline"
                          size="sm"
                        >
                          {togglingId === reward.id
                            ? "..."
                            : reward.status === "ACTIVE"
                              ? "Deactivate"
                              : "Activate"}
                        </Button>
                      )}

                      {/* Edit Button */}
                      <Button
                        onClick={() => handleEdit(reward.id)}
                        variant="outline"
                        size="sm"
                      >
                        Edit
                      </Button>

                      {/* Delete/Archive Button */}
                      {reward.status !== "ARCHIVED" && (
                        <Button
                          onClick={() => handleDelete(reward.id, reward.name)}
                          disabled={deletingId === reward.id}
                          variant="destructive"
                          size="sm"
                        >
                          {deletingId === reward.id ? "..." : "Archive"}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
