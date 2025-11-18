// components/volunteer/VolunteerPageClient.tsx
"use client"; // ← Makes this a Client Component

import { useState } from "react";
import SearchBar from "@/components/volunteer/SearchBar";
import VolunteerList from "@/components/volunteer/VolunteerList";
import type { Event } from "@/database/schema";

interface VolunteerPageClientProps {
  initialEvents: Event[]; // Receive events from Server Component
}

export default function VolunteerPageClient({ 
  initialEvents 
}: VolunteerPageClientProps) {
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter events based on search query
  const filteredEvents = initialEvents.filter((event) => {
    const query = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.locationName.toLowerCase().includes(query)
    );
  });

  // Handle sort (you can implement this later)
  const handleSort = () => {
    console.log("Sort clicked");
    // TODO: Implement sort functionality
    // Example: Sort by date, volunteers needed, etc.
  };

  return (
    <>
      {/* Search Bar with real handlers */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSortClick={handleSort}
      />

      {/* Event List with filtered results */}
      <VolunteerList events={filteredEvents} />
    </>
  );
}