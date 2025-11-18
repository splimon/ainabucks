/*
 * lib/validations.ts
 * Zod schemas for validating sign-up and sign-in forms.
 */

import { z } from "zod";

/* Sign-Up Form Validation Schema */
export const SignUpSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(8, "Password must be the same as above"),
});

/* Sign-In Form Validation Schema */
export const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

/* Event Creation Form Validation Schema */
export const EventCreationSchema = z.object({
  // Basic Information
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  category: z.string().min(1, "Category is required"), // e.g., "Community Service"
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(2000, "Description must be less than 2000 characters"),
  
  // Date & Time
  date: z.string().nonempty("Date is required"), // Format: "November 2, 2025"
  startTime: z.string().nonempty("Start time is required"), // Format: "8:00 AM"
  endTime: z.string().nonempty("End time is required"), // Format: "12:00 PM"
  
  // Location Details
  locationName: z.string().trim().min(3, "Location name is required"), // e.g., "Hawaii Foodbank"
  address: z.string().trim().min(5, "Address is required"), // e.g., "2611 Kilihau St"
  city: z.string().trim().min(2, "City is required"), // e.g., "Honolulu"
  state: z.string().trim().length(2, "State must be 2 characters"), // e.g., "HI"
  zipCode: z.string().trim().min(5, "Zip code is required"), // e.g., "96819"
  
  // Volunteers
  volunteersNeeded: z.number().min(1, "At least 1 volunteer spot is required"), // e.g., 20
  
  // Rewards
  ainaBucks: z.number().min(0, "Aina Bucks cannot be negative"), // e.g., 60
  bucksPerHour: z.number().min(0, "Bucks per hour cannot be negative"), // e.g., 15
  duration: z.number().min(0.5, "Duration must be at least 0.5 hours"), // e.g., 4 (hours)
  
  // Image
  imageUrl: z.url("Must be a valid URL").optional(), // Event photo

  // What to Bring (array of strings)
  whatToBring: z.array(z.string().trim().min(1)).optional(), // e.g., ["Closed-toe shoes", "Water bottle"]
  
  // Requirements (array of strings)
  requirements: z.array(z.string().trim().min(1)).optional(), // e.g., ["Must be at least 16 years old"]
  
  // Event Coordinator
  coordinatorName: z.string().trim().min(2, "Coordinator name is required"), // e.g., "Sarah Johnson"
  coordinatorEmail: z.email("Must be a valid email"), // e.g., "sarah@hawaiifoodbank.org"
  coordinatorPhone: z.string().trim().min(10, "Phone number must be at least 10 digits"), // e.g., "(808) 555-1234"
});