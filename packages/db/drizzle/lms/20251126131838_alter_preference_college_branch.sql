ALTER TABLE "lms_course_or_branch" RENAME TO "lms_college_or_branch";--> statement-breakpoint
ALTER TABLE "lms_college_or_branch" RENAME COLUMN "course_id" TO "college_id";--> statement-breakpoint
ALTER TABLE "lms_preference" RENAME COLUMN "course_id" TO "college_id";--> statement-breakpoint
ALTER TABLE "lms_college_or_branch" DROP CONSTRAINT "lms_course_or_branch_course_id_lms_course_or_branch_id_fk";
--> statement-breakpoint
ALTER TABLE "lms_preference" DROP CONSTRAINT "lms_preference_course_id_lms_course_or_branch_id_fk";
--> statement-breakpoint
ALTER TABLE "lms_preference" DROP CONSTRAINT "lms_preference_branch_id_lms_course_or_branch_id_fk";
--> statement-breakpoint
ALTER TABLE "lms_college_or_branch" ADD CONSTRAINT "lms_college_or_branch_college_id_lms_college_or_branch_id_fk" FOREIGN KEY ("college_id") REFERENCES "public"."lms_college_or_branch"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lms_preference" ADD CONSTRAINT "lms_preference_college_id_lms_college_or_branch_id_fk" FOREIGN KEY ("college_id") REFERENCES "public"."lms_college_or_branch"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lms_preference" ADD CONSTRAINT "lms_preference_branch_id_lms_college_or_branch_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."lms_college_or_branch"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lms_chapter" DROP COLUMN "order";