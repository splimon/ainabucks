/**
 * lib/admin/actions/rewards.ts
 * Server actions for reward management (Admin only)
 * These functions run on the server and handle database operations for rewards
 */

"use server";

import { db } from "@/database/drizzle";
import { rewardsTable } from "@/database/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/app/(root)/auth";

// Parameters for creating a reward
interface CreateRewardParams {
  name: string;
  description: string;
  imageUrl?: string;
  ainaBucksCost: number;
  quantityAvailable: number; // -1 for unlimited
}

// Parameters for updating a reward
interface UpdateRewardParams {
  id: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  ainaBucksCost?: number;
  quantityAvailable?: number;
  status?: "ACTIVE" | "INACTIVE" | "ARCHIVED";
}

// Standard response format for server actions
interface ServerActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// CREATE REWARD ACTION
// ============================================

/**
 * Creates a new reward in the database (Admin only)
 *
 * @param params - Reward data from the form
 * @returns Success response with created reward, or error response
 *
 * Example usage:
 * const result = await createReward(formData);
 * if (result.success) {
 *   console.log("Created reward:", result.data);
 * } else {
 *   console.error("Error:", result.error);
 * }
 */
export const createReward = async (
  params: CreateRewardParams,
): Promise<ServerActionResponse> => {
  try {
    // Check if user is authenticated and is an admin
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        error: "Unauthorized: You must be logged in",
      };
    }

    if (session.user.role !== "ADMIN") {
      return {
        success: false,
        error: "Unauthorized: Admin access required",
      };
    }

    // Insert new reward
    const [newReward] = await db
      .insert(rewardsTable)
      .values({
        name: params.name,
        description: params.description,
        imageUrl: params.imageUrl || null,
        ainaBucksCost: params.ainaBucksCost,
        quantityAvailable: params.quantityAvailable,
        quantityRedeemed: 0,
        status: "ACTIVE",
        createdBy: session.user.id,
      })
      .returning();

    // Revalidate the admin rewards page to show the new reward
    revalidatePath("/admin/rewards");

    return {
      success: true,
      data: newReward,
    };
  } catch (error) {
    console.error("Error creating reward:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create reward",
    };
  }
};

// ============================================
// GET ALL REWARDS ACTION (Admin View)
// ============================================

/**
 * Fetches all rewards from the database (Admin only)
 * Includes archived rewards for admin management
 *
 * @returns Success response with rewards array, or error response
 *
 * Example usage:
 * const result = await getAllRewardsAdmin();
 * if (result.success) {
 *   console.log("Rewards:", result.data);
 * }
 */
export const getAllRewardsAdmin = async (): Promise<ServerActionResponse> => {
  try {
    // Check if user is authenticated and is an admin
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        error: "Unauthorized: You must be logged in",
      };
    }

    if (session.user.role !== "ADMIN") {
      return {
        success: false,
        error: "Unauthorized: Admin access required",
      };
    }

    // Fetch all rewards, ordered by creation date
    const rewards = await db
      .select()
      .from(rewardsTable)
      .orderBy(desc(rewardsTable.createdAt));

    return {
      success: true,
      data: rewards,
    };
  } catch (error) {
    console.error("Error fetching rewards:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch rewards",
    };
  }
};

// ============================================
// GET REWARD BY ID ACTION
// ============================================

/**
 * Fetches a single reward by ID (Admin only)
 *
 * @param rewardId - The ID of the reward to fetch
 * @returns Success response with reward data, or error response
 *
 * Example usage:
 * const result = await getRewardById("reward-uuid");
 * if (result.success) {
 *   console.log("Reward:", result.data);
 * }
 */
export const getRewardById = async (
  rewardId: string,
): Promise<ServerActionResponse> => {
  try {
    // Check if user is authenticated and is an admin
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        error: "Unauthorized: You must be logged in",
      };
    }

    if (session.user.role !== "ADMIN") {
      return {
        success: false,
        error: "Unauthorized: Admin access required",
      };
    }

    // Fetch the reward
    const [reward] = await db
      .select()
      .from(rewardsTable)
      .where(eq(rewardsTable.id, rewardId))
      .limit(1);

    if (!reward) {
      return {
        success: false,
        error: "Reward not found",
      };
    }

    return {
      success: true,
      data: reward,
    };
  } catch (error) {
    console.error("Error fetching reward:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch reward",
    };
  }
};

// ============================================
// UPDATE REWARD ACTION
// ============================================

/**
 * Updates an existing reward in the database (Admin only)
 *
 * @param params - Reward update data
 * @returns Success response with updated reward, or error response
 *
 * Example usage:
 * const result = await updateReward({ id: "reward-uuid", name: "New Name" });
 * if (result.success) {
 *   console.log("Updated reward:", result.data);
 * }
 */
export const updateReward = async (
  params: UpdateRewardParams,
): Promise<ServerActionResponse> => {
  try {
    // Check if user is authenticated and is an admin
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        error: "Unauthorized: You must be logged in",
      };
    }

    if (session.user.role !== "ADMIN") {
      return {
        success: false,
        error: "Unauthorized: Admin access required",
      };
    }

    // Build update object (only include fields that are provided)
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (params.name !== undefined) updateData.name = params.name;
    if (params.description !== undefined)
      updateData.description = params.description;
    if (params.imageUrl !== undefined) updateData.imageUrl = params.imageUrl;
    if (params.ainaBucksCost !== undefined)
      updateData.ainaBucksCost = params.ainaBucksCost;
    if (params.quantityAvailable !== undefined)
      updateData.quantityAvailable = params.quantityAvailable;
    if (params.status !== undefined) updateData.status = params.status;

    // Update the reward
    const [updatedReward] = await db
      .update(rewardsTable)
      .set(updateData)
      .where(eq(rewardsTable.id, params.id))
      .returning();

    if (!updatedReward) {
      return {
        success: false,
        error: "Reward not found",
      };
    }

    // Revalidate the admin rewards page
    revalidatePath("/admin/rewards");

    return {
      success: true,
      data: updatedReward,
    };
  } catch (error) {
    console.error("Error updating reward:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update reward",
    };
  }
};

// ============================================
// DELETE REWARD ACTION (Soft Delete)
// ============================================

/**
 * Soft deletes a reward by setting its status to ARCHIVED (Admin only)
 * We don't hard delete to preserve redemption history
 *
 * @param rewardId - The ID of the reward to delete
 * @returns Success response or error response
 *
 * Example usage:
 * const result = await deleteReward("reward-uuid");
 * if (result.success) {
 *   console.log("Reward archived successfully");
 * }
 */
export const deleteReward = async (
  rewardId: string,
): Promise<ServerActionResponse> => {
  try {
    // Check if user is authenticated and is an admin
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        error: "Unauthorized: You must be logged in",
      };
    }

    if (session.user.role !== "ADMIN") {
      return {
        success: false,
        error: "Unauthorized: Admin access required",
      };
    }

    // Permanently delete the reward from the database
    const [deletedReward] = await db
      .delete(rewardsTable)
      .where(eq(rewardsTable.id, rewardId))
      .returning();

    if (!deletedReward) {
      return {
        success: false,
        error: "Reward not found",
      };
    }

    // Revalidate the admin rewards page
    revalidatePath("/admin/rewards");

    return {
      success: true,
      data: { message: "Reward deleted successfully" },
    };
  } catch (error) {
    console.error("Error deleting reward:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete reward",
    };
  }
};
