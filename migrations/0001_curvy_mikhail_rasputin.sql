CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"image_url" text,
	"date" varchar(50) NOT NULL,
	"start_time" varchar(50) NOT NULL,
	"end_time" varchar(50) NOT NULL,
	"location_name" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(2) NOT NULL,
	"zip_code" varchar(10) NOT NULL,
	"volunteers_needed" integer NOT NULL,
	"duration" numeric(4, 2) NOT NULL,
	"aina_bucks" integer NOT NULL,
	"bucks_per_hour" integer NOT NULL,
	"what_to_bring" jsonb,
	"requirements" jsonb,
	"coordinator_name" varchar(255) NOT NULL,
	"coordinator_email" varchar(255) NOT NULL,
	"coordinator_phone" varchar(50) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "events_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DROP TYPE "public"."event_status";--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED');