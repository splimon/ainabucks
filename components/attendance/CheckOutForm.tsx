/**
 * components/attendance/CheckOutForm.tsx
 * Client-side form component for event check-out
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Calendar,
  MapPin,
  Clock,
  Loader2,
  Award,
} from "lucide-react";
import { checkOutOfEvent } from "@/lib/actions/attendance";
import { toast } from "sonner";
import Link from "next/link";

interface CheckOutFormProps {
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

export default function CheckOutForm({
  event,
  token,
  userName,
}: CheckOutFormProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkOutData, setCheckOutData] = useState<{
    checkInTime: Date | null;
    checkOutTime: Date | null;
    hoursWorked: number;
  } | null>(null);

  const handleCheckOut = async () => {
    setIsChecking(true);

    try {
      const result = await checkOutOfEvent(event.id, token);

      if (result.success && result.data) {
        setIsSuccess(true);
        setCheckOutData({
          checkInTime: result.data.checkInTime,
          checkOutTime: result.data.checkOutTime,
          hoursWorked: result.data.hoursWorked,
        });
        toast.success("Successfully checked out!");
      } else {
        toast.error(result.error || "Failed to check out");
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

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isSuccess && checkOutData) {
    return (
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Success Header */}
        <div className="bg-linear-to-r from-orange-600 to-orange-700 p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Checked Out!</h1>
          <p className="text-orange-100">
            Thank you for volunteering, {userName}
          </p>
        </div>

        {/* Event Details */}
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {event.title}
            </h2>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-orange-600" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-orange-600" />
                <span>{event.locationName}</span>
              </div>
            </div>
          </div>

          {/* Time Summary */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-orange-700 font-semibold mb-3">
              ⏱️ Your Volunteer Time
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-orange-700">Check-in:</span>
                <span className="font-bold text-orange-900">
                  {checkOutData.checkInTime
                    ? formatDateTime(checkOutData.checkInTime)
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">Check-out:</span>
                <span className="font-bold text-orange-900">
                  {checkOutData.checkOutTime
                    ? formatDateTime(checkOutData.checkOutTime)
                    : "N/A"}
                </span>
              </div>
              <div className="border-t border-orange-300 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-orange-700 font-semibold">
                    Total Time:
                  </span>
                  <span className="text-xl font-bold text-orange-900">
                    {checkOutData.hoursWorked} hours
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reward Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Award className="w-6 h-6 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-green-800 font-semibold mb-2">
                  🎉 ʻĀina Bucks Coming Soon!
                </p>
                <p className="text-sm text-green-700">
                  Your ʻĀina Bucks will be awarded by the event coordinator
                  after they review your attendance. Check your profile soon to
                  see your rewards!
                </p>
              </div>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 font-semibold mb-2">
              🙏 Thank You for Making a Difference!
            </p>
            <p className="text-sm text-blue-700">
              Your {checkOutData.hoursWorked} hours of service help strengthen
              our community. We appreciate your dedication and time!
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/profile">
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                View My Profile
              </Button>
            </Link>
            <Link href="/volunteer">
              <Button variant="outline" className="w-full">
                Find More Opportunities
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Out</h1>
          <p className="text-gray-600">
            Finished volunteering? Check out below
          </p>
        </div>

        {/* Event Details */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {event.title}
          </h2>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-orange-600" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-600" />
              <span>
                {formatTime(event.startTime)} - {formatTime(event.endTime)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-orange-600" />
              <span>{event.locationName}</span>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Checking out as:</p>
          <p className="font-bold text-gray-900">{userName}</p>
        </div>

        {/* Check-out Button */}
        <Button
          onClick={handleCheckOut}
          disabled={isChecking}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-lg font-semibold"
        >
          {isChecking ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Checking Out...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Confirm Check-Out
            </>
          )}
        </Button>

        {/* Footer Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Your ʻĀina Bucks will be awarded after admin review
        </p>
      </div>
    </div>
  );
}
