import "server-only";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, config, signSession, verifyPassword, verifySession } from "./auth";
import { createAdminHandlers } from "./handlers";
import { adminStore } from "./repository";
export async function isAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return verifySession(token, config().secret);
}
export const adminHandlers = createAdminHandlers({
  password: (password) => verifyPassword(password, config().hash),
  sign: () => signSession(config().secret),
  verify: (token) => token ? verifySession(token, config().secret) : false,
  complete: adminStore.complete
});
