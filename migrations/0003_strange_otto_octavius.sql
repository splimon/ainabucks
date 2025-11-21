CREATE TYPE "public"."attendance_status" AS ENUM('CHECKED_IN', 'CHECKED_OUT', 'INCOMPLETE');--> statement-breakpoint
CREATE TYPE "public"."redemption_status" AS ENUM('PENDING', 'FULFILLED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."reward_status" AS ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('EARNED', 'REDEEMED', 'ADJUSTED');--> statement-breakpoint
CREATE TABLE "aina_bucks_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"event_id" uuid,
	"attendance_id" uuid,
	"type" "transaction_type" NOT NULL,
	"amount" integer NOT NULL,
	"hours_worked" numeric(4, 2),
	"description" text NOT NULL,
	"approved_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_attendance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"registration_id" uuid NOT NULL,
	"check_in_time" timestamp with time zone,
	"check_out_time" timestamp with time zone,
	"hours_worked" numeric(4, 2),
	"status" "attendance_status" DEFAULT 'CHECKED_IN' NOT NULL,
	"admin_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reward_redemptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"reward_id" uuid NOT NULL,
	"transaction_id" uuid NOT NULL,
	"aina_bucks_spent" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"status" "redemption_status" DEFAULT 'PENDING' NOT NULL,
	"fulfilled_by" uuid,
	"fulfilled_at" timestamp with time zone,
	"admin_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rewards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"image_url" text,
	"aina_bucks_cost" integer NOT NULL,
	"quantity_available" integer DEFAULT 0 NOT NULL,
	"quantity_redeemed" integer DEFAULT 0 NOT NULL,
	"status" "reward_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users_table" RENAME TO "users";--> statement-breakpoint
ALTER TABLE "event_registrations" DROP CONSTRAINT "event_registrations_id_unique";--> statement-breakpoint
ALTER TABLE "events" DROP CONSTRAINT "events_id_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_table_id_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_table_email_unique";--> statement-breakpoint
ALTER TABLE "event_registrations" DROP CONSTRAINT "event_registrations_user_id_users_table_id_fk";
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "check_in_token" uuid DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "check_out_token" uuid DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "total_aina_bucks_earned" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "total_aina_bucks_redeemed" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "current_aina_bucks" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "total_hours_volunteered" numeric(8, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "aina_bucks_transactions" ADD CONSTRAINT "aina_bucks_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aina_bucks_transactions" ADD CONSTRAINT "aina_bucks_transactions_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aina_bucks_transactions" ADD CONSTRAINT "aina_bucks_transactions_attendance_id_event_attendance_id_fk" FOREIGN KEY ("attendance_id") REFERENCES "public"."event_attendance"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aina_bucks_transactions" ADD CONSTRAINT "aina_bucks_transactions_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_attendance" ADD CONSTRAINT "event_attendance_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_attendance" ADD CONSTRAINT "event_attendance_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_attendance" ADD CONSTRAINT "event_attendance_registration_id_event_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."event_registrations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reward_redemptions" ADD CONSTRAINT "reward_redemptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reward_redemptions" ADD CONSTRAINT "reward_redemptions_reward_id_rewards_id_fk" FOREIGN KEY ("reward_id") REFERENCES "public"."rewards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reward_redemptions" ADD CONSTRAINT "reward_redemptions_transaction_id_aina_bucks_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."aina_bucks_transactions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reward_redemptions" ADD CONSTRAINT "reward_redemptions_fulfilled_by_users_id_fk" FOREIGN KEY ("fulfilled_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_check_in_token_unique" UNIQUE("check_in_token");--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_check_out_token_unique" UNIQUE("check_out_token");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");