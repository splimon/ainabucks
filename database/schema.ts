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
  "DRAFT",        // Event is being created, not visible to users
  "PUBLISHED",    // Event is live and visible to users
  "CANCELLED",    // Event has been cancelled
  "COMPLETED",    // Event has been completed
]);

export const REGISTRATION_STATUS_ENUM = pgEnum("registration_status", [
  "REGISTERED",    // User has registered for the event
  "ATTENDED",      // User attended the event (marked by admin)
  "NO_SHOW",       // User didn't show up
  "CANCELLED",     // User cancelled their registration
]);


/* Users table - stores user information */
export const usersTable = pgTable("users_table", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  status: STATUS_ENUM("status").notNull().default("PENDING"),
  role: ROLE_ENUM("role").notNull().default("USER"),
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
  
  // Metadata
  // status: EVENT_STATUS_ENUM("status").notNull().default("PUBLISHED"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

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
  status: REGISTRATION_STATUS_ENUM("status")
    .notNull()
    .default("REGISTERED"),
  
  // Timestamps
  registeredAt: timestamp("registered_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  
  updatedAt: timestamp("updated_at", { withTimezone: true })
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