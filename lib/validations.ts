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
  title: z
    .string()
    .trim()
    .min(1, "Event title is required")
    .max(100, "Title is too long"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(100, "Category is too long"), // e.g., "Community Service"
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description is too long"),

  // Image
  imageUrl: z.url("Must be a valid URL").optional().or(z.literal("")), // Event photo; allow empty string

  // Date & Time
  date: z
    .string()
    .nonempty("Date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"), // Format: "YYYY-MM-DD"
  startTime: z
    .string()
    .nonempty("Start time is required")
    .regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"), // Format: "8:00 AM"
  endTime: z
    .string()
    .nonempty("End time is required")
    .regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"), // Format: "12:00 PM"

  // Location Details
  locationName: z.string().trim().min(1, "Location name is required"), // e.g., "Hawaii Foodbank"
  address: z.string().trim().min(1, "Address is required"), // e.g., "2611 Kilihau St"
  city: z.string().trim().min(1, "City is required"), // e.g., "Honolulu"
  state: z.string().trim().length(2, "State must be 2 characters"), // e.g., "HI"
  zipCode: z
    .string()
    .trim()
    .min(5, "Zip code is required")
    .regex(/^\d{5}(-\d{4})?$/, "Invalid zip code format"), // e.g., "96819"

  // Volunteers
  volunteersNeeded: z.number().min(1, "At least 1 volunteer spot is required"), // e.g., 20

  // Rewards
  ainaBucks: z.number().min(0, "Aina Bucks is required"), // e.g., 60
  bucksPerHour: z.number().min(0, "Bucks per hour is required"), // e.g., 15
  duration: z.number().min(0.5, "Duration must be at least 0.5 hours"), // e.g., 4 (hours)

  // Dynamic Arrays (will be populated from state)
  whatToBring: z.array(z.string()).default([]), // e.g., ["Closed-toe shoes", "Water bottle"]

  requirements: z.array(z.string()).default([]), // e.g., ["Must be at least 16 years old"]

  // Event Coordinator
  coordinatorName: z.string().trim().min(1, "Coordinator name is required"), // e.g., "Sarah Johnson"
  coordinatorEmail: z.email("Must be a valid email"), // e.g., "sarah@hawaiifoodbank.org"
  coordinatorPhone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\d\s\-\(\)\+]+$/, "Invalid phone number format"), // e.g., "(808) 555-1234"
});

// Export the type for use in components
export type EventCreationInput = z.infer<typeof EventCreationSchema>;

/* Reward Creation Form Validation Schema */
export const RewardCreationSchema = z.object({
  // Reward Details
  name: z
    .string()
    .trim()
    .min(1, "Reward name is required")
    .max(255, "Name is too long"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description is too long"),

  // Image
  imageUrl: z.url("Must be a valid URL").optional().or(z.literal("")),

  // Cost
  ainaBucksCost: z
    .number()
    .min(1, "Cost must be at least 1 ʻĀina Buck")
    .max(10000, "Cost is too high"),

  // Inventory
  quantityAvailable: z
    .number()
    .int("Quantity must be a whole number")
    .min(-1, "Use -1 for unlimited quantity")
    .max(10000, "Quantity is too high"),
});

// Export the type for use in components
export type RewardCreationInput = z.infer<typeof RewardCreationSchema>;
