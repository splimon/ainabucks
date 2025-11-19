// components/volunteer/VolunteerPageClient.tsx
"use client";

import { useState } from "react";
import SearchBar from "@/components/volunteer/SearchBar";
import VolunteerList from "@/components/volunteer/VolunteerList";
import type { Event } from "@/database/schema";

interface VolunteerPageClientProps {
  initialEvents: Event[];
}

export default function VolunteerPageClient({ 
  initialEvents 
}: VolunteerPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get unique categories
  const categories = ["all", ...new Set(initialEvents.map(e => e.category))];

  // Filter events
  const filteredEvents = initialEvents.filter((event) => {
    const matchesSearch = searchQuery === "" || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
      event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-green-700 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category === "all" ? "All Events" : category}
            </button>
          ))}
        </div>
      </div>

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSortClick={() => {}}
      />

      <VolunteerList events={filteredEvents} />
    </>
  );
}