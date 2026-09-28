CREATE TABLE `news_articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`date` text NOT NULL,
	`excerpt` text NOT NULL,
	`body` text NOT NULL,
	`image` text NOT NULL,
	`image_fit` text DEFAULT 'cover' NOT NULL,
	`source_url` text,
	`related_href` text,
	`related_label` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `news_articles_slug_unique` ON `news_articles` (`slug`);