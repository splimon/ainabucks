import { z } from 'zod';

export const VolunteerEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(1, 'Location is required'),
  ainaBucksAwarded: z.number().min(0, 'Aina Bucks Awarded must be at least 0'),
  volunteerHours: z.number().min(0, 'Volunteer Hours must be at least 0'),
  userId: z.number().min(1, 'User ID is required'),
});
