/**
 * components/volunteer/VolunteerPageClient.tsx
 * Client-side component for the volunteer page, handling search and category filtering.
 */

"use client";

import { useState } from "react";
import SearchBar from "@/components/volunteer/SearchBar";
import VolunteerList from "@/components/volunteer/VolunteerList";
import type { EventWithRegistrations } from "@/database/schema";

interface VolunteerPageClientProps {
  initialEvents: EventWithRegistrations[];
}

export default function VolunteerPageClient({
  initialEvents,
}: VolunteerPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get unique categories
  const categories = ["all", ...new Set(initialEvents.map((e) => e.category))];

  // Filter events
  const filteredEvents = initialEvents.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSortClick={() => {}}
        />
      </div>

      {/* Category Filter - Improved Design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Filter by Category
            </h3>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-linear-to-r from-green-600 to-emerald-600 text-white shadow-md transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                }`}
              >
                {category === "all"
                  ? `All Events (${initialEvents.length})`
                  : `${category} (${initialEvents.filter((e) => e.category === category).length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredEvents.length}</span>{" "}
          {filteredEvents.length === 1 ? "event" : "events"}
          {searchQuery && (
            <span>
              {" "}
              for &quot;
              <span className="font-semibold">{searchQuery}</span>&quot;
            </span>
          )}
        </p>
      </div>

      <VolunteerList events={filteredEvents} />
    </>
  );
}
