/**
 * components/admin/users/UsersTable.tsx
 * Table component to display and manage all users in the admin portal
 */

"use client";

import React, { useState } from "react";
import { UserData } from "@/lib/admin/actions/users";
import { updateUserRole, deleteUser } from "@/lib/admin/actions/users";
import { toast } from "sonner";
import { Trash2, ChevronDown, Check, Search, ArrowUpDown } from "lucide-react";

interface UsersTableProps {
  users: UserData[];
}

const UsersTable = ({ users }: UsersTableProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Format date to readable format
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle role change
  const handleRoleChange = async (
    userId: string,
    newRole: "USER" | "ADMIN",
  ) => {
    setIsLoading(userId);
    setOpenDropdown(null);

    try {
      const result = await updateUserRole(userId, newRole);

      if (result.success) {
        toast.success(`User role updated to ${newRole}`);
      } else {
        toast.error(result.error || "Failed to update role");
      }
    } catch (error) {
      toast.error("An error occurred while updating the role");
      console.error(error);
    } finally {
      setIsLoading(null);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: string, userName: string) => {
    // Confirm deletion
    const confirmed = window.confirm(
      `Are you sure you want to delete ${userName}? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setIsLoading(userId);

    try {
      const result = await deleteUser(userId);

      if (result.success) {
        toast.success("User deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete user");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the user");
      console.error(error);
    } finally {
      setIsLoading(null);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.fullName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  // Sort users by name
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.fullName.localeCompare(b.fullName);
    }
    return b.fullName.localeCompare(a.fullName);
  });

  // Toggle dropdown
  const toggleDropdown = (userId: string) => {
    setOpenDropdown(openDropdown === userId ? null : userId);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            A-Z
            <ArrowUpDown
              className={`w-4 h-4 transition-transform ${
                sortOrder === "desc" ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ʻĀina Bucks Earned
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Balance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hours Volunteered
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  {searchQuery
                    ? "No users found matching your search"
                    : "No users found"}
                </td>
              </tr>
            ) : (
              sortedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Name & Email */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Date Joined */}
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(user.createdAt)}
                  </td>

                  {/* Role Dropdown */}
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(user.id)}
                        disabled={isLoading === user.id}
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === "ADMIN"
                            ? "bg-green-100 text-green-700"
                            : "bg-pink-100 text-pink-700"
                        } ${
                          isLoading === user.id
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:opacity-80 cursor-pointer"
                        }`}
                      >
                        {user.role === "ADMIN" ? "Admin" : "User"}
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {openDropdown === user.id && (
                        <>
                          {/* Backdrop */}
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenDropdown(null)}
                          />

                          {/* Dropdown */}
                          <div className="absolute left-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                            <button
                              onClick={() => handleRoleChange(user.id, "USER")}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                                user.role === "USER"
                                  ? "text-pink-700"
                                  : "text-gray-700"
                              }`}
                            >
                              User
                              {user.role === "USER" && (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleRoleChange(user.id, "ADMIN")}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                                user.role === "ADMIN"
                                  ? "text-green-700"
                                  : "text-gray-700"
                              }`}
                            >
                              Admin
                              {user.role === "ADMIN" && (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>

                  {/* ʻĀina Bucks Earned */}
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.totalAinaBucksEarned}
                  </td>

                  {/* Current Balance */}
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.currentAinaBucks}
                  </td>

                  {/* Hours Volunteered */}
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {parseFloat(user.totalHoursVolunteered).toFixed(2)} hrs
                  </td>

                  {/* Delete Action */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteUser(user.id, user.fullName)}
                      disabled={isLoading === user.id}
                      className={`text-red-600 hover:text-red-800 hover:bg-red-200 transition-colors rounded p-1 ${
                        isLoading === user.id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      title="Delete user"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with total count */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600">
          {searchQuery ? (
            <>
              Showing{" "}
              <span className="font-semibold">{sortedUsers.length}</span> of{" "}
              <span className="font-semibold">{users.length}</span> users
            </>
          ) : (
            <>
              Total Users: <span className="font-semibold">{users.length}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default UsersTable;
