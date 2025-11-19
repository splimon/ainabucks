// app/(root)/volunteer/[id]/page.tsx
import { db } from "@/database/drizzle";
import { eventsTable } from "@/database/schema";
import { eq } from "drizzle-orm";
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

interface EventDetailPageProps {
  params: Promise<{
    id: string;
  }>; // ← CHANGED: params is now a Promise
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  // ← CHANGED: Await params before using it
  const { id } = await params;

  // Fetch event from database
  const [event] = await db
    .select()
    .from(eventsTable)
    .where(eq(eventsTable.id, id)) // ← Now using the awaited id
    .limit(1);

  // If event not found, show 404
  if (!event) {
    notFound();
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

  const duration = typeof event.duration === 'string' 
    ? parseFloat(event.duration) 
    : event.duration;

  const spotsRemaining = event.volunteersNeeded - (event.volunteersRegistered || 0);

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
        {event.imageUrl && (
          <div className="w-full h-96 rounded-xl overflow-hidden mb-8">
            <img
              src={event.imageUrl}
              alt={event.title}
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
                {event.category}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About This Event
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* What to Bring */}
            {event.whatToBring && event.whatToBring.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Backpack className="w-5 h-5" />
                  What to Bring
                </h2>
                <ul className="space-y-2">
                  {event.whatToBring.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {event.requirements && event.requirements.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {event.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
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
                <p className="font-semibold">{event.locationName}</p>
                <p>{event.address}</p>
                <p>{event.city}, {event.state} {event.zipCode}</p>
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
                  {event.coordinatorName}
                </p>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4" />
                  <a 
                    href={`mailto:${event.coordinatorEmail}`}
                    className="hover:text-green-700 transition-colors"
                  >
                    {event.coordinatorEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4" />
                  <a 
                    href={`tel:${event.coordinatorPhone}`}
                    className="hover:text-green-700 transition-colors"
                  >
                    {event.coordinatorPhone}
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
                    {event.ainaBucks}
                  </span>
                </div>
                <p className="text-sm text-gray-600">ʻĀina Bucks</p>
                <p className="text-xs text-gray-500 mt-1">
                  {event.bucksPerHour} bucks per hour
                </p>
              </div>

              {/* Event Details */}
              <div className="space-y-4">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {formatDate(event.date)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </p>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">
                    {duration} {duration === 1 ? 'hour' : 'hours'}
                  </span>
                </div>

                {/* Spots */}
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">
                    {spotsRemaining} of {event.volunteersNeeded} spots left
                  </span>
                </div>
              </div>

              {/* Registration Button */}
              <Button 
                className="w-full bg-green-700 hover:bg-green-800 text-white py-6 text-lg font-semibold"
                disabled={spotsRemaining === 0}
              >
                {spotsRemaining === 0 ? "Event Full" : "Register Now"}
              </Button>

              {/* Status Message */}
              {spotsRemaining <= 5 && spotsRemaining > 0 && (
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

// ← CHANGED: Also await params in generateMetadata
export async function generateMetadata({ params }: EventDetailPageProps) {
  const { id } = await params; // ← Await params here too

  const [event] = await db
    .select()
    .from(eventsTable)
    .where(eq(eventsTable.id, id)) // ← Use awaited id
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