// app/admin/events/[id]/edit/page.tsx
// Page for editing an existing event

import { db } from "@/database/drizzle";
import { eventsTable } from "@/database/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EventEditForm from '@/components/admin/events/EditEventForm';

interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  // Await params (Next.js 15+ requirement)
  const { id } = await params;

  // Fetch event from database
  const [event] = await db
    .select()
    .from(eventsTable)
    .where(eq(eventsTable.id, id))
    .limit(1);

  // If event not found, show 404
  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Render edit form with pre-filled event data */}
      <EventEditForm event={event} />
    </div>
  );
}

// Metadata for the page
export async function generateMetadata({ params }: EditEventPageProps) {
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
    title: `Edit ${event.title} | ʻĀina Bucks Admin`,
  };
}