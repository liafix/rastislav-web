CREATE TABLE `bookings` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`lead_id` int NOT NULL,
	`preferred_date` varchar(32),
	`preferred_time` varchar(64),
	`message` text,
	`photos_note` text,
	`booking_status` enum('requested','confirmed','paid','cancelled','completed') NOT NULL DEFAULT 'requested',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`phone` varchar(64) NOT NULL,
	`email` varchar(191),
	`service` varchar(96) NOT NULL,
	`location` varchar(191) NOT NULL,
	`message` text,
	`source` enum('website','phone','whatsapp','manual') NOT NULL DEFAULT 'website',
	`status` enum('new','qualified','paid','closed','lost') NOT NULL DEFAULT 'new',
	`landing_page` varchar(512),
	`referrer` varchar(512),
	`utm_source` varchar(191),
	`utm_medium` varchar(191),
	`utm_campaign` varchar(191),
	`utm_term` varchar(191),
	`utm_content` varchar(191),
	`consent_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`lead_id` int NOT NULL,
	`booking_id` int,
	`stripe_session_id` varchar(255),
	`stripe_payment_intent_id` varchar(255),
	`payment_type` enum('reservation_fee','consultation_fee') NOT NULL,
	`amount_cents` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'eur',
	`payment_status` enum('created','pending','checkout_failed','paid','failed','refunded','cancelled') NOT NULL DEFAULT 'created',
	`paid_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `payments_stripe_session_id_unique` UNIQUE(`stripe_session_id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`lead_id` int NOT NULL,
	`final_value_cents` int NOT NULL DEFAULT 0,
	`project_status` enum('open','won','lost','completed') NOT NULL DEFAULT 'open',
	`commission_percent` decimal(5,2) NOT NULL DEFAULT '35.00',
	`commission_cap_cents` int NOT NULL DEFAULT 100000,
	`commission_earned_cents` int NOT NULL DEFAULT 0,
	`commission_paid_cents` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stripe_webhook_events` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`stripe_event_id` varchar(255) NOT NULL,
	`event_type` varchar(128) NOT NULL,
	`resource_id` varchar(255),
	`processed_at` timestamp,
	`error_message` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stripe_webhook_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `stripe_webhook_events_stripe_event_id_unique` UNIQUE(`stripe_event_id`)
);
