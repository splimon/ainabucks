// components/volunteer/VolunteerList.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  ChevronRight,
  ImageIcon,
  Users,
  Clock,
  DollarSign,
  Tag,
} from "lucide-react";
import type { Event } from "@/database/schema";
import Link from "next/link";

interface VolunteerListProps {
  events: Event[];
}

const VolunteerList = ({ events }: VolunteerListProps) => {
  /**
   * Formats a date string into readable format
   * Example: "2025-11-18" → "Monday, November 18, 2025"
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  /**
   * Formats time from 24hr to 12hr format
   * Example: "14:30" → "2:30 PM"
   */
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  /**
   * Calculate spots remaining
   */
  const getSpotsRemaining = (event: Event) => {
    return event.volunteersNeeded - (event.volunteersRegistered || 0);
  };

  /**
   * Get status badge color based on availability
   */
  const getStatusBadge = (event: Event) => {
    const spotsRemaining = getSpotsRemaining(event);

    if (spotsRemaining === 0) {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
          Full
        </span>
      );
    } else if (spotsRemaining <= 5) {
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
          Almost Full
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
          Available
        </span>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event) => {
          const spotsRemaining = getSpotsRemaining(event);
          const duration =
            typeof event.duration === "string"
              ? parseFloat(event.duration)
              : event.duration;

          return (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              {/* Event Image Section */}
              <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-20 h-20 text-gray-400" />
                  </div>
                )}

                {/* Category Badge - Top Left */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded-full flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {event.category}
                  </span>
                </div>

                {/* Status Badge - Top Right */}
                <div className="absolute top-4 right-4">
                  {getStatusBadge(event)}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                {/* Event Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">
                  {event.title}
                </h3>

                {/* Event Details Grid */}
                <div className="space-y-3 mb-6">
                  {/* Date & Time */}
                  <div className="flex items-start gap-3 text-gray-600">
                    <Calendar className="w-5 h-5 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {formatDate(event.date)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatTime(event.startTime)} -{" "}
                        {formatTime(event.endTime)}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3 text-gray-600">
                    <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {event.locationName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {event.city}, {event.state}
                      </p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="w-5 h-5 shrink-0" />
                    <span className="text-sm">
                      {duration} {duration === 1 ? "hour" : "hours"}
                    </span>
                  </div>

                  {/* Volunteers Needed */}
                  <div className="flex items-center gap-3 text-gray-600">
                    <Users className="w-5 h-5 shrink-0" />
                    <span className="text-sm">
                      {spotsRemaining} of {event.volunteersNeeded} spots
                      available
                    </span>
                  </div>
                </div>

                {/* Description Preview */}
                <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                  {event.description}
                </p>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  {/* Rewards Info */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-orange-600" />
                      <span className="text-2xl font-bold text-orange-600">
                        {event.ainaBucks}
                      </span>
                      <span className="text-sm text-gray-600">ʻĀina Bucks</span>
                    </div>
                    <span className="text-xs text-gray-500 ml-7">
                      {event.bucksPerHour} bucks/hour
                    </span>
                  </div>

                  {/* Learn More Button */}
                  <Link href={`/volunteer/${event.id}`}>
                    <Button
                      className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                      disabled={spotsRemaining === 0}
                    >
                      {spotsRemaining === 0 ? "Full" : "Learn More"}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results Message */}
      {events.length === 0 && (
        <div className="text-center py-16">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-500 mb-2">
            No volunteer opportunities found
          </p>
          <p className="text-sm text-gray-400">
            Try adjusting your search or check back later for new events
          </p>
        </div>
      )}
    </div>
  );
};

export default VolunteerList;
