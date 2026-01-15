CREATE TABLE "lms_author" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"created_by_clerk_user_id" text NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100),
	"email" varchar(256) NOT NULL,
	"phone" varchar(256) NOT NULL,
	"image_ut_file_id" text,
	"instagram_link" text,
	"designation" text,
	"experience_years" integer,
	"organization" text,
	"bio" text
);
