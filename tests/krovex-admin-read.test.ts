import assert from "node:assert/strict";
import { test } from "node:test";
import { readAdminData } from "../lib/admin/read";
test("unauthorized admin read never invokes database", async () => {
  let calls = 0;
  const store = { list: async () => { calls++; return []; }, detail: async () => { calls++; return undefined; } };
  await assert.rejects(() => readAdminData(false, store, undefined, 7), /Unauthorized/);
  assert.equal(calls, 0);
  assert.deepEqual(await readAdminData(true, store, undefined, 7), [[], undefined]);
  assert.equal(calls, 2);
});
