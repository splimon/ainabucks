/*
 * app/(root)/profile/page.tsx
 * Profile page component that displays user information and upcoming events.
 */

import React from "react";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import { getUserUpcomingEvents } from "@/lib/actions/registrations";
import { Calendar, MapPin, Clock, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ProfilePage = async () => {
  // Check if user is authenticated
  const session = await auth();

  // Redirect to home page if not authenticated
  if (!session || !session.user?.id) redirect("/");

  // Fetch user's upcoming events
  const upcomingEvents = await getUserUpcomingEvents(session.user.id);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper function to format time
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-linear-to-b from-green-50 to-green-100 py-6">
      <div className="mb-8 max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold leading-tight mb-3">
          Welcome, {session.user.name}!
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          View your upcoming volunteer events and track your ʻĀina Bucks.
        </p>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Profile Information
          </h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">Name:</span> {session.user.name}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> {session.user.email}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Total Āina Bucks Earned:</span> 0
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Total Āina Bucks Redeemed:</span> 0
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Total Hours Volunteered:</span> 0
            </p>
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Upcoming Events ({upcomingEvents.length})
          </h2>

          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No upcoming events scheduled.</p>
              <Link href="/volunteer">
                <Button className="bg-green-700 hover:bg-green-800 text-white">
                  Browse Volunteer Opportunities
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => {
                const duration = typeof event.duration === 'string' 
                  ? parseFloat(event.duration) 
                  : event.duration;

                return (
                  <Link
                    key={event.id}
                    href={`/volunteer/${event.id}`}
                    className="block"
                  >
                    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex gap-4">
                        {/* Event Image */}
                        {event.imageUrl && (
                          <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                            <img
                              src={event.imageUrl}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Event Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mb-2">
                                {event.category}
                              </span>
                              <h3 className="text-lg font-bold text-gray-900">
                                {event.title}
                              </h3>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-orange-600">
                                <DollarSign className="w-4 h-4" />
                                <span className="font-bold">{event.ainaBucks}</span>
                              </div>
                              <p className="text-xs text-gray-500">ʻĀina Bucks</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>
                                {formatTime(event.startTime)} - {formatTime(event.endTime)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{event.locationName}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;