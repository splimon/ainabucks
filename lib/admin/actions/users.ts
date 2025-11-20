/**
 * lib/admin/actions/users.ts
 * Server actions for user management in the admin portal
 */

"use server";

import { db } from "@/database/drizzle";
import { usersTable } from "@/database/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Standard response format for server actions
interface ServerActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// User data type for the table
export interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: "USER" | "ADMIN";
  status: "PENDING" | "APPROVED" | "REJECTED";
  totalAinaBucksEarned: number;
  currentAinaBucks: number;
  totalHoursVolunteered: string;
  createdAt: Date;
}

// ============================================
// GET ALL USERS ACTION
// ============================================

/**
 * Fetches all users from the database
 * Returns users sorted by creation date (newest first)
 *
 * @returns Success response with users array, or error response
 */
export const getAllUsers = async (): Promise<
  ServerActionResponse<UserData[]>
> => {
  try {
    const users = await db
      .select({
        id: usersTable.id,
        fullName: usersTable.fullName,
        email: usersTable.email,
        role: usersTable.role,
        status: usersTable.status,
        totalAinaBucksEarned: usersTable.totalAinaBucksEarned,
        currentAinaBucks: usersTable.currentAinaBucks,
        totalHoursVolunteered: usersTable.totalHoursVolunteered,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .orderBy(desc(usersTable.createdAt));

    return {
      success: true,
      data: users,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      error: "Failed to fetch users. Please try again.",
    };
  }
};

// ============================================
// UPDATE USER ROLE ACTION
// ============================================

/**
 * Updates a user's role between USER and ADMIN
 *
 * @param userId - The ID of the user to update
 * @param newRole - The new role to assign ("USER" or "ADMIN")
 * @returns Success response or error response
 */
export const updateUserRole = async (
  userId: string,
  newRole: "USER" | "ADMIN",
): Promise<ServerActionResponse> => {
  try {
    // Validate role
    if (newRole !== "USER" && newRole !== "ADMIN") {
      return {
        success: false,
        error: "Invalid role. Must be USER or ADMIN.",
      };
    }

    // Update user role
    await db
      .update(usersTable)
      .set({ role: newRole })
      .where(eq(usersTable.id, userId));

    // Revalidate the users page to show updated data
    revalidatePath("/admin/users");

    return {
      success: true,
      data: { userId, newRole },
    };
  } catch (error) {
    console.error("Error updating user role:", error);
    return {
      success: false,
      error: "Failed to update user role. Please try again.",
    };
  }
};

// ============================================
// DELETE USER ACTION
// ============================================

/**
 * Deletes a user from the database
 * Note: This is a hard delete. Consider implementing soft delete if you need to preserve data.
 *
 * @param userId - The ID of the user to delete
 * @returns Success response or error response
 */
export const deleteUser = async (
  userId: string,
): Promise<ServerActionResponse> => {
  try {
    // Check if user exists
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (existingUser.length === 0) {
      return {
        success: false,
        error: "User not found.",
      };
    }

    // Delete the user
    await db.delete(usersTable).where(eq(usersTable.id, userId));

    // Revalidate the users page to show updated data
    revalidatePath("/admin/users");

    return {
      success: true,
      data: { userId },
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: "Failed to delete user. Please try again.",
    };
  }
};

// ============================================
// UPDATE USER STATUS ACTION
// ============================================

/**
 * Updates a user's status (PENDING, APPROVED, REJECTED)
 * This can be used for user verification workflows
 *
 * @param userId - The ID of the user to update
 * @param newStatus - The new status to assign
 * @returns Success response or error response
 */
export const updateUserStatus = async (
  userId: string,
  newStatus: "PENDING" | "APPROVED" | "REJECTED",
): Promise<ServerActionResponse> => {
  try {
    // Validate status
    if (!["PENDING", "APPROVED", "REJECTED"].includes(newStatus)) {
      return {
        success: false,
        error: "Invalid status.",
      };
    }

    // Update user status
    await db
      .update(usersTable)
      .set({ status: newStatus })
      .where(eq(usersTable.id, userId));

    // Revalidate the users page to show updated data
    revalidatePath("/admin/users");

    return {
      success: true,
      data: { userId, newStatus },
    };
  } catch (error) {
    console.error("Error updating user status:", error);
    return {
      success: false,
      error: "Failed to update user status. Please try again.",
    };
  }
};
