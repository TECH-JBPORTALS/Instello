ALTER TABLE "lms_channel" ADD COLUMN "college_id" text;--> statement-breakpoint
ALTER TABLE "lms_channel" ADD COLUMN "branch_id" text;--> statement-breakpoint
ALTER TABLE "lms_channel" ADD COLUMN "subject_code" text;--> statement-breakpoint
ALTER TABLE "lms_channel" ADD CONSTRAINT "lms_channel_college_id_lms_college_or_branch_id_fk" FOREIGN KEY ("college_id") REFERENCES "public"."lms_college_or_branch"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lms_channel" ADD CONSTRAINT "lms_channel_branch_id_lms_college_or_branch_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."lms_college_or_branch"("id") ON DELETE no action ON UPDATE no action;