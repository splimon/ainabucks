// app/admin/events/page.tsx
// Admin page that displays all events in a table format

import { db } from "@/database/drizzle";
import { eventsTable } from "@/database/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpDown } from "lucide-react";
import EventsTable from "@/components/admin/events/EventsTable";

export default async function AdminEventsPage() {
  // Fetch all events from database, ordered by most recent first
  const allEvents = await db
    .select()
    .from(eventsTable)
    .orderBy(desc(eventsTable.createdAt));

  // Transform events to ensure proper data types for the table
  const transformedEvents = allEvents.map((event) => ({
    ...event,
    whatToBring: event.whatToBring || [],
    requirements: event.requirements || [],
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            {/* Left side - Title and subtitle */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Events</h1>
              <p className="text-gray-600 mt-2">
                Monitor all of your volunteer events here
              </p>
            </div>

            {/* Right side - Create button */}
            <Link href="/admin/events/new">
              <Button className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Event
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Events Table Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Events Table</h2>
            
            {/* Sort button (can be implemented later) */}
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4" />
              Sort
            </Button>
          </div>

          {/* Table Component */}
          <EventsTable events={transformedEvents} />
        </div>
      </div>
    </div>
  );
}

// Metadata for the page (for SEO and browser tabs)
export const metadata = {
  title: "All Events | ʻĀina Bucks Admin",
  description: "Manage all volunteer events",
};