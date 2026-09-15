CREATE TABLE `krovex_inquiries` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`submission_key` varchar(36) NOT NULL,
	`roof_type` enum('new','reconstruction','repair') NOT NULL,
	`area_m2` decimal(8,2) NOT NULL,
	`location` varchar(160) NOT NULL,
	`preferred_term` varchar(160) NOT NULL,
	`customer_name` varchar(100) NOT NULL,
	`customer_email` varchar(254) NOT NULL,
	`customer_phone` varchar(32) NOT NULL,
	`status` enum('new','completed') NOT NULL DEFAULT 'new',
	`company_email_status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	`customer_email_status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `krovex_inquiries_id` PRIMARY KEY(`id`),
	CONSTRAINT `krovex_inquiries_submission_key_unique` UNIQUE(`submission_key`)
);
