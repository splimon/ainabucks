/*
 * app/(root)/volunteer/page.tsx
 * Volunteer page component that displays volunteer opportunities.
 */

import React from "react";
import { auth } from "../auth";
import { db } from "@/database/drizzle";
import { eventsTable } from "@/database/schema";
import { desc } from "drizzle-orm";
import type { Event } from "@/database/schema";
import VolunteerPageClient from "@/components/volunteer/VolunteerPageClient";

const Volunteer = async () => {
  const session = await auth();

  // Fetch all events from database, ordered by newest first
  const latestEvents: Event[] = await db
    .select()
    .from(eventsTable)
    .orderBy(desc(eventsTable.createdAt));

  // Transform database results to match component expectations
  // This handles the decimal duration conversion and null handling
  const transformedEvents = latestEvents.map((event) => ({
    ...event,
    whatToBring: event.whatToBring || [], // Convert null to empty array
    requirements: event.requirements || [], // Convert null to empty array
  }));

  return (
    <div className="min-h-[calc(100vh-73px)] bg-linear-to-b from-green-50 to-green-100 py-6">
      {/* Header Section */}
      <div className="mb-8 max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold leading-tight mb-3">
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
