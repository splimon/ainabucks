/**
 * lib/admin/actions/attendance.ts
 * Server actions for managing attendance and awarding ʻĀina Bucks
 */

"use server";

import { db } from "@/database/drizzle";
import {
  eventAttendanceTable,
  eventRegistrationsTable,
  eventsTable,
  usersTable,
  ainaBucksTransactionsTable,
} from "@/database/schema";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/app/(root)/auth";

interface ServerActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

interface CheckInData {
  eventTitle: string;
  checkInTime: Date | null;
}

interface CheckOutData {
  eventTitle: string;
  checkInTime: Date | null;
  checkOutTime: Date | null;
  hoursWorked: number;
}

interface AwardAinaBucksResponse {
  ainaBucks: number;
  hoursWorked: number;
}

/**
 * Check in to an event using QR code token
 */
export async function checkInToEvent(
  eventId: string,
  token: string,
): Promise<ServerActionResponse<CheckInData>> {
  try {
    // Get current user session
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        error: "You must be logged in to check in",
      };
    }

    const userId = session.user.id;

    // Verify the event exists and token is valid
    const [event] = await db
      .select({
        id: eventsTable.id,
        title: eventsTable.title,
        checkInToken: eventsTable.checkInToken,
        date: eventsTable.date,
        startTime: eventsTable.startTime,
      })
      .from(eventsTable)
      .where(eq(eventsTable.id, eventId))
      .limit(1);

    if (!event) {
      return {
        success: false,
        error: "Event not found",
      };
    }

    // Verify token matches
    if (event.checkInToken !== token) {
      return {
        success: false,
        error: "Invalid check-in token. Please scan the correct QR code.",
      };
    }

    // Check if user is registered for this event
    const [registration] = await db
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

    if (!registration) {
      return {
        success: false,
        error: "You are not registered for this event. Please register first.",
      };
    }

    // Check if already checked in
    const [existingAttendance] = await db
      .select()
      .from(eventAttendanceTable)
      .where(
        and(
          eq(eventAttendanceTable.userId, userId),
          eq(eventAttendanceTable.eventId, eventId),
        ),
      )
      .limit(1);

    if (existingAttendance) {
      return {
        success: false,
        error: "You have already checked in to this event.",
      };
    }

    // Create attendance record with check-in time
    const [attendance] = await db
      .insert(eventAttendanceTable)
      .values({
        userId,
        eventId,
        registrationId: registration.id,
        checkInTime: new Date(),
        status: "CHECKED_IN",
      })
      .returning();

    // Revalidate pages
    revalidatePath(`/volunteer/${eventId}`);
    revalidatePath("/profile");

    return {
      success: true,
      data: {
        eventTitle: event.title,
        checkInTime: attendance.checkInTime,
      },
    };
  } catch (error) {
    console.error("Error checking in:", error);
    return {
      success: false,
      error: "Failed to check in. Please try again.",
    };
  }
}

interface CheckOutData {
  eventTitle: string;
  checkInTime: Date | null;
  checkOutTime: Date | null;
  hoursWorked: number;
}

/**
 * Check out of an event using QR code token
 */
export async function checkOutOfEvent(
  eventId: string,
  token: string,
): Promise<ServerActionResponse<CheckOutData>> {
  try {
    // Get current user session
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        error: "You must be logged in to check out",
      };
    }

    const userId = session.user.id;

    // Verify the event exists and token is valid
    const [event] = await db
      .select({
        id: eventsTable.id,
        title: eventsTable.title,
        checkOutToken: eventsTable.checkOutToken,
      })
      .from(eventsTable)
      .where(eq(eventsTable.id, eventId))
      .limit(1);

    if (!event) {
      return {
        success: false,
        error: "Event not found",
      };
    }

    // Verify token matches
    if (event.checkOutToken !== token) {
      return {
        success: false,
        error: "Invalid check-out token. Please scan the correct QR code.",
      };
    }

    // Get attendance record
    const [attendance] = await db
      .select()
      .from(eventAttendanceTable)
      .where(
        and(
          eq(eventAttendanceTable.userId, userId),
          eq(eventAttendanceTable.eventId, eventId),
        ),
      )
      .limit(1);

    if (!attendance) {
      return {
        success: false,
        error: "You haven't checked in to this event yet.",
      };
    }

    if (attendance.checkOutTime) {
      return {
        success: false,
        error: "You have already checked out of this event.",
      };
    }

    // Update attendance record with check-out time
    const [updatedAttendance] = await db
      .update(eventAttendanceTable)
      .set({
        checkOutTime: new Date(),
        status: "CHECKED_OUT",
        updatedAt: new Date(),
      })
      .where(eq(eventAttendanceTable.id, attendance.id))
      .returning();

    // Calculate hours worked (for display only - admin will finalize)
    const checkInTime = new Date(attendance.checkInTime!).getTime();
    const checkOutTime = new Date(updatedAttendance.checkOutTime!).getTime();
    const hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60);

    // Revalidate pages
    revalidatePath(`/volunteer/${eventId}`);
    revalidatePath("/profile");

    return {
      success: true,
      data: {
        eventTitle: event.title,
        checkInTime: attendance.checkInTime,
        checkOutTime: updatedAttendance.checkOutTime,
        hoursWorked: Math.round(hoursWorked * 10) / 10, // Round to 1 decimal
      },
    };
  } catch (error) {
    console.error("Error checking out:", error);
    return {
      success: false,
      error: "Failed to check out. Please try again.",
    };
  }
}

/**
 * Get user's attendance record for an event
 */
export async function getUserEventAttendance(
  eventId: string,
): Promise<ServerActionResponse> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const [attendance] = await db
      .select()
      .from(eventAttendanceTable)
      .where(
        and(
          eq(eventAttendanceTable.userId, session.user.id),
          eq(eventAttendanceTable.eventId, eventId),
        ),
      )
      .limit(1);

    return {
      success: true,
      data: attendance || null,
    };
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return {
      success: false,
      error: "Failed to fetch attendance",
    };
  }
}

/**
 * Get all attendance records for an event
 */
export async function getEventAttendance(eventId: string) {
  try {
    const attendance = await db
      .select({
        // Attendance info
        id: eventAttendanceTable.id,
        checkInTime: eventAttendanceTable.checkInTime,
        checkOutTime: eventAttendanceTable.checkOutTime,
        hoursWorked: eventAttendanceTable.hoursWorked,
        status: eventAttendanceTable.status,
        adminNotes: eventAttendanceTable.adminNotes,

        // User info
        userId: usersTable.id,
        userName: usersTable.fullName,
        userEmail: usersTable.email,

        // Event info
        eventTitle: eventsTable.title,
        bucksPerHour: eventsTable.bucksPerHour,

        // Registration info
        registrationStatus: eventRegistrationsTable.status,
      })
      .from(eventAttendanceTable)
      .innerJoin(usersTable, eq(eventAttendanceTable.userId, usersTable.id))
      .innerJoin(eventsTable, eq(eventAttendanceTable.eventId, eventsTable.id))
      .innerJoin(
        eventRegistrationsTable,
        eq(eventAttendanceTable.registrationId, eventRegistrationsTable.id),
      )
      .where(eq(eventAttendanceTable.eventId, eventId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(attendance)),
    };
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return {
      success: false,
      error: "Failed to fetch attendance records",
    };
  }
}

/**
 * Award ʻĀina Bucks to a volunteer based on hours worked
 */
export async function awardAinaBucks(
  attendanceId: string,
  hoursWorked: number,
  adminNotes?: string,
): Promise<ServerActionResponse<AwardAinaBucksResponse>> {
  try {
    // Verify admin
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return {
        success: false,
        error: "Unauthorized: Admin access required",
      };
    }

    // Get attendance record with complete details
    const [attendance] = await db
      .select({
        id: eventAttendanceTable.id,
        userId: eventAttendanceTable.userId,
        eventId: eventAttendanceTable.eventId,
        registrationId: eventAttendanceTable.registrationId,
        currentHoursWorked: eventAttendanceTable.hoursWorked,
        bucksPerHour: eventsTable.bucksPerHour,
        eventTitle: eventsTable.title,
      })
      .from(eventAttendanceTable)
      .innerJoin(eventsTable, eq(eventAttendanceTable.eventId, eventsTable.id))
      .where(eq(eventAttendanceTable.id, attendanceId))
      .limit(1);

    if (!attendance) {
      return {
        success: false,
        error: "Attendance record not found",
      };
    }

    // Check if already awarded
    if (attendance.currentHoursWorked && parseFloat(attendance.currentHoursWorked) > 0) {
      return {
        success: false,
        error: "ʻĀina Bucks have already been awarded for this attendance",
      };
    }

    // Calculate ʻĀina Bucks
    const ainaBucks = Math.round(hoursWorked * attendance.bucksPerHour);

    // Start transaction
    await db.transaction(async (tx) => {
      // 1. Update attendance record
      await tx
        .update(eventAttendanceTable)
        .set({
          hoursWorked: hoursWorked.toString(),
          status: "CHECKED_OUT",
          adminNotes: adminNotes || null,
          updatedAt: new Date(),
        })
        .where(eq(eventAttendanceTable.id, attendanceId));

      // 2. Create transaction record
      await tx.insert(ainaBucksTransactionsTable).values({
        userId: attendance.userId,
        eventId: attendance.eventId,
        attendanceId,
        type: "EARNED",
        amount: ainaBucks,
        hoursWorked: hoursWorked.toString(),
        description: `Earned ${ainaBucks} ʻĀina Bucks for ${hoursWorked} hours at "${attendance.eventTitle}"`,
        approvedBy: session.user.id,
      });

      // 3. Update user totals
      await tx
        .update(usersTable)
        .set({
          totalAinaBucksEarned: sql`${usersTable.totalAinaBucksEarned} + ${ainaBucks}`,
          currentAinaBucks: sql`${usersTable.currentAinaBucks} + ${ainaBucks}`,
          totalHoursVolunteered: sql`${usersTable.totalHoursVolunteered} + ${hoursWorked}`,
        })
        .where(eq(usersTable.id, attendance.userId));

      // 4. Update registration status to ATTENDED
      await tx
        .update(eventRegistrationsTable)
        .set({
          status: "ATTENDED",
          updatedAt: new Date(),
        })
        .where(eq(eventRegistrationsTable.id, attendance.registrationId));
    });

    // Revalidate pages
    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${attendance.eventId}/attendance`);
    revalidatePath("/profile");

    return {
      success: true,
      data: {
        ainaBucks,
        hoursWorked,
      },
    };
  } catch (error) {
    console.error("Error awarding ʻĀina Bucks:", error);
    
    // Provide more detailed error information
    let errorMessage = "Failed to award ʻĀina Bucks. Please try again.";
    if (error instanceof Error) {
      console.error("Detailed error:", error.message);
      errorMessage = `Error: ${error.message}`;
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Get all registered users who haven't checked in yet
 */
export async function getEventRegistrations(eventId: string) {
  try {
    // Get all registrations for the event
    const allRegistrations = await db
      .select({
        userId: usersTable.id,
        userName: usersTable.fullName,
        userEmail: usersTable.email,
        registrationId: eventRegistrationsTable.id,
        registrationStatus: eventRegistrationsTable.status,
        registeredAt: eventRegistrationsTable.registeredAt,
      })
      .from(eventRegistrationsTable)
      .innerJoin(usersTable, eq(eventRegistrationsTable.userId, usersTable.id))
      .where(eq(eventRegistrationsTable.eventId, eventId))
      .orderBy(eventRegistrationsTable.registeredAt);

    // Get all users who have checked in (have attendance records)
    const attendedUsers = await db
      .select({
        userId: eventAttendanceTable.userId,
      })
      .from(eventAttendanceTable)
      .where(eq(eventAttendanceTable.eventId, eventId));

    const attendedUserIds = new Set(attendedUsers.map((a) => a.userId));

    // Filter out users who have already checked in
    const registrationsOnly = allRegistrations.filter(
      (reg) =>
        !attendedUserIds.has(reg.userId) &&
        reg.registrationStatus === "REGISTERED",
    );

    return {
      success: true,
      data: JSON.parse(JSON.stringify(registrationsOnly)),
    };
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return {
      success: false,
      error: "Failed to fetch registrations",
    };
  }
}
