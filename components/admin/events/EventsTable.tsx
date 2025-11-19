// components/admin/events/EventsTable.tsx
// Table component that displays events in rows with edit/delete actions

"use client";

import { useState } from "react";
import type { Event } from "@/database/schema";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { deleteEvent } from "@/lib/admin/actions/events";
import { useRouter } from "next/navigation";

interface EventsTableProps {
  events: Event[];
}

export default function EventsTable({ events }: EventsTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /**
   * Formats date from YYYY-MM-DD to readable format
   * Example: "2025-12-25" → "Dec 25, 2025"
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  /**
   * Handle event deletion
   * Shows confirmation dialog, calls delete action, refreshes page
   */
  const handleDelete = async (eventId: string, eventTitle: string) => {
    // Confirm deletion with user
    const confirmed = confirm(
      `Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    // Set loading state
    setDeletingId(eventId);

    try {
      // Call server action to delete event
      const result = await deleteEvent(eventId);

      if (result.success) {
        toast.success("Event deleted successfully");
        router.refresh(); // Refresh page to show updated list
      } else {
        toast.error(result.error || "Failed to delete event");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the event");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        {/* Table Header */}
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
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="bg-white divide-y divide-gray-200">
          {events.length === 0 ? (
            // Empty state - no events found
            <tr>
              <td colSpan={8} className="px-6 py-12 text-center">
                <p className="text-gray-500 text-lg">No events found</p>
                <p className="text-gray-400 text-sm mt-1">
                  Create your first event to get started
                </p>
              </td>
            </tr>
          ) : (
            // Map through events and create table rows
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
                      {/* Event image thumbnail */}
                      {event.imageUrl ? (
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-gray-200" />
                      )}
                      {/* Event title with line-clamp for long titles */}
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

                  {/* Volunteers (registered / needed) */}
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

                  {/* Created Date */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {formatDate(event.createdAt.toISOString().split('T')[0])}
                    </span>
                  </td>

                  {/* Actions - View, Edit, Delete */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* View button - opens event detail page */}
                      <Link href={`/volunteer/${event.id}`} target="_blank">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          title="View Event"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>

                      {/* Edit button - opens edit form */}
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

                      {/* Delete button - calls delete handler */}
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
  );
}