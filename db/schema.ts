import {
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar
} from "drizzle-orm/mysql-core";

export const leadStatusEnum = mysqlEnum("status", ["new", "qualified", "paid", "closed", "lost"]);
export const leadSourceEnum = mysqlEnum("source", ["website", "phone", "whatsapp", "manual"]);
export const bookingStatusEnum = mysqlEnum("booking_status", [
  "requested",
  "confirmed",
  "paid",
  "cancelled",
  "completed"
]);
export const paymentTypeEnum = mysqlEnum("payment_type", ["reservation_fee", "consultation_fee"]);
export const paymentStatusEnum = mysqlEnum("payment_status", [
  "created",
  "pending",
  "checkout_failed",
  "paid",
  "failed",
  "refunded",
  "cancelled"
]);
export const projectStatusEnum = mysqlEnum("project_status", ["open", "won", "lost", "completed"]);

export const leads = mysqlTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  phone: varchar("phone", { length: 64 }).notNull(),
  email: varchar("email", { length: 191 }),
  service: varchar("service", { length: 96 }).notNull(),
  location: varchar("location", { length: 191 }).notNull(),
  message: text("message"),
  source: leadSourceEnum.default("website").notNull(),
  status: leadStatusEnum.default("new").notNull(),
  landingPage: varchar("landing_page", { length: 512 }),
  referrer: varchar("referrer", { length: 512 }),
  utmSource: varchar("utm_source", { length: 191 }),
  utmMedium: varchar("utm_medium", { length: 191 }),
  utmCampaign: varchar("utm_campaign", { length: 191 }),
  utmTerm: varchar("utm_term", { length: 191 }),
  utmContent: varchar("utm_content", { length: 191 }),
  consentAt: timestamp("consent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const bookings = mysqlTable("bookings", {
  id: serial("id").primaryKey(),
  leadId: int("lead_id").notNull(),
  preferredDate: varchar("preferred_date", { length: 32 }),
  preferredTime: varchar("preferred_time", { length: 64 }),
  message: text("message"),
  photosNote: text("photos_note"),
  bookingStatus: bookingStatusEnum.default("requested").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const payments = mysqlTable("payments", {
  id: serial("id").primaryKey(),
  leadId: int("lead_id").notNull(),
  bookingId: int("booking_id"),
  stripeSessionId: varchar("stripe_session_id", { length: 255 }).unique(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  paymentType: paymentTypeEnum.notNull(),
  amountCents: int("amount_cents").notNull(),
  currency: varchar("currency", { length: 3 }).default("eur").notNull(),
  paymentStatus: paymentStatusEnum.default("created").notNull(),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const stripeWebhookEvents = mysqlTable("stripe_webhook_events", {
  id: serial("id").primaryKey(),
  stripeEventId: varchar("stripe_event_id", { length: 255 }).notNull().unique(),
  eventType: varchar("event_type", { length: 128 }).notNull(),
  resourceId: varchar("resource_id", { length: 255 }),
  processedAt: timestamp("processed_at"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const projects = mysqlTable("projects", {
  id: serial("id").primaryKey(),
  leadId: int("lead_id").notNull(),
  finalValueCents: int("final_value_cents").default(0).notNull(),
  projectStatus: projectStatusEnum.default("open").notNull(),
  commissionPercent: decimal("commission_percent", { precision: 5, scale: 2 }).default("35.00").notNull(),
  commissionCapCents: int("commission_cap_cents").default(100000).notNull(),
  commissionEarnedCents: int("commission_earned_cents").default(0).notNull(),
  commissionPaidCents: int("commission_paid_cents").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
