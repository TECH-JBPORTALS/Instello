ALTER TABLE "lms_college_or_branch" ADD COLUMN "code" text;--> statement-breakpoint
CREATE INDEX "lms_college_or_branch_name_code_index" ON "lms_college_or_branch" USING btree ("name","code");