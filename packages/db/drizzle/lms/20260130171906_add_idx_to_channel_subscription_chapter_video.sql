CREATE INDEX "lms_channel_is_public_index" ON "lms_channel" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "lms_chapter_channel_id_is_published_index" ON "lms_chapter" USING btree ("channel_id","is_published");--> statement-breakpoint
CREATE INDEX "lms_video_chapter_id_is_published_index" ON "lms_video" USING btree ("chapter_id","is_published");--> statement-breakpoint
CREATE INDEX "lms_video_author_id_index" ON "lms_video" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "lms_subscription_channel_id_index" ON "lms_subscription" USING btree ("channel_id");