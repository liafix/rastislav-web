import assert from "node:assert/strict";
import { test } from "node:test";
import { isSameOrigin } from "../lib/request-origin";
test("origin uses actual Host when Next constructs an internal hostname", () => {
  assert.equal(isSameOrigin(new Request("http://localhost:3107/api/admin/login", { headers: { host: "127.0.0.1:3107", origin: "http://127.0.0.1:3107" } })), true);
});
test("origin rejects external sites, mismatched scheme, missing origin and forwarded-host spoof", () => {
  for (const origin of ["https://evil.test", "http://krovex.test", "null", "https://krovex.test/"]) {
    assert.equal(isSameOrigin(new Request("https://internal.test/api", { headers: { host: "krovex.test", origin, "x-forwarded-host": "evil.test" } })), false);
  }
  assert.equal(isSameOrigin(new Request("https://krovex.test/api")), false);
});
