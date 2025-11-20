/**
 * components/admin/events/EventsTable.tsx
 * Table component to display events with options to view, edit, delete, and view/download QR codes
 */

"use client";

import { useState } from "react";
import type { Event } from "@/database/schema";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, QrCode, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { deleteEvent } from "@/lib/admin/actions/events";
import { useRouter } from "next/navigation";
import QRCodeModal from "./QRCodeModal";

interface EventsTableProps {
  events: Event[];
}

export default function EventsTable({ events }: EventsTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDelete = async (eventId: string, eventTitle: string) => {
    const confirmed = confirm(
      `Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(eventId);

    try {
      const result = await deleteEvent(eventId);

      if (result.success) {
        toast.success("Event deleted successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete event");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the event");
    } finally {
      setDeletingId(null);
    }
  };

  const handleShowQR = (event: Event) => {
    setSelectedEvent(event);
    setShowQRModal(true);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Event Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Volunteers
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ʻĀina Bucks
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                QR Codes
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {events.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <p className="text-gray-500 text-lg">No events found</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Create your first event to get started
                  </p>
                </td>
              </tr>
            ) : (
              events.map((event) => {
                const spotsRemaining = event.volunteersNeeded - (event.volunteersRegistered || 0);
                const duration = typeof event.duration === 'string' 
                  ? parseFloat(event.duration) 
                  : event.duration;

                return (
                  <tr 
                    key={event.id} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Event Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {event.imageUrl ? (
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-gray-200" />
                        )}
                        <span className="font-medium text-gray-900 line-clamp-2 max-w-xs">
                          {event.title}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                        {event.category}
                      </span>
                    </td>

                    {/* Date & Time */}
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {formatDate(event.date)}
                        </p>
                        <p className="text-gray-500">
                          {event.startTime}
                        </p>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {event.locationName}
                        </p>
                        <p className="text-gray-500">
                          {event.city}, {event.state}
                        </p>
                      </div>
                    </td>

                    {/* Volunteers */}
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {event.volunteersRegistered || 0} / {event.volunteersNeeded}
                        </p>
                        <p className={`text-xs ${
                          spotsRemaining === 0 
                            ? "text-red-600" 
                            : spotsRemaining <= 5 
                              ? "text-yellow-600" 
                              : "text-green-600"
                        }`}>
                          {spotsRemaining === 0 
                            ? "Full" 
                            : `${spotsRemaining} spots left`}
                        </p>
                      </div>
                    </td>

                    {/* ʻĀina Bucks */}
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-bold text-orange-600">
                          {event.ainaBucks}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {duration} hrs
                        </p>
                      </div>
                    </td>

                    {/* QR Codes */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShowQR(event)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          title="View QR Codes"
                        >
                          <QrCode className="w-5 h-5" />
                        </Button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/events/${event.id}/attendance`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title="Manage Attendance"
                          >
                            <Users className="w-4 h-4" />
                          </Button>
                        </Link>

                        <Link href={`/volunteer/${event.id}`} target="_blank">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="View Event"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>

                        <Link href={`/admin/events/${event.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            title="Edit Event"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(event.id, event.title)}
                          disabled={deletingId === event.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* QR Code Modal */}
      {selectedEvent && (
        <QRCodeModal
          event={selectedEvent}
          isOpen={showQRModal}
          onClose={() => {
            setShowQRModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </>
  );
}