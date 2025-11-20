/**
 * database/schema.ts
 * Database schema definitions using Drizzle ORM for PostgreSQL
 */

import {
  decimal,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const STATUS_ENUM = pgEnum("status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const ROLE_ENUM = pgEnum("role", ["USER", "ADMIN"]);

export const EVENT_STATUS_ENUM = pgEnum("event_status", [
  "DRAFT", // Event is being created, not visible to users
  "PUBLISHED", // Event is live and visible to users
  "CANCELLED", // Event has been cancelled
  "COMPLETED", // Event has been completed
]);

export const REGISTRATION_STATUS_ENUM = pgEnum("registration_status", [
  "REGISTERED", // User has registered for the event
  "ATTENDED", // User attended the event (marked by admin)
  "NO_SHOW", // User didn't show up
  "CANCELLED", // User cancelled their registration
]);

export const ATTENDANCE_STATUS_ENUM = pgEnum("attendance_status", [
  "CHECKED_IN",
  "CHECKED_OUT",
  "INCOMPLETE", // User checked in but never checked out
]);

export const TRANSACTION_TYPE_ENUM = pgEnum("transaction_type", [
  "EARNED", // Earned from event
  "REDEEMED", // Spent on rewards
  "ADJUSTED", // Manual adjustment by admin
]);

/* Users table - stores user information */
export const usersTable = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  status: STATUS_ENUM("status").notNull().default("PENDING"),
  role: ROLE_ENUM("role").notNull().default("USER"),

  // ʻĀina Bucks tracking
  totalAinaBucksEarned: integer("total_aina_bucks_earned").notNull().default(0),
  totalAinaBucksRedeemed: integer("total_aina_bucks_redeemed")
    .notNull()
    .default(0),
  currentAinaBucks: integer("current_aina_bucks").notNull().default(0), // earned - redeemed
  totalHoursVolunteered: decimal("total_hours_volunteered", {
    precision: 8,
    scale: 2,
  })
    .notNull()
    .default("0"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* Events table - stores all volunteer event data */
export const eventsTable = pgTable("events", {
  // Primary Key
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),

  // Basic Information
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"), // optional event photo

  // Date & Time (stored as strings from form inputs)
  date: varchar("date", { length: 50 }).notNull(), // Store as string from form
  startTime: varchar("start_time", { length: 50 }).notNull(),
  endTime: varchar("end_time", { length: 50 }).notNull(),

  // Location
  locationName: varchar("location_name", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  zipCode: varchar("zip_code", { length: 10 }).notNull(),

  // Volunteers & Rewards
  volunteersNeeded: integer("volunteers_needed").notNull(),
  duration: decimal("duration", { precision: 4, scale: 2 }).notNull(), // e.g., 4.5 hours
  ainaBucks: integer("aina_bucks").notNull(),
  bucksPerHour: integer("bucks_per_hour").notNull(),

  // Arrays stored as JSONB - Drizzle way to store arrays
  whatToBring: jsonb("what_to_bring").$type<string[]>(),
  requirements: jsonb("requirements").$type<string[]>(),

  // Coordinator
  coordinatorName: varchar("coordinator_name", { length: 255 }).notNull(),
  coordinatorEmail: varchar("coordinator_email", { length: 255 }).notNull(),
  coordinatorPhone: varchar("coordinator_phone", { length: 50 }).notNull(),

  // QR Code tokens for check-in/out
  checkInToken: uuid("check_in_token").defaultRandom().unique(),
  checkOutToken: uuid("check_out_token").defaultRandom().unique(),

  // Metadata
  // status: EVENT_STATUS_ENUM("status").notNull().default("PUBLISHED"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* Event Registrations table - links users to events they registered for */
export const eventRegistrationsTable = pgTable("event_registrations", {
  // Primary Key
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),

  // Foreign Keys
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }), // Delete registration if user is deleted

  eventId: uuid("event_id")
    .notNull()
    .references(() => eventsTable.id, { onDelete: "cascade" }), // Delete registration if event is deleted

  // Registration Status
  status: REGISTRATION_STATUS_ENUM("status").notNull().default("REGISTERED"),

  // Timestamps
  registeredAt: timestamp("registered_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Track actual attendance with check-in/out times
export const eventAttendanceTable = pgTable("event_attendance", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),

  // Foreign Keys
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  eventId: uuid("event_id")
    .notNull()
    .references(() => eventsTable.id, { onDelete: "cascade" }),
  registrationId: uuid("registration_id")
    .notNull()
    .references(() => eventRegistrationsTable.id, { onDelete: "cascade" }),

  // Check-in/out times
  checkInTime: timestamp("check_in_time", { withTimezone: true }),
  checkOutTime: timestamp("check_out_time", { withTimezone: true }),

  // Calculated hours worked (set by admin or auto-calculated)
  hoursWorked: decimal("hours_worked", { precision: 4, scale: 2 }),

  // Status
  status: ATTENDANCE_STATUS_ENUM("status").notNull().default("CHECKED_IN"),

  // Admin notes (optional)
  adminNotes: text("admin_notes"),

  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Track all ʻĀina Bucks transactions
export const ainaBucksTransactionsTable = pgTable("aina_bucks_transactions", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),

  // Foreign Keys
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  eventId: uuid("event_id").references(() => eventsTable.id, {
    onDelete: "set null",
  }), // null if not event-related
  attendanceId: uuid("attendance_id").references(
    () => eventAttendanceTable.id,
    { onDelete: "set null" },
  ),

  // Transaction details
  type: TRANSACTION_TYPE_ENUM("type").notNull(),
  amount: integer("amount").notNull(), // Can be negative for redemptions

  // Hours worked (for earned transactions)
  hoursWorked: decimal("hours_worked", { precision: 4, scale: 2 }),

  // Description
  description: text("description").notNull(),

  // Admin who approved (for earned/adjusted transactions)
  approvedBy: uuid("approved_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),

  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* Type Exports */
export type User = typeof usersTable.$inferSelect; // For reading user data
export type NewUser = typeof usersTable.$inferInsert; // For inserting new users

export type Event = typeof eventsTable.$inferSelect; // For reading event data
export type NewEvent = typeof eventsTable.$inferInsert; // For inserting new events

export type EventRegistration = typeof eventRegistrationsTable.$inferSelect; // For reading registration data
export type NewEventRegistration = typeof eventRegistrationsTable.$inferInsert; // For inserting new registrations

export type EventAttendance = typeof eventAttendanceTable.$inferSelect; // For reading attendance data
export type NewEventAttendance = typeof eventAttendanceTable.$inferInsert; // For inserting new attendance records

export type AinaBucksTransaction =
  typeof ainaBucksTransactionsTable.$inferSelect; // For reading transaction data
export type NewAinaBucksTransaction =
  typeof ainaBucksTransactionsTable.$inferInsert; // For inserting new transactions

/**
 * Extended Event type that includes the current registration count
 * Used in components that need to display real-time registration data
 */
export type EventWithRegistrations = Event & {
  volunteersRegistered: number;
};
