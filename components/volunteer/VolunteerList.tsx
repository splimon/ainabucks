import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ChevronRight, ImageIcon } from "lucide-react";

// Define the structure of a volunteer event
interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  ainaBucks: number;
  hours: number;
  photo: string;
}

// Props that the VolunteerList component accepts
interface VolunteerListProps {
  events: Event[]; // Array of volunteer events to display
}

const VolunteerList = ({ events }: VolunteerListProps) => {
  /**
   * Formats a date string into MM/DD/YYYY format
   * @param dateString - ISO date string (e.g., "2024-07-15")
   * @returns Formatted date string (e.g., "07/15/2024")
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Map through each event and render a card */}
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  {/* Event title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {event.title}
                  </h3>

                  {/* Date and Location info */}
                  <div className="space-y-2 mb-6">
                    {/* Date row with calendar icon */}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <span className="text-base">
                        {formatDate(event.date)} at {event.time}
                      </span>
                    </div>

                    {/* Location row with map pin icon */}
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span className="text-base">{event.location}</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Event Image */}
                <div className="w-64 h-44 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                  {/* Conditional rendering: Show image if URL exists, otherwise show placeholder icon */}
                  {event.photo ? (
                    <img
                      src={event.photo}
                      alt={event.title}
                      className="w-full h-full object-cover" // object-cover maintains aspect ratio
                    />
                  ) : (
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Card Footer Section */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                {/* Left side: ʻĀina Bucks and Hours */}
                <div className="flex items-center gap-4">
                  {/* ʻĀina Bucks amount */}
                  <span className="text-xl font-bold text-orange-600">
                    +{event.ainaBucks} Bucks
                  </span>

                  {/* Event duration (hours) */}
                  <span className="text-base text-gray-600">
                    {event.hours} hrs
                  </span>
                </div>

                {/* Right side: More Information button */}
                <Button className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2">
                  Learn More
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 
        No Results Message
        - Only displays when filteredEvents array is empty (length === 0)
        - Centered text with padding
      */}
      {events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">
            No volunteer opportunities found matching your search.
          </p>
        </div>
      )}
    </div>
  );
};

export default VolunteerList;
