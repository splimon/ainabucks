/**
 * components/volunteer/VolunteerList.tsx
 * VolunteerList component displays a list of volunteer events with details
 */

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  ChevronRight,
  Users,
  Clock,
  Tag,
} from "lucide-react";
import type { EventWithRegistrations } from "@/database/schema";
import Link from "next/link";

interface VolunteerListProps {
  events: EventWithRegistrations[];
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
  const getSpotsRemaining = (event: EventWithRegistrations) => {
    return event.volunteersNeeded - event.volunteersRegistered;
  };

  /**
   * Get status badge color based on availability
   */
  const getStatusBadge = (event: EventWithRegistrations) => {
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
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12">
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
              className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200"
            >
              {/* Event Image Section */}
              <div className="relative w-full h-56 bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden">
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <svg
                      className="w-16 h-16 text-gray-300 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-gray-400 text-sm font-medium">
                      Event Photo
                    </span>
                  </div>
                )}

                {/* Category Badge - Top Left */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg">
                    <Tag className="w-3.5 h-3.5" />
                    {event.category}
                  </span>
                </div>

                {/* Status Badge - Top Right */}
                <div className="absolute top-3 right-3">
                  {getStatusBadge(event)}
                </div>

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                {/* Event Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-green-600 transition-colors min-h-14">
                  {event.title}
                </h3>

                {/* Event Details Grid */}
                <div className="space-y-3 mb-5">
                  {/* Date & Time */}
                  <div className="flex items-start gap-3 text-gray-600">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-green-600 shrink-0" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
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
                    <div className="p-2 bg-green-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-green-600 shrink-0" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {event.locationName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {event.city}, {event.state}
                      </p>
                    </div>
                  </div>

                  {/* Duration & Volunteers - Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <Clock className="w-4 h-4 text-green-600 shrink-0" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {duration}h
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <Users className="w-4 h-4 text-green-600 shrink-0" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Spots Left</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {spotsRemaining}/{event.volunteersNeeded}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Preview */}
                <p className="text-sm text-gray-600 mb-5 line-clamp-2 min-h-10 leading-relaxed">
                  {event.description}
                </p>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                  {/* Rewards Info */}
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold bg-linear-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                        {event.ainaBucks}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">
                        ʻĀB
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {event.bucksPerHour} per hour
                    </span>
                  </div>

                  {/* Learn More Button */}
                  <Link href={`/volunteer/${event.id}`}>
                    <Button
                      className={`lg ${
                        spotsRemaining === 0
                          ? "bg-gray-100 text-gray-500 border-2 border-gray-200 cursor-not-allowed"
                          : "bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg hover:cursor-pointer"
                      }`}
                      disabled={spotsRemaining === 0}
                    >
                      {spotsRemaining === 0 ? (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Full
                        </>
                      ) : (
                        <>
                          View Details
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
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
          <div className="bg-white rounded-2xl shadow-lg p-12 max-w-lg mx-auto border border-gray-100">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-gray-100 to-gray-200 rounded-full mb-6">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Events Found
            </h3>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              No volunteer opportunities match your search. Try adjusting your
              filters or check back later for new events!
            </p>

            {/* Decorative element */}
            <div className="flex justify-center gap-2 text-gray-300">
              <div className="w-2 h-2 rounded-full bg-current"></div>
              <div className="w-2 h-2 rounded-full bg-current"></div>
              <div className="w-2 h-2 rounded-full bg-current"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerList;
