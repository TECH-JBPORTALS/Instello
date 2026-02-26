CREATE TABLE "lms_study_material" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"created_by_clerk_user_id" text NOT NULL,
	"title" text NOT NULL,
	"file_id" text NOT NULL,
	"chapter_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lms_study_material" ADD CONSTRAINT "lms_study_material_chapter_id_lms_chapter_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."lms_chapter"("id") ON DELETE cascade ON UPDATE no action;