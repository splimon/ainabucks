/**
 * app/attendance/check-in/[eventId]/page.tsx
 * User check-in page accessed via QR code
 */

import { db } from "@/database/drizzle";
import { eventsTable } from "@/database/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/app/(root)/auth";
import CheckInForm from "@/components/attendance/CheckInForm";

interface CheckInPageProps {
  params: Promise<{
    eventId: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function CheckInPage({
  params,
  searchParams,
}: CheckInPageProps) {
  const { eventId } = await params;
  const { token } = await searchParams;

  // Check if user is logged in
  const session = await auth();
  if (!session || !session.user?.id) {
    // Redirect to sign-in with return URL
    redirect(
      `/sign-in?callbackUrl=/attendance/check-in/${eventId}?token=${token}`,
    );
  }

  // Verify token exists
  if (!token) {
    notFound();
  }

  // Fetch event details
  const [event] = await db
    .select({
      id: eventsTable.id,
      title: eventsTable.title,
      date: eventsTable.date,
      startTime: eventsTable.startTime,
      endTime: eventsTable.endTime,
      locationName: eventsTable.locationName,
      imageUrl: eventsTable.imageUrl,
      checkInToken: eventsTable.checkInToken,
    })
    .from(eventsTable)
    .where(eq(eventsTable.id, eventId))
    .limit(1);

  if (!event) {
    notFound();
  }

  // Verify token matches (security check)
  if (event.checkInToken !== token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid QR Code
          </h1>
          <p className="text-gray-600">
            This QR code is not valid. Please scan the correct check-in QR code.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-green-100 flex items-center justify-center p-4">
      <CheckInForm
        event={event}
        token={token}
        userName={session.user.name || ""}
      />
    </div>
  );
}

export async function generateMetadata({ params }: CheckInPageProps) {
  const { eventId } = await params;

  const [event] = await db
    .select()
    .from(eventsTable)
    .where(eq(eventsTable.id, eventId))
    .limit(1);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: `Check In: ${event.title} | ʻĀina Bucks`,
  };
}
