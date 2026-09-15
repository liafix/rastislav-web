import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { inquiries } from "@/db/krovex-schema";
import type { InquiryStore } from "./service";

export const inquiryStore: InquiryStore = {
  async create(input) {
    const now = new Date();
    const [result] = await getDb().insert(inquiries).values({ ...input, createdAt: now, updatedAt: now });
    if (!Number.isSafeInteger(result.insertId) || result.insertId <= 0) throw new Error("Invalid inquiry insert result.");
    return { ...input, id: result.insertId, status: "new", companyEmailStatus: "pending", customerEmailStatus: "pending", createdAt: now, updatedAt: now };
  },
  async findBySubmissionKey(key) {
    const [row] = await getDb().select().from(inquiries).where(eq(inquiries.submissionKey, key)).limit(1);
    return row;
  },
  async recordDelivery(id, recipient, status) {
    const values = recipient === "company" ? { companyEmailStatus: status } : { customerEmailStatus: status };
    const [result] = await getDb().update(inquiries).set({ ...values, updatedAt: new Date() }).where(eq(inquiries.id, id));
    if (result.affectedRows !== 1) throw new Error("Inquiry delivery result was not saved.");
  }
};
