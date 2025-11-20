/**
 * components/admin/events/EventsTable.tsx
 * Table component to display events with options to view, edit, delete, and view/download QR codes
 */

"use client";

import { useState } from "react";
import type { EventWithRegistrations } from "@/database/schema";
import {
  Pencil,
  Trash2,
  Eye,
  QrCode,
  Users,
  Search,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { deleteEvent } from "@/lib/admin/actions/events";
import { useRouter } from "next/navigation";
import QRCodeModal from "./QRCodeModal";
import Image from "next/image";

interface EventsTableProps {
  events: EventWithRegistrations[];
}

export default function EventsTable({ events }: EventsTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] =
    useState<EventWithRegistrations | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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
      `Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`,
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
    } catch {
      toast.error("An error occurred while deleting the event");
    } finally {
      setDeletingId(null);
    }
  };

  const handleShowQR = (event: EventWithRegistrations) => {
    setSelectedEvent(event);
    setShowQRModal(true);
  };

  // Filter events based on search query
  const filteredEvents = events.filter((event) => {
    const query = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query) ||
      event.locationName.toLowerCase().includes(query) ||
      event.city.toLowerCase().includes(query)
    );
  });

  // Sort events by date
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (sortOrder === "asc") {
      return dateA - dateB;
    }
    return dateB - dateA;
  });

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Events Table
            </h2>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              Sort
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  sortOrder === "desc" ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events by title, category, or location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volunteers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ʻĀina Bucks
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  QR Codes
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {sortedEvents.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {searchQuery
                      ? "No events found matching your search"
                      : "No events found"}
                  </td>
                </tr>
              ) : (
                sortedEvents.map((event) => {
                  const spotsRemaining =
                    event.volunteersNeeded - event.volunteersRegistered;
                  const duration =
                    typeof event.duration === "string"
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
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-gray-200 shrink-0" />
                          )}
                          <span className="text-sm font-medium text-gray-900 line-clamp-2">
                            {event.title}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                          {event.category}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatDate(event.date)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {event.startTime}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {event.locationName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {event.city}, {event.state}
                        </div>
                      </td>

                      {/* Volunteers */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {event.volunteersRegistered} /{" "}
                          {event.volunteersNeeded}
                        </div>
                        <div
                          className={`text-sm ${
                            spotsRemaining === 0
                              ? "text-red-600"
                              : spotsRemaining <= 5
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {spotsRemaining === 0
                            ? "Full"
                            : `${spotsRemaining} spots left`}
                        </div>
                      </td>

                      {/* ʻĀina Bucks */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-orange-600">
                          {event.ainaBucks}
                        </div>
                        <div className="text-sm text-gray-500">
                          {duration} hrs
                        </div>
                      </td>

                      {/* QR Codes */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleShowQR(event)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-200 transition-colors rounded p-1"
                            title="View QR Codes"
                          >
                            <QrCode className="w-5 h-5" />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/admin/events/${event.id}/attendance`}>
                            <button
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-200 transition-colors rounded p-1"
                              title="Manage Attendance"
                            >
                              <Users className="w-5 h-5" />
                            </button>
                          </Link>

                          <Link href={`/volunteer/${event.id}`} target="_blank">
                            <button
                              className="text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors rounded p-1"
                              title="View Event"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </Link>

                          <Link href={`/admin/events/${event.id}/edit`}>
                            <button
                              className="text-green-600 hover:text-green-800 hover:bg-green-200 transition-colors rounded p-1"
                              title="Edit Event"
                            >
                              <Pencil className="w-5 h-5" />
                            </button>
                          </Link>

                          <button
                            onClick={() => handleDelete(event.id, event.title)}
                            disabled={deletingId === event.id}
                            className={`text-red-600 hover:text-red-800 hover:bg-red-200 transition-colors rounded p-1 ${
                              deletingId === event.id
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            title="Delete Event"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with total count */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            {searchQuery ? (
              <>
                Showing{" "}
                <span className="font-semibold">{sortedEvents.length}</span> of{" "}
                <span className="font-semibold">{events.length}</span> events
              </>
            ) : (
              <>
                Total Events:{" "}
                <span className="font-semibold">{events.length}</span>
              </>
            )}
          </p>
        </div>
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
