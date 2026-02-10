ALTER TABLE "lms_video" ADD COLUMN "order_index" integer DEFAULT 0;--> statement-breakpoint
CREATE INDEX "lms_video_order_index_index" ON "lms_video" USING btree ("order_index");