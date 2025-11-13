/*
* app/(root)/volunteer/page.tsx
* Volunteer page component that displays volunteer opportunities.
*/

"use client";

import SearchBar from "@/components/volunteer/SearchBar";
import VolunteerList from "@/components/volunteer/VolunteerList";
import { sampleEvents } from "@/constants";
import React from "react";

const Volunteer = () => {
  return (
    <div className="min-h-[calc(100vh-73px)] bg-linear-to-b from-green-50 to-green-100 py-6">
      <div className="mb-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold leading-tight py-3">
          Volunteer Opportunities
        </h1>
        <p className="text-sm text-gray-600 max-w-4xl leading-relaxed">
          Browse through upcoming volunteer opportunities. Attend these
          volunteer events to earn ʻĀina Bucks.
        </p>
      </div>

      <SearchBar
        searchQuery={""}
        onSearchChange={function (value: string): void {
          throw new Error("Function not implemented.");
        }}
        onSortClick={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
      <VolunteerList title="Volunteer Opportunities" events={sampleEvents} />
    </div>
  );
};

export default Volunteer;
