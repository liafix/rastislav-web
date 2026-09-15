import { adminHandlers } from "@/lib/admin/server";
export const runtime = "nodejs";
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  return adminHandlers.complete(request, (await context.params).id);
}
