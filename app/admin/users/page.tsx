/**
 * app/admin/users/page.tsx
 * Admin page that displays all users in a table format
 */

import React from "react";
import { getAllUsers } from "@/lib/admin/actions/users";
import UsersTable from "@/components/admin/users/UsersTable";

const UsersPage = async () => {
  // Fetch all users from the database
  const result = await getAllUsers();

  if (!result.success || !result.data) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error loading users</p>
          <p className="text-sm">{result.error || "Please try again later."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">
          Monitor and manage all registered users in the system
        </p>
      </div>

      {/* Users Table */}
      <UsersTable users={result.data} />
    </div>
  );
};

export default UsersPage;

// Metadata for the page (for SEO and browser tabs)
export const metadata = {
  title: "Users | ʻĀina Bucks Admin",
  description: "Manage all registered users",
};
