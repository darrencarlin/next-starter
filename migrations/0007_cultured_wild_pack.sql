ALTER TABLE "user" RENAME COLUMN "status" TO "subscription_status";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "stripe_subscription_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "plan_name" varchar(50);--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id");