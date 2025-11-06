import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '../../../lib/prisma';

const VolunteerEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(1),
  location: z.string().min(1),
  points: z.number().min(0),
  userId: z.number().min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = VolunteerEventSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { errors: validation.error.issues },
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
      points: validation.data.points,
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


// volunteer 250 hours a year => 