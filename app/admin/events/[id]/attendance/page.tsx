/**
 * app/admin/events/[id]/attendance/page.tsx
 * Admin page to manage event attendance and award ʻĀina Bucks
 */

import { db } from "@/database/drizzle";
import { eventsTable } from "@/database/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AttendanceTable from "@/components/admin/attendance/AttendanceTable";
import { getEventAttendance, getEventRegistrations } from "@/lib/actions/attendance";

interface AttendancePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AttendancePage({ params }: AttendancePageProps) {
  const { id } = await params;

  // Fetch event details
  const [event] = await db
    .select()
    .from(eventsTable)
    .where(eq(eventsTable.id, id))
    .limit(1);

  if (!event) {
    notFound();
  }

  // Fetch attendance records
  const attendanceResult = await getEventAttendance(id);
  const attendance = attendanceResult.success ? attendanceResult.data : [];

  // Fetch registrations (users who registered but haven't checked in)
  const registrationsResult = await getEventRegistrations(id);
  const registrations = registrationsResult.success ? registrationsResult.data : [];

  // Calculate stats
  const totalRegistered = attendance.length + registrations.length;
  const checkedIn = attendance.filter((a: any) => a.checkInTime).length;
  const checkedOut = attendance.filter((a: any) => a.checkOutTime).length;
  const awarded = attendance.filter((a: any) => a.hoursWorked && parseFloat(a.hoursWorked) > 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Back Button */}
          <Link href="/admin/events">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>

          {/* Title and Stats */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Attendance Management
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {event.title}
            </p>

            {/* Event Info */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-blue-600 font-semibold">Date: </span>
                <span className="ml-2 text-blue-900">{event.date}</span>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-blue-600 font-semibold">Time: </span>
                <span className="ml-2 text-blue-900">
                  {event.startTime} - {event.endTime}
                </span>
              </div>
              <div className="bg-orange-50 px-4 py-2 rounded-lg">
                <span className="text-orange-600 font-semibold">Reward: </span>
                <span className="ml-2 text-orange-900">
                  {event.bucksPerHour} ʻĀina Bucks/hour
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Registered */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Total Registered</p>
            <p className="text-3xl font-bold text-gray-900">{totalRegistered}</p>
          </div>

          {/* Checked In */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200 shadow-sm">
            <p className="text-sm text-green-700 mb-2">Checked In</p>
            <p className="text-3xl font-bold text-green-900">{checkedIn}</p>
          </div>

          {/* Checked Out */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 shadow-sm">
            <p className="text-sm text-blue-700 mb-2">Checked Out</p>
            <p className="text-3xl font-bold text-blue-900">{checkedOut}</p>
          </div>

          {/* Awarded */}
          <div className="bg-orange-50 rounded-xl p-6 border border-orange-200 shadow-sm">
            <p className="text-sm text-orange-700 mb-2">ʻĀina Bucks Awarded</p>
            <p className="text-3xl font-bold text-orange-900">{awarded}</p>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Attendance Records
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Review check-ins and award ʻĀina Bucks based on hours worked
            </p>
          </div>

          <AttendanceTable 
            attendance={attendance}
            registrations={registrations}
            eventId={id}
            bucksPerHour={event.bucksPerHour}
          />
        </div>
      </div>
    </div>
  );
}

// Generate metadata for the page for SEO
export async function generateMetadata({ params }: AttendancePageProps) {
  const { id } = await params;

  // Fetch event details
  const [event] = await db
    .select()
    .from(eventsTable)
    .where(eq(eventsTable.id, id))
    .limit(1);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  // Return dynamic title
  return {
    title: `Attendance: ${event.title} | ʻĀina Bucks Admin`,
  };
}