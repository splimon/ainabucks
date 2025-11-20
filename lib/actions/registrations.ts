/**
 * lib/actions/registrations.ts
 * Actions related to event registrations, including registering and cancelling.
 */

"use server";

import { db } from "@/database/drizzle";
import { eventRegistrationsTable, eventsTable } from "@/database/schema";
import { auth } from "@/app/(root)/auth";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Register a user for an event
 * Checks if event is full and if user is already registered
 */
export async function registerForEvent(eventId: string) {
  try {
    // Get current user session
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        error: "You must be logged in to register for events",
      };
    }

    const userId = session.user.id;

    // Check if user is already registered for this event
    const existingRegistration = await db
      .select()
      .from(eventRegistrationsTable)
      .where(
        and(
          eq(eventRegistrationsTable.userId, userId),
          eq(eventRegistrationsTable.eventId, eventId),
          eq(eventRegistrationsTable.status, "REGISTERED"),
        ),
      )
      .limit(1);

    if (existingRegistration.length > 0) {
      return {
        success: false,
        error: "You are already registered for this event",
      };
    }

    // Get event details and current registration count
    const [event] = await db
      .select({
        volunteersNeeded: eventsTable.volunteersNeeded,
        registrationCount: sql<number>`(
          SELECT CAST(COUNT(*) AS INTEGER)
          FROM event_registrations
          WHERE event_registrations.event_id = ${eventsTable.id}
          AND event_registrations.status = 'REGISTERED'
        )`.as("registration_count"),
      })
      .from(eventsTable)
      .where(eq(eventsTable.id, eventId))
      .limit(1);

    if (!event) {
      return { success: false, error: "Event not found" };
    }

    // Check if event is full
    if (event.registrationCount >= event.volunteersNeeded) {
      return {
        success: false,
        error: "This event is full. No spots remaining.",
      };
    }

    // Create registration
    await db.insert(eventRegistrationsTable).values({
      userId,
      eventId,
      status: "REGISTERED",
    });

    // Revalidate relevant pages to show updated data
    revalidatePath("/volunteer");
    revalidatePath(`/volunteer/${eventId}`);
    revalidatePath("/profile");
    revalidatePath("/admin/events");

    return { success: true };
  } catch (error) {
    console.error("Error registering for event:", error);
    return {
      success: false,
      error: "Failed to register for event. Please try again.",
    };
  }
}

/**
 * Cancel a user's event registration
 */
export async function cancelRegistration(eventId: string) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        error: "You must be logged in to cancel registrations",
      };
    }

    const userId = session.user.id;

    // Update registration status to CANCELLED
    await db
      .update(eventRegistrationsTable)
      .set({
        status: "CANCELLED",
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(eventRegistrationsTable.userId, userId),
          eq(eventRegistrationsTable.eventId, eventId),
          eq(eventRegistrationsTable.status, "REGISTERED"),
        ),
      );

    // Revalidate relevant pages
    revalidatePath("/volunteer");
    revalidatePath(`/volunteer/${eventId}`);
    revalidatePath("/profile");
    revalidatePath("/admin/events");

    return { success: true };
  } catch (error) {
    console.error("Error cancelling registration:", error);
    return {
      success: false,
      error: "Failed to cancel registration. Please try again.",
    };
  }
}

/**
 * Get user's upcoming event registrations
 */
export async function getUserUpcomingEvents(userId: string) {
  try {
    const upcomingEvents = await db
      .select({
        // Event details
        id: eventsTable.id,
        title: eventsTable.title,
        category: eventsTable.category,
        description: eventsTable.description,
        imageUrl: eventsTable.imageUrl,
        date: eventsTable.date,
        startTime: eventsTable.startTime,
        endTime: eventsTable.endTime,
        locationName: eventsTable.locationName,
        address: eventsTable.address,
        city: eventsTable.city,
        state: eventsTable.state,
        zipCode: eventsTable.zipCode,
        duration: eventsTable.duration,
        ainaBucks: eventsTable.ainaBucks,

        // Registration details
        registrationId: eventRegistrationsTable.id,
        registrationStatus: eventRegistrationsTable.status,
        registeredAt: eventRegistrationsTable.registeredAt,
      })
      .from(eventRegistrationsTable)
      .innerJoin(
        eventsTable,
        eq(eventRegistrationsTable.eventId, eventsTable.id),
      )
      .where(
        and(
          eq(eventRegistrationsTable.userId, userId),
          eq(eventRegistrationsTable.status, "REGISTERED"),
        ),
      )
      .orderBy(eventsTable.date, eventsTable.startTime);

    return upcomingEvents;
  } catch (error) {
    console.error("Error fetching user events:", error);
    return [];
  }
}

/**
 * Check if a user is registered for a specific event
 */
export async function isUserRegistered(userId: string, eventId: string) {
  try {
    const registration = await db
      .select()
      .from(eventRegistrationsTable)
      .where(
        and(
          eq(eventRegistrationsTable.userId, userId),
          eq(eventRegistrationsTable.eventId, eventId),
          eq(eventRegistrationsTable.status, "REGISTERED"),
        ),
      )
      .limit(1);

    return registration.length > 0;
  } catch (error) {
    console.error("Error checking registration:", error);
    return false;
  }
}
