// app/(root)/volunteer/[id]/page.tsx
import { db } from "@/database/drizzle";
import { eventsTable, eventRegistrationsTable } from "@/database/schema";
import { eq, and, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Mail,
  Phone,
  User,
  CheckCircle,
  Backpack,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/app/(root)/auth";
import RegisterButton from "@/components/volunteer/RegisterButton";

interface EventDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { id } = await params;

  // Get current user session
  const session = await auth();
  const userId = session?.user?.id;

  // Fetch event from database with registration count
  const [eventData] = await db
    .select({
      // All event fields
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
      volunteersNeeded: eventsTable.volunteersNeeded,
      duration: eventsTable.duration,
      ainaBucks: eventsTable.ainaBucks,
      bucksPerHour: eventsTable.bucksPerHour,
      whatToBring: eventsTable.whatToBring,
      requirements: eventsTable.requirements,
      coordinatorName: eventsTable.coordinatorName,
      coordinatorEmail: eventsTable.coordinatorEmail,
      coordinatorPhone: eventsTable.coordinatorPhone,

      // Count current registrations
      registrationCount: sql<number>`(
        SELECT COUNT(*) 
        FROM ${eventRegistrationsTable} 
        WHERE ${eventRegistrationsTable.eventId} = ${eventsTable.id}
        AND ${eventRegistrationsTable.status} = 'REGISTERED'
      )`.as("registration_count"),
    })
    .from(eventsTable)
    .where(eq(eventsTable.id, id))
    .limit(1);

  if (!eventData) {
    notFound();
  }

  // Check if current user is already registered
  let isRegistered = false;
  if (userId) {
    const registration = await db
      .select()
      .from(eventRegistrationsTable)
      .where(
        and(
          eq(eventRegistrationsTable.userId, userId),
          eq(eventRegistrationsTable.eventId, id),
          eq(eventRegistrationsTable.status, "REGISTERED"),
        ),
      )
      .limit(1);

    isRegistered = registration.length > 0;
  }

  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const duration =
    typeof eventData.duration === "string"
      ? parseFloat(eventData.duration)
      : eventData.duration;

  // Calculate spots remaining
  const spotsRemaining =
    eventData.volunteersNeeded - eventData.registrationCount;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back Button */}
        <Link href="/volunteer">
          <Button variant="ghost" className="mb-6">
            ← Back to Opportunities
          </Button>
        </Link>

        {/* Event Header Image */}
        {eventData.imageUrl && (
          <div className="w-full h-96 rounded-xl overflow-hidden mb-8">
            <img
              src={eventData.imageUrl}
              alt={eventData.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Category */}
            <div>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full mb-4">
                {eventData.category}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {eventData.title}
              </h1>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About This Event
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {eventData.description}
              </p>
            </div>

            {/* What to Bring */}
            {eventData.whatToBring && eventData.whatToBring.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Backpack className="w-5 h-5" />
                  What to Bring
                </h2>
                <ul className="space-y-2">
                  {eventData.whatToBring.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-gray-700"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {eventData.requirements && eventData.requirements.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {eventData.requirements.map((requirement, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-gray-700"
                    >
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Location Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location
              </h2>
              <div className="space-y-2 text-gray-700">
                <p className="font-semibold">{eventData.locationName}</p>
                <p>{eventData.address}</p>
                <p>
                  {eventData.city}, {eventData.state} {eventData.zipCode}
                </p>
              </div>
            </div>

            {/* Coordinator Contact */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Event Coordinator
              </h2>
              <div className="space-y-3">
                <p className="font-semibold text-gray-900">
                  {eventData.coordinatorName}
                </p>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4" />
                  <a
                    href={`mailto:${eventData.coordinatorEmail}`}
                    className="hover:text-green-700 transition-colors"
                  >
                    {eventData.coordinatorEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4" />
                  <a
                    href={`tel:${eventData.coordinatorPhone}`}
                    className="hover:text-green-700 transition-colors"
                  >
                    {eventData.coordinatorPhone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Info & Registration */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-8 space-y-6">
              {/* Rewards */}
              <div className="text-center py-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                  <span className="text-4xl font-bold text-orange-600">
                    {eventData.ainaBucks}
                  </span>
                </div>
                <p className="text-sm text-gray-600">ʻĀina Bucks</p>
                <p className="text-xs text-gray-500 mt-1">
                  {eventData.bucksPerHour} bucks per hour
                </p>
              </div>

              {/* Event Details */}
              <div className="space-y-4">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {formatDate(eventData.date)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatTime(eventData.startTime)} -{" "}
                      {formatTime(eventData.endTime)}
                    </p>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">
                    {duration} {duration === 1 ? "hour" : "hours"}
                  </span>
                </div>

                {/* Spots */}
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">
                    {spotsRemaining} of {eventData.volunteersNeeded} spots left
                  </span>
                </div>
              </div>

              {/* Registration Button Component */}
              <RegisterButton
                eventId={id}
                isRegistered={isRegistered}
                spotsRemaining={spotsRemaining}
                isLoggedIn={!!userId}
              />

              {/* Status Message */}
              {spotsRemaining <= 5 && spotsRemaining > 0 && !isRegistered && (
                <p className="text-sm text-orange-600 text-center">
                  ⚠️ Only {spotsRemaining} spots remaining!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: EventDetailPageProps) {
  const { id } = await params;

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

  return {
    title: `${event.title} | ʻĀina Bucks Volunteer`,
    description: event.description.substring(0, 160),
  };
}
