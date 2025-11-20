/**
 * components/admin/attendance/AttendanceTable.tsx
 * Table showing attendance records with ability to award ʻĀina Bucks
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Clock, Award } from "lucide-react";
import { toast } from "sonner";
import { awardAinaBucks } from "@/lib/actions/attendance";
import { useRouter } from "next/navigation";

interface AttendanceRecord {
  id: string;
  checkInTime: Date | null;
  checkOutTime: Date | null;
  hoursWorked: string | null;
  status: string;
  adminNotes: string | null;
  userId: string;
  userName: string;
  userEmail: string;
  bucksPerHour: number;
}

interface Registration {
  userId: string;
  userName: string;
  userEmail: string;
  registrationId: string;
  registrationStatus: string;
  registeredAt: Date;
}

interface AttendanceTableProps {
  attendance: AttendanceRecord[];
  registrations: Registration[];
  eventId: string;
  bucksPerHour: number;
}

export default function AttendanceTable({
  attendance,
  registrations,
  eventId,
  bucksPerHour,
}: AttendanceTableProps) {
  const router = useRouter();
  const [awardingId, setAwardingId] = useState<string | null>(null);
  const [hoursInputs, setHoursInputs] = useState<Record<string, number>>({});
  const [notesInputs, setNotesInputs] = useState<Record<string, string>>({});

  const formatDateTime = (date: Date | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const calculateDefaultHours = (checkIn: Date | null, checkOut: Date | null) => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.round((diff / (1000 * 60 * 60)) * 2) / 2; // Round to nearest 0.5
  };

  // Handle awarding ʻĀina Bucks
  const handleAward = async (attendanceId: string) => {
    const hours = hoursInputs[attendanceId];
    if (!hours || hours <= 0) {
      toast.error("Please enter valid hours worked");
      return;
    }

    setAwardingId(attendanceId);

    try {
      const result = await awardAinaBucks(
        attendanceId,
        hours,
        notesInputs[attendanceId] || undefined // optional notes
      );

      if (result.success && result.data) {
        toast.success(
          `Awarded ${result.data.ainaBucks} ʻĀina Bucks for ${result.data.hoursWorked} hours!`
        );
        router.refresh();
      } else {
        toast.error(result.error || "Failed to award ʻĀina Bucks");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setAwardingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Volunteer
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Check-In
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Check-Out
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Hours
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Award ʻĀina Bucks
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {/* Checked-in volunteers */}
          {attendance.map((record) => {
            const defaultHours = calculateDefaultHours(
              record.checkInTime,
              record.checkOutTime
            );
            const currentHours = hoursInputs[record.id] ?? defaultHours;
            const estimatedBucks = Math.round(currentHours * bucksPerHour);
            const isAwarded = record.hoursWorked && parseFloat(record.hoursWorked) > 0;

            return (
              <tr key={record.id} className="hover:bg-gray-50">
                {/* Volunteer Info */}
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{record.userName}</p>
                    <p className="text-sm text-gray-500">{record.userEmail}</p>
                  </div>
                </td>

                {/* Check-In Time */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {record.checkInTime && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                    <span className="text-sm text-gray-700">
                      {formatDateTime(record.checkInTime)}
                    </span>
                  </div>
                </td>

                {/* Check-Out Time */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {record.checkOutTime ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">
                          {formatDateTime(record.checkOutTime)}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Still at event
                      </span>
                    )}
                  </div>
                </td>

                {/* Hours Display */}
                <td className="px-6 py-4">
                  {isAwarded ? (
                    <span className="font-bold text-gray-900">
                      {parseFloat(record.hoursWorked!).toFixed(1)} hrs
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">
                      {defaultHours.toFixed(1)} hrs (auto)
                    </span>
                  )}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  {isAwarded ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1 w-fit">
                      <Award className="w-3 h-3" />
                      Awarded
                    </span>
                  ) : record.checkOutTime ? (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      Ready to Award
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                      In Progress
                    </span>
                  )}
                </td>

                {/* Award Controls */}
                <td className="px-6 py-4">
                  {isAwarded ? (
                    <div className="text-sm">
                      <p className="font-bold text-orange-600 mb-1">
                        {Math.round(parseFloat(record.hoursWorked!) * bucksPerHour)} Bucks
                      </p>
                      {record.adminNotes && (
                        <p className="text-xs text-gray-500 italic">
                          Note: {record.adminNotes}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Hours Input */}
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          step="0.5"
                          min="0"
                          placeholder="Hours"
                          value={hoursInputs[record.id] ?? defaultHours}
                          onChange={(e) =>
                            setHoursInputs({
                              ...hoursInputs,
                              [record.id]: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-24"
                        />
                        <span className="text-sm text-gray-600">
                          = {estimatedBucks} bucks
                        </span>
                      </div>

                      {/* Notes Input */}
                      <Input
                        placeholder="Admin notes (optional)"
                        value={notesInputs[record.id] || ""}
                        onChange={(e) =>
                          setNotesInputs({
                            ...notesInputs,
                            [record.id]: e.target.value,
                          })
                        }
                        className="text-sm"
                      />

                      {/* Award Button */}
                      <Button
                        onClick={() => handleAward(record.id)}
                        disabled={
                          awardingId === record.id ||
                          !currentHours ||
                          currentHours <= 0
                        }
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                        size="sm"
                      >
                        {awardingId === record.id ? (
                          "Awarding..."
                        ) : (
                          <>
                            <Award className="w-4 h-4 mr-2" />
                            Award {estimatedBucks} Bucks
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}

          {/* Registered but not checked in */}
          {registrations.map((reg) => (
            <tr key={reg.registrationId} className="bg-gray-50">
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-gray-900">{reg.userName}</p>
                  <p className="text-sm text-gray-500">{reg.userEmail}</p>
                </div>
              </td>
              <td colSpan={5} className="px-6 py-4">
                <span className="text-sm text-gray-500 italic">
                  Registered but not checked in yet
                </span>
              </td>
            </tr>
          ))}

          {/* Empty state */}
          {attendance.length === 0 && registrations.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <p className="text-gray-500">No attendance records yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Volunteers will appear here after they check in
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}