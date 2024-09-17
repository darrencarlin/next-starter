ALTER TABLE "user" ADD COLUMN "status" text DEFAULT 'no_subscription';--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "has_active_subscription";