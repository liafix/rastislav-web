import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
export const ADMIN_COOKIE = "krovex_admin";
export const SESSION_SECONDS = 28800;
export function config() {
  const hash = process.env.ADMIN_PASSWORD_HASH ?? "", secret = process.env.ADMIN_SESSION_SECRET ?? "";
  if (!/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(hash) || Buffer.byteLength(secret) < 32) throw new Error("Admin configuration unavailable");
  return { hash, secret };
}
export function verifyPassword(password: string, hash: string) {
  if (!password || Buffer.byteLength(password) > 1024 || !/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(hash)) return false;
  const [, salt, digest] = hash.split("$");
  return timingSafeEqual(scryptSync(password, salt, 64), Buffer.from(digest, "hex"));
}
export function signSession(secret: string, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ v: 1, exp: Math.floor(now / 1000) + SESSION_SECONDS, nonce: randomBytes(16).toString("hex") })).toString("base64url");
  return payload + "." + createHmac("sha256", secret).update(payload).digest("base64url");
}
export function verifySession(token: string | undefined, secret: string, now = Date.now()) {
  if (!token || token.length > 512) return false;
  const parts = token.split(".");
  if (parts.length !== 2 || !/^[\w-]+$/.test(parts[0]) || !/^[\w-]{43}$/.test(parts[1])) return false;
  const expected = createHmac("sha256", secret).update(parts[0]).digest("base64url");
  if (!timingSafeEqual(Buffer.from(expected), Buffer.from(parts[1]))) return false;
  try {
    const data = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    const seconds = Math.floor(now / 1000);
    return data.v === 1 && Number.isInteger(data.exp) && data.exp > seconds && data.exp <= seconds + SESSION_SECONDS && /^[a-f0-9]{32}$/.test(data.nonce);
  } catch { return false; }
}
export function sessionCookie(token: string, production = process.env.NODE_ENV === "production") {
  return `${ADMIN_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${token ? SESSION_SECONDS : 0}${production ? "; Secure" : ""}`;
}
export function requestToken(request: Request) {
  return request.headers.get("cookie")?.split(";").map(p => p.trim()).find(p => p.startsWith(ADMIN_COOKIE + "="))?.slice(ADMIN_COOKIE.length + 1);
}
