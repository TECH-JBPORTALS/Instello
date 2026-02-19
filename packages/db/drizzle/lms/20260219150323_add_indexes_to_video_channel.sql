DROP INDEX "lms_chapter_channel_id_is_published_index";--> statement-breakpoint
DROP INDEX "lms_video_chapter_id_is_published_index";--> statement-breakpoint
CREATE INDEX "lms_channel_created_at_index" ON "lms_channel" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "lms_chapter_channel_id_index" ON "lms_chapter" USING btree ("channel_id");--> statement-breakpoint
CREATE INDEX "lms_chapter_is_published_index" ON "lms_chapter" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "lms_chapter_title_index" ON "lms_chapter" USING btree ("title");--> statement-breakpoint
CREATE INDEX "lms_video_chapter_id_index" ON "lms_video" USING btree ("chapter_id");--> statement-breakpoint
CREATE INDEX "lms_video_is_published_index" ON "lms_video" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "lms_subscription_clerk_user_id_index" ON "lms_subscription" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "lms_subscription_end_date_index" ON "lms_subscription" USING btree ("end_date");