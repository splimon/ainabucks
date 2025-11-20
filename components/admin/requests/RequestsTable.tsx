/**
 * components/admin/requests/RequestsTable.tsx
 * Table component to display and manage pending user account requests
 */

"use client";

import React, { useState } from "react";
import { UserData } from "@/lib/admin/actions/users";
import {
  approveUserAccount,
  rejectUserAccount,
} from "@/lib/admin/actions/users";
import { toast } from "sonner";
import { ArrowUpDown, Search } from "lucide-react";

interface RequestsTableProps {
  pendingUsers: UserData[];
}

const RequestsTable = ({ pendingUsers }: RequestsTableProps) => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
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

  // Handle approve account
  const handleApprove = async (userId: string, userName: string) => {
    setIsLoading(userId);

    try {
      const result = await approveUserAccount(userId);

      if (result.success) {
        toast.success(`Account approved for ${userName}`);
      } else {
        toast.error(result.error || "Failed to approve account");
      }
    } catch (error) {
      toast.error("An error occurred while approving the account");
      console.error(error);
    } finally {
      setIsLoading(null);
    }
  };

  // Handle reject account
  const handleReject = async (userId: string, userName: string) => {
    setIsLoading(userId);

    try {
      const result = await rejectUserAccount(userId);

      if (result.success) {
        toast.success(`Account rejected for ${userName}`);
      } else {
        toast.error(result.error || "Failed to reject account");
      }
    } catch (error) {
      toast.error("An error occurred while rejecting the account");
      console.error(error);
    } finally {
      setIsLoading(null);
    }
  };

  // Sort users
  const sortedUsers = [...pendingUsers].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  // Toggle sort order
  const toggleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (sortedUsers.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-500">No pending account requests</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header with sort button */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Account Registration Requests
          </h2>
          <button
            onClick={toggleSort}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <span>
              {sortOrder === "asc" ? "Oldest to Recent" : "Newest to Recent"}
            </span>
            <ArrowUpDown className="h-4 w-4" />
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
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Date Joined
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                Actions
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
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <span className="text-sm font-semibold text-blue-700">
                          {user.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </span>
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
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleApprove(user.id, user.fullName)}
                        disabled={isLoading === user.id}
                        className="rounded-md bg-green-100 text-green-700 px-4 py-2 text-sm font-medium hover:bg-green-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isLoading === user.id
                          ? "Processing..."
                          : "Approve Account"}
                      </button>
                      <button
                        onClick={() => handleReject(user.id, user.fullName)}
                        disabled={isLoading === user.id}
                        className="rounded-full p-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Deny Account"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="12" cy="12" r="10" strokeWidth="2" />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 9l-6 6M9 9l6 6"
                          />
                        </svg>
                      </button>
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

export default RequestsTable;
