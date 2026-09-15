import "server-only";
import { desc, eq, lt } from "drizzle-orm";
import { getDb } from "@/db";
import { inquiries } from "@/db/krovex-schema";
export const adminStore = {
  async list(before?: number) { return getDb().select().from(inquiries).where(before ? lt(inquiries.id, before) : undefined).orderBy(desc(inquiries.id)).limit(21); },
  async detail(id: number) { const [row] = await getDb().select().from(inquiries).where(eq(inquiries.id, id)).limit(1); return row; },
  async complete(id: number) {
    const [result] = await getDb().update(inquiries).set({ status: "completed", updatedAt: new Date() }).where(eq(inquiries.id, id));
    return result.affectedRows === 1;
  }
};
