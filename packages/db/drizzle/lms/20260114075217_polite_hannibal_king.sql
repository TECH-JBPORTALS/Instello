ALTER TABLE "lms_coupon" ALTER COLUMN "max_redemptions" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "lms_video" ADD COLUMN "author_id" text;--> statement-breakpoint
ALTER TABLE "lms_video" ADD CONSTRAINT "lms_video_author_id_lms_author_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."lms_author"("id") ON DELETE no action ON UPDATE no action;