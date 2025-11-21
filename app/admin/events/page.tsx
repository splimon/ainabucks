/**
 * app/admin/events/page.tsx
 * Admin page that displays all events in a table format
 */

import { db } from "@/database/drizzle";
import { eventsTable, eventRegistrationsTable } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import EventsTable from "@/components/admin/events/EventsTable";
import type { EventWithRegistrations } from "@/database/schema";

// Revalidate every 10 seconds - good balance between performance and freshness
export const revalidate = 10;

export default async function AdminEventsPage() {
  // Fetch all events
  const allEvents = await db
    .select()
    .from(eventsTable)
    .orderBy(desc(eventsTable.createdAt));

  // Fetch all REGISTERED registrations
  const allRegistrations = await db
    .select()
    .from(eventRegistrationsTable)
    .where(eq(eventRegistrationsTable.status, "REGISTERED"));

  // Count registrations per event
  const registrationCounts = allRegistrations.reduce(
    (acc, reg) => {
      acc[reg.eventId] = (acc[reg.eventId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Combine events with their registration counts
  const transformedEvents: EventWithRegistrations[] = allEvents.map(
    (event) => ({
      ...event,
      whatToBring: event.whatToBring || [],
      requirements: event.requirements || [],
      volunteersRegistered: registrationCounts[event.id] || 0,
    }),
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Events</h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage all volunteer events here
          </p>
        </div>

        {/* Create button */}
        <Link href="/admin/events/new">
          <Button size="lg">
            <Plus className="w-5 h-5" />
            Create New Event
          </Button>
        </Link>
      </div>

      {/* Events Table */}
      <EventsTable events={transformedEvents} />
    </div>
  );
}

// Metadata for the page (for SEO and browser tabs)
export const metadata = {
  title: "Events | ʻĀina Bucks Admin",
  description: "Manage all volunteer events",
};
