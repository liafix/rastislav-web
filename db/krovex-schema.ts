import { decimal, mysqlEnum, mysqlTable, serial, timestamp, varchar } from "drizzle-orm/mysql-core";

export const inquiries = mysqlTable("krovex_inquiries", {
  id: serial("id").primaryKey(),
  submissionKey: varchar("submission_key", { length: 36 }).notNull().unique(),
  roofType: mysqlEnum("roof_type", ["new", "reconstruction", "repair"]).notNull(),
  areaM2: decimal("area_m2", { precision: 8, scale: 2 }).notNull(),
  location: varchar("location", { length: 160 }).notNull(),
  preferredTerm: varchar("preferred_term", { length: 160 }).notNull(),
  name: varchar("customer_name", { length: 100 }).notNull(),
  email: varchar("customer_email", { length: 254 }).notNull(),
  phone: varchar("customer_phone", { length: 32 }).notNull(),
  status: mysqlEnum("status", ["new", "completed"]).notNull().default("new"),
  companyEmailStatus: mysqlEnum("company_email_status", ["pending", "sent", "failed"]).notNull().default("pending"),
  customerEmailStatus: mysqlEnum("customer_email_status", ["pending", "sent", "failed"]).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
