import assert from "node:assert/strict";
import { test } from "node:test";
import { randomBytes, scryptSync } from "node:crypto";
import { verifyPassword, signSession, verifySession, sessionCookie, SESSION_SECONDS } from "../lib/admin/auth";
import { createAdminHandlers, positiveId } from "../lib/admin/handlers";

const secret = "test-only-secret-32-characters-long";
const salt = randomBytes(16).toString("hex");
const hash = "scrypt$" + salt + "$" + scryptSync("test password", salt, 64).toString("hex");
test("password hash accepts correct password and rejects wrong/oversized/malformed", () => {
  assert.equal(verifyPassword("test password", hash), true);
  assert.equal(verifyPassword("wrong", hash), false);
  assert.equal(verifyPassword("x".repeat(1025), hash), false);
  assert.equal(verifyPassword("test password", "plain"), false);
});
test("signed session rejects tampering, wrong secret, expired and malformed tokens", () => {
  const now = Date.now(), token = signSession(secret, now);
  assert.equal(verifySession(token, secret, now), true);
  assert.equal(verifySession(token, "other", now), false);
  assert.equal(verifySession("x" + token, secret, now), false);
  assert.equal(verifySession(token, secret, now + SESSION_SECONDS * 1000), false);
  for (const bad of [undefined, "", "x.y", token + ".x", "x".repeat(513)]) assert.equal(verifySession(bad, secret, now), false);
});
test("cookies enforce HttpOnly SameSite expiry and production Secure; logout expires", () => {
  assert.match(sessionCookie("token", true), /HttpOnly; SameSite=Lax; Max-Age=28800; Secure/);
  assert.doesNotMatch(sessionCookie("token", false), /Secure/);
  assert.match(sessionCookie("", true), /Max-Age=0; Secure/);
});
const request = (body: unknown, origin = "https://krovex.test") => new Request("https://krovex.test/api/admin/login", { method: "POST", headers: { origin, "Content-Type": "application/json" }, body: JSON.stringify(body) });
function setup() {
  let completed = false, calls = 0;
  const handlers = createAdminHandlers({ password: value => verifyPassword(value, hash), sign: () => signSession(secret), verify: token => verifySession(token, secret), complete: async id => { calls++; if (id !== 7) return false; completed = true; return true; }, production: true });
  return { handlers, state: () => ({ completed, calls }) };
}
test("wrong login fails; correct login returns signed secure cookie without password", async () => {
  const { handlers } = setup();
  assert.equal((await handlers.login(request({ password: "wrong" }))).status, 401);
  const response = await handlers.login(request({ password: "test password" }));
  assert.equal(response.status, 200);
  assert.match(response.headers.get("set-cookie")!, /Secure/);
  assert.equal(verifySession(response.headers.get("set-cookie")!.split(";")[0].split("=")[1], secret), true);
  assert.deepEqual(await response.json(), { ok: true });
});
test("cross-origin/malformed/oversized login rejected", async () => {
  const { handlers } = setup();
  assert.equal((await handlers.login(request({ password: "test password" }, "https://evil.test"))).status, 403);
  for (const body of [null, [], { password: 5 }, { password: "x", extra: true }]) assert.equal((await handlers.login(request(body))).status, 400);
  assert.equal((await handlers.login(request({ password: "x".repeat(3000) }))).status, 413);
});
test("anonymous and forged status mutation cannot touch storage", async () => {
  const { handlers, state } = setup();
  for (const cookie of ["", "krovex_admin=forged"]) {
    const req = new Request("https://krovex.test/api/admin/inquiries/7", { method: "PATCH", headers: { origin: "https://krovex.test", cookie } });
    assert.equal((await handlers.complete(req, "7")).status, 401);
  }
  assert.equal(state().calls, 0);
});
test("authorized completion persists in store, duplicate completion safe and CSRF blocked", async () => {
  const { handlers, state } = setup(), cookie = "krovex_admin=" + signSession(secret);
  const req = (origin = "https://krovex.test") => new Request("https://krovex.test/api/admin/inquiries/7", { method: "PATCH", headers: { origin, cookie } });
  assert.equal((await handlers.complete(req("https://evil.test"), "7")).status, 403);
  assert.equal(state().calls, 0);
  assert.equal((await handlers.complete(req(), "7")).status, 200);
  assert.equal(state().completed, true);
  assert.equal((await handlers.complete(req(), "7")).status, 200);
  assert.equal((await handlers.complete(req(), "8")).status, 404);
  assert.equal((await handlers.complete(req(), "-1")).status, 400);
});
test("logout clears cookie, refuses cross-origin", async () => {
  const { handlers } = setup();
  assert.match((await handlers.logout(request({}))).headers.get("set-cookie")!, /Max-Age=0/);
  assert.equal((await handlers.logout(request({}, "https://evil.test"))).status, 403);
});
test("admin errors are generic and IDs bounded", async () => {
  const handlers = createAdminHandlers({ password: () => { throw new Error("secret"); }, sign: () => "", verify: () => true, complete: async () => { throw new Error("DB password"); } });
  const response = await handlers.login(request({ password: "x" }));
  assert.equal(response.status, 503); assert.doesNotMatch(await response.text(), /secret/);
  const mutation = await handlers.complete(request({}), "7");
  assert.equal(mutation.status, 503); assert.doesNotMatch(await mutation.text(), /DB password/);
  for (const id of ["0", "-1", "1x", "1.5", "9999999999999999", ""]) assert.equal(positiveId(id), undefined);
});
