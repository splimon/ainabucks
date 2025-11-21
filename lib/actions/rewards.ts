/**
 * lib/actions/rewards.ts
 * Server actions for user reward redemptions
 * These functions run on the server and handle reward redemption logic
 */

"use server";

import { db } from "@/database/drizzle";
import {
  rewardsTable,
  usersTable,
  ainaBucksTransactionsTable,
  rewardRedemptionsTable,
} from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/app/(root)/auth";

// Parameters for redeeming a reward
interface RedeemRewardParams {
  rewardId: string;
  quantity?: number;
}

// Standard response format for server actions
interface ServerActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// GET ACTIVE REWARDS (User View)
// ============================================

/**
 * Fetches all active rewards that users can redeem
 * Only returns rewards with ACTIVE status
 *
 * @returns Success response with rewards array, or error response
 *
 * Example usage:
 * const result = await getActiveRewards();
 * if (result.success) {
 *   console.log("Available rewards:", result.data);
 * }
 */
export const getActiveRewards = async (): Promise<ServerActionResponse> => {
  try {
    // Fetch only active rewards
    const rewards = await db
      .select()
      .from(rewardsTable)
      .where(eq(rewardsTable.status, "ACTIVE"))
      .orderBy(rewardsTable.ainaBucksCost);

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
// REDEEM REWARD ACTION
// ============================================

/**
 * Redeems a reward for a user
 * Validates:
 * - User is authenticated
 * - Reward exists and is active
 * - User has enough ʻĀina Bucks
 * - Reward has available inventory
 *
 * Creates:
 * - Transaction record (REDEEMED type)
 * - Redemption record
 * Updates:
 * - User's ʻĀina Bucks balances
 * - Reward's quantity redeemed
 *
 * @param params - Reward redemption data
 * @returns Success response or error response
 *
 * Example usage:
 * const result = await redeemReward({ rewardId: "reward-uuid", quantity: 1 });
 * if (result.success) {
 *   console.log("Reward redeemed successfully!");
 * } else {
 *   console.error("Error:", result.error);
 * }
 */
export const redeemReward = async (
  params: RedeemRewardParams,
): Promise<ServerActionResponse> => {
  try {
    // Check if user is authenticated
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        error: "Unauthorized: You must be logged in to redeem rewards",
      };
    }

    const userId = session.user.id;
    const quantity = params.quantity || 1;

    // Fetch the reward
    const [reward] = await db
      .select()
      .from(rewardsTable)
      .where(eq(rewardsTable.id, params.rewardId))
      .limit(1);

    if (!reward) {
      return {
        success: false,
        error: "Reward not found",
      };
    }

    // Check if reward is active
    if (reward.status !== "ACTIVE") {
      return {
        success: false,
        error: "This reward is no longer available",
      };
    }

    // Check inventory (if not unlimited)
    if (reward.quantityAvailable !== -1) {
      const available = reward.quantityAvailable - reward.quantityRedeemed;
      if (available < quantity) {
        return {
          success: false,
          error: `Only ${available} item(s) available`,
        };
      }
    }

    // Calculate total cost
    const totalCost = reward.ainaBucksCost * quantity;

    // Fetch user's current balance
    const [user] = await db
      .select({
        currentAinaBucks: usersTable.currentAinaBucks,
        totalAinaBucksRedeemed: usersTable.totalAinaBucksRedeemed,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Check if user has enough ʻĀina Bucks
    if (user.currentAinaBucks < totalCost) {
      return {
        success: false,
        error: `Insufficient ʻĀina Bucks. You need ${totalCost} but have ${user.currentAinaBucks}`,
      };
    }

    // Begin transaction-like operations
    // 1. Create transaction record
    const [transaction] = await db
      .insert(ainaBucksTransactionsTable)
      .values({
        userId: userId,
        type: "REDEEMED",
        amount: -totalCost, // Negative because it's spent
        description: `Redeemed reward: ${reward.name}${quantity > 1 ? ` (x${quantity})` : ""}`,
        eventId: null,
        attendanceId: null,
        approvedBy: null,
        hoursWorked: null,
      })
      .returning();

    // 2. Create redemption record
    await db.insert(rewardRedemptionsTable).values({
      userId: userId,
      rewardId: reward.id,
      transactionId: transaction.id,
      ainaBucksSpent: totalCost,
      quantity: quantity,
      status: "PENDING",
      fulfilledBy: null,
      fulfilledAt: null,
      adminNotes: null,
    });

    // 3. Update user's balances
    await db
      .update(usersTable)
      .set({
        currentAinaBucks: user.currentAinaBucks - totalCost,
        totalAinaBucksRedeemed: user.totalAinaBucksRedeemed + totalCost,
      })
      .where(eq(usersTable.id, userId));

    // 4. Update reward's quantity redeemed
    await db
      .update(rewardsTable)
      .set({
        quantityRedeemed: reward.quantityRedeemed + quantity,
      })
      .where(eq(rewardsTable.id, reward.id));

    // Revalidate relevant pages
    revalidatePath("/rewards");
    revalidatePath("/profile");

    return {
      success: true,
      data: {
        message: "Reward redeemed successfully!",
        transactionId: transaction.id,
      },
    };
  } catch (error) {
    console.error("Error redeeming reward:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to redeem reward",
    };
  }
};

// ============================================
// GET USER REDEMPTION HISTORY
// ============================================

/**
 * Fetches a user's reward redemption history
 *
 * @param userId - The user's ID (optional, uses session if not provided)
 * @returns Success response with redemptions array, or error response
 *
 * Example usage:
 * const result = await getUserRedemptions();
 * if (result.success) {
 *   console.log("User redemptions:", result.data);
 * }
 */
export const getUserRedemptions = async (
  userId?: string,
): Promise<ServerActionResponse> => {
  try {
    // Check if user is authenticated
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        error: "Unauthorized: You must be logged in",
      };
    }

    const targetUserId = userId || session.user.id;

    // Fetch user's redemptions with reward details
    const redemptions = await db
      .select({
        id: rewardRedemptionsTable.id,
        rewardName: rewardsTable.name,
        rewardImageUrl: rewardsTable.imageUrl,
        ainaBucksSpent: rewardRedemptionsTable.ainaBucksSpent,
        quantity: rewardRedemptionsTable.quantity,
        status: rewardRedemptionsTable.status,
        createdAt: rewardRedemptionsTable.createdAt,
        fulfilledAt: rewardRedemptionsTable.fulfilledAt,
      })
      .from(rewardRedemptionsTable)
      .innerJoin(
        rewardsTable,
        eq(rewardRedemptionsTable.rewardId, rewardsTable.id),
      )
      .where(eq(rewardRedemptionsTable.userId, targetUserId))
      .orderBy(rewardRedemptionsTable.createdAt);

    return {
      success: true,
      data: redemptions,
    };
  } catch (error) {
    console.error("Error fetching user redemptions:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch redemptions",
    };
  }
};
