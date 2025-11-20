/*
 * app/(root)/volunteer/page.tsx
 * Volunteer page component that displays volunteer opportunities.
 */

import React from "react";
import { db } from "@/database/drizzle";
import { eventsTable, eventRegistrationsTable } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import VolunteerPageClient from "@/components/volunteer/VolunteerPageClient";
import type { EventWithRegistrations } from "@/database/schema";

// Revalidate every 10 seconds - good balance between performance and freshness
export const revalidate = 10;

const Volunteer = async () => {
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
    <div className="background-gradient">
      {/* Header Section */}
      <div className="mb-8 max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold leading-tight mb-3 mt-3">
          Volunteer Opportunities
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          Browse through upcoming volunteer opportunities. Attend these
          volunteer events to earn ʻĀina Bucks.
        </p>
      </div>

      {/* Event List */}
      <VolunteerPageClient initialEvents={transformedEvents} />
    </div>
  );
};

export default Volunteer;
