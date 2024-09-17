CREATE TABLE IF NOT EXISTS "user_preference" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"language" varchar(5) DEFAULT 'en' NOT NULL,
	"email_notifications" boolean DEFAULT false NOT NULL,
	"push_notifications" boolean DEFAULT false NOT NULL,
	"default_view" varchar(20) DEFAULT 'list' NOT NULL,
	"theme_color" varchar(7) DEFAULT '#007bff' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_preference" ADD CONSTRAINT "user_preference_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
