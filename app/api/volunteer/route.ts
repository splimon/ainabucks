import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '../../../lib/prisma';

const VolunteerEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(1, 'Location is required'),
  ainaBucksAwarded: z.number().min(0, 'Aina Bucks Awarded must be at least 0'),
  volunteerHours: z.number().min(0, 'Volunteer Hours must be at least 0'),
  userId: z.number().min(1, 'User ID is required'),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = VolunteerEventSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { errors: validation.error.format()},
      { status: 400 }
    );
  }
  // use parsed/validated data and connect the required user relation
  const newVolunteerEvent = await prisma.volunteerEvent.create({
    data: {
      title: validation.data.title,
      description: validation.data.description,
      date: new Date(validation.data.date),
      location: validation.data.location,
      ainaBucksAwarded: validation.data.ainaBucksAwarded,
      volunteerHours: validation.data.volunteerHours,
      user: {
        connect: { id: validation.data.userId },
      },
    },
  }); 

  return NextResponse.json(
    { message: 'Volunteer event created', event: newVolunteerEvent }, 
    { status: 201 } // 201 = Object Created
  );
}