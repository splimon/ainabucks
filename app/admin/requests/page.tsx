/**
 * app/admin/requests/page.tsx
 * Admin page to view and manage pending account registration requests
 */

import React from "react";
import RequestsTable from "@/components/admin/requests/RequestsTable";
import { getPendingUsers } from "@/lib/admin/actions/users";

const RequestsPage = async () => {
  const result = await getPendingUsers();

  if (!result.success || !result.data) {
    return (
      <div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          Error loading pending requests. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Account Registration Requests
          </h1>
          <p className="text-gray-600 mt-1">
            Review and manage pending user account requests
          </p>
        </div>
        <div className="rounded-lg bg-blue-100 px-4 py-2">
          <span className="text-2xl font-bold text-blue-700">
            {result.data.length}
          </span>
          <span className="ml-2 text-sm text-blue-700">
            Pending {result.data.length === 1 ? "Request" : "Requests"}
          </span>
        </div>
      </div>

      {/* Requests Table */}
      <RequestsTable pendingUsers={result.data} />
    </div>
  );
};

export default RequestsPage;

// Metadata for the page (for SEO and browser tabs)
export const metadata = {
  title: "Requests | ʻĀina Bucks Admin",
  description: "Manage all pending account registration requests",
};
