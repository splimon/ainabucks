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

interface AwardAinaBucksResponse {
  ainaBucks: number;
  hoursWorked: number;
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
      .innerJoin(
        usersTable,
        eq(eventAttendanceTable.userId, usersTable.id)
      )
      .innerJoin(
        eventsTable,
        eq(eventAttendanceTable.eventId, eventsTable.id)
      )
      .innerJoin(
        eventRegistrationsTable,
        eq(eventAttendanceTable.registrationId, eventRegistrationsTable.id)
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
  adminNotes?: string
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

    // Get attendance record
    const [attendance] = await db
      .select({
        userId: eventAttendanceTable.userId,
        eventId: eventAttendanceTable.eventId,
        bucksPerHour: eventsTable.bucksPerHour,
        eventTitle: eventsTable.title,
      })
      .from(eventAttendanceTable)
      .innerJoin(
        eventsTable,
        eq(eventAttendanceTable.eventId, eventsTable.id)
      )
      .where(eq(eventAttendanceTable.id, attendanceId))
      .limit(1);

    if (!attendance) {
      return {
        success: false,
        error: "Attendance record not found",
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
          adminNotes,
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

      // 4. Update registration status
      await tx
        .update(eventRegistrationsTable)
        .set({
          status: "ATTENDED",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(eventRegistrationsTable.userId, attendance.userId),
            eq(eventRegistrationsTable.eventId, attendance.eventId)
          )
        );
    });

    // Revalidate pages
    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${attendance.eventId}/attendance`);

    return {
      success: true,
      data: {
        ainaBucks,
        hoursWorked,
      },
    };
  } catch (error) {
    console.error("Error awarding ʻĀina Bucks:", error);
    return {
      success: false,
      error: "Failed to award ʻĀina Bucks. Please try again.",
    };
  }
}

/**
 * Get all registered users who haven't checked in yet
 */
export async function getEventRegistrations(eventId: string) {
  try {
    const registrations = await db
      .select({
        userId: usersTable.id,
        userName: usersTable.fullName,
        userEmail: usersTable.email,
        registrationId: eventRegistrationsTable.id,
        registrationStatus: eventRegistrationsTable.status,
        registeredAt: eventRegistrationsTable.registeredAt,
      })
      .from(eventRegistrationsTable)
      .innerJoin(
        usersTable,
        eq(eventRegistrationsTable.userId, usersTable.id)
      )
      .where(
        and(
          eq(eventRegistrationsTable.eventId, eventId),
          eq(eventRegistrationsTable.status, "REGISTERED")
        )
      )
      .orderBy(eventRegistrationsTable.registeredAt);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(registrations)),
    };
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return {
      success: false,
      error: "Failed to fetch registrations",
    };
  }
}