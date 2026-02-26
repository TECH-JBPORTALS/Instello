ALTER TABLE "lms_preference" DROP CONSTRAINT "lms_preference_college_id_lms_college_or_branch_id_fk";
--> statement-breakpoint
ALTER TABLE "lms_preference" DROP CONSTRAINT "lms_preference_branch_id_lms_college_or_branch_id_fk";
--> statement-breakpoint
ALTER TABLE "lms_preference" ADD CONSTRAINT "lms_preference_college_id_lms_college_or_branch_id_fk" FOREIGN KEY ("college_id") REFERENCES "public"."lms_college_or_branch"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lms_preference" ADD CONSTRAINT "lms_preference_branch_id_lms_college_or_branch_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."lms_college_or_branch"("id") ON DELETE set null ON UPDATE no action;