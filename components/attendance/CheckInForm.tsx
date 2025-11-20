/**
 * components/attendance/CheckInForm.tsx
 * Client-side form component for event check-in
 */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, MapPin, Clock, Loader2 } from "lucide-react";
import { checkInToEvent } from "@/lib/actions/attendance";
import { toast } from "sonner";
import Link from "next/link";

interface CheckInFormProps {
  event: {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    locationName: string;
    imageUrl: string | null;
  };
  token: string;
  userName: string;
}

export default function CheckInForm({
  event,
  token,
  userName,
}: CheckInFormProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);

  const handleCheckIn = async () => {
    setIsChecking(true);

    try {
      const result = await checkInToEvent(event.id, token);

      if (result.success && result.data) {
        setIsSuccess(true);
        setCheckInTime(result.data.checkInTime);
        toast.success("Successfully checked in!");
      } else {
        toast.error(result.error || "Failed to check in");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatCheckInTime = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isSuccess) {
    return (
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Success Header */}
        <div className="bg-linear-to-r from-green-600 to-green-700 p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Checked In!</h1>
          <p className="text-green-100">Welcome, {userName}</p>
        </div>

        {/* Event Details */}
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {event.title}
            </h2>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-green-600" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-green-600" />
                <span>
                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-green-600" />
                <span>{event.locationName}</span>
              </div>
            </div>
          </div>

          {/* Check-in Time */}
          {checkInTime && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-700 font-semibold mb-1">
                Check-in Time
              </p>
              <p className="text-green-900 font-bold">
                {formatCheckInTime(checkInTime)}
              </p>
            </div>
          )}

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 font-semibold mb-2">
              📋 Important Reminders:
            </p>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>Remember to check out when you leave</li>
              <li>Your ʻĀina Bucks will be awarded after the event</li>
              <li>Contact the event coordinator if you have questions</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/profile">
              <Button className="w-full bg-green-700 hover:bg-green-800 text-white">
                Go to My Profile
              </Button>
            </Link>
            <Link href="/volunteer">
              <Button variant="outline" className="w-full">
                Browse More Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Event Image */}
      {event.imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Check In</h1>
          <p className="text-gray-600">Ready to start volunteering?</p>
        </div>

        {/* Event Details */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {event.title}
          </h2>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-green-600" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-green-600" />
              <span>
                {formatTime(event.startTime)} - {formatTime(event.endTime)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-green-600" />
              <span>{event.locationName}</span>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Checking in as:</p>
          <p className="font-bold text-gray-900">{userName}</p>
        </div>

        {/* Check-in Button */}
        <Button
          onClick={handleCheckIn}
          disabled={isChecking}
          className="w-full bg-green-700 hover:bg-green-800 text-white py-6 text-lg font-semibold"
        >
          {isChecking ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Checking In...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Confirm Check-In
            </>
          )}
        </Button>

        {/* Footer Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          By checking in, you confirm your attendance at this event
        </p>
      </div>
    </div>
  );
}
