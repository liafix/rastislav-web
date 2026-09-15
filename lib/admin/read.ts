import "server-only";
import type { InquiryRecord } from "@/lib/inquiries/contract";
export async function readAdminData(authorized: boolean, store: { list: (before?: number) => Promise<InquiryRecord[]>; detail: (id: number) => Promise<InquiryRecord | undefined> }, before?: number, id?: number) {
  if (!authorized) throw new Error("Unauthorized");
  return Promise.all([store.list(before), id ? store.detail(id) : Promise.resolve(undefined)]);
}
