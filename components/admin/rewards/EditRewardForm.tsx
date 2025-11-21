/**
 * components/admin/rewards/EditRewardForm.tsx
 * Form component for editing existing rewards (Admin only)
 */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RewardCreationSchema, RewardCreationInput } from "@/lib/validations";
import { updateReward } from "@/lib/admin/actions/rewards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Reward } from "@/database/schema";

interface EditRewardFormProps {
  reward: Reward;
}

export const EditRewardForm = ({ reward }: EditRewardFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RewardCreationInput>({
    resolver: zodResolver(RewardCreationSchema),
    defaultValues: {
      name: reward.name,
      description: reward.description,
      imageUrl: reward.imageUrl || "",
      ainaBucksCost: reward.ainaBucksCost,
      quantityAvailable: reward.quantityAvailable,
    },
  });

  // Handle form submission
  const onSubmit = async (data: RewardCreationInput) => {
    setIsSubmitting(true);

    try {
      // Call server action to update reward
      const result = await updateReward({
        id: reward.id,
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl || undefined,
        ainaBucksCost: data.ainaBucksCost,
        quantityAvailable: data.quantityAvailable,
      });

      if (result.success) {
        toast.success("Reward updated successfully!");
        router.push("/admin/rewards"); // Navigate back to rewards list
        router.refresh(); // Refresh the page data
      } else {
        toast.error(result.error || "Failed to update reward");
      }
    } catch (error) {
      console.error("Error updating reward:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Reward</h1>
        <p className="text-gray-600 mt-2">Update reward details and settings</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* REWARD INFORMATION SECTION */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Reward Information
          </h2>

          <div className="space-y-6">
            {/* Reward Name */}
            <div>
              <Label htmlFor="name" className="mb-2">
                Reward Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="e.g., Reusable Water Bottle"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe the reward..."
                rows={4}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Image URL */}
            <div>
              <Label htmlFor="imageUrl">Image URL (Optional)</Label>
              <Input
                id="imageUrl"
                {...register("imageUrl")}
                placeholder="https://example.com/image.jpg"
                className={errors.imageUrl ? "border-red-500" : ""}
              />
              {errors.imageUrl && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.imageUrl.message}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Enter a URL to an image of the reward
              </p>
            </div>

            {/* Cost in ʻĀina Bucks */}
            <div>
              <Label htmlFor="ainaBucksCost">
                Cost (ʻĀina Bucks) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ainaBucksCost"
                type="number"
                {...register("ainaBucksCost", { valueAsNumber: true })}
                placeholder="10"
                min="1"
                className={errors.ainaBucksCost ? "border-red-500" : ""}
              />
              {errors.ainaBucksCost && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.ainaBucksCost.message}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                How many ʻĀina Bucks this reward costs
              </p>
            </div>

            {/* Quantity Available */}
            <div>
              <Label htmlFor="quantityAvailable">
                Quantity Available <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantityAvailable"
                type="number"
                {...register("quantityAvailable", { valueAsNumber: true })}
                placeholder="10"
                className={errors.quantityAvailable ? "border-red-500" : ""}
              />
              {errors.quantityAvailable && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.quantityAvailable.message}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Use -1 for unlimited quantity. Current redeemed:{" "}
                {reward.quantityRedeemed}
              </p>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTONS */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/rewards")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-700 hover:bg-green-800 text-white px-8"
          >
            {isSubmitting ? "Updating..." : "Update Reward"}
          </Button>
        </div>
      </form>
    </div>
  );
};
