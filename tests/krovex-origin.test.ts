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

test("localhost and loopback are both valid same-origin targets, but not interchangeable origins", () => {
  for (const host of ["localhost:3107", "127.0.0.1:3107"]) {
    const headers = { host, origin: "http://" + host };
    assert.equal(isSameOrigin(new Request("http://localhost:3107/api", { headers })), true);
    assert.equal(isSameOrigin(new Request("http://localhost:3107/api", { headers: { ...headers, origin: "http://evil.test:3107" } })), false);
  }
  assert.equal(isSameOrigin(new Request("http://localhost:3107/api", { headers: { host: "127.0.0.1:3107", origin: "http://localhost:3107" } })), false);
});
test("forwarded protocol cannot authorize a scheme mismatch", () => {
  assert.equal(isSameOrigin(new Request("http://localhost:3107/api", { headers: { host: "localhost:3107", origin: "https://localhost:3107", "x-forwarded-proto": "https" } })), false);
});
