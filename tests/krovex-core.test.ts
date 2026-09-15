import assert from "node:assert/strict";
import { test, mock } from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import nodemailer from "nodemailer";
import { INQUIRY_FIELDS, type InquiryRecord } from "../lib/inquiries/contract";
import { InquiryRequestError, parseInquiry } from "../lib/inquiries/validation";
import { createInquiryHandler } from "../lib/inquiries/handler";
import { MAX_INQUIRY_BYTES, readInquiryRequest } from "../lib/inquiries/request";
import { submitInquiry, type InquiryDependencies, type InquiryStore, type MailOutcome, type Recipient } from "../lib/inquiries/service";
import { companyInquiryTemplate, customerInquiryTemplate, INQUIRY_NEXT_STEP } from "../lib/email/templates";
import { sendCompanyInquiry, sendCustomerInquiry, sendEmail } from "../lib/email/server";

const valid = {
  submissionKey: "ab53de9d-5694-4a49-8e43-f581b32aa8b9",
  roofType: "new", areaM2: "120,50", location: " Žilina ",
  preferredTerm: " október 2026 ", name: " Ľudovít Novák ",
  email: " ludovit@example.test ", phone: "+421 (905) 123-456"
};
function input() { return parseInquiry(valid); }
function row(value = input()): InquiryRecord {
  return { ...value, id: 42, status: "new", companyEmailStatus: "pending", customerEmailStatus: "pending",
    createdAt: new Date("2026-09-15T12:34:56Z"), updatedAt: new Date("2026-09-15T12:34:56Z") };
}
function fixture() {
  const records = new Map<string, InquiryRecord>();
  const events: string[] = [];
  const logs: Array<{ event: string; details: object }> = [];
  const sent: InquiryRecord[] = [];
  const store: InquiryStore = {
    async create(value) {
      events.push("insert");
      if (records.has(value.submissionKey)) throw { cause: { code: "ER_DUP_ENTRY" } };
      const created = row(value);
      records.set(value.submissionKey, structuredClone(created));
      return created;
    },
    async findBySubmissionKey(key) { return structuredClone(records.get(key)); },
    async recordDelivery(_id, recipient, status) {
      events.push("record:" + recipient);
      const saved = records.values().next().value;
      assert.ok(saved);
      if (recipient === "company") saved.companyEmailStatus = status;
      else saved.customerEmailStatus = status;
    }
  };
  const deps: InquiryDependencies = {
    store,
    async sendCompany(value) { events.push("company"); sent.push(structuredClone(value)); return { status: "sent" }; },
    async sendCustomer(value) { events.push("customer"); sent.push(structuredClone(value)); return { status: "sent" }; },
    log(event, details) { logs.push({ event, details }); }
  };
  return { deps, records, events, logs, sent };
}
function request(body: unknown = valid) {
  return new Request("https://krovex.example.test/api/inquiries", {
    method: "POST", headers: { "Content-Type": "application/json", Origin: "https://krovex.example.test" }, body: JSON.stringify(body)
  });
}
test("normalization preserves Unicode, canonical decimal, phone and flexible term", () => {
  assert.deepEqual(input(), { ...valid, roofType: "new", areaM2: "120.50", location: "Žilina",
    preferredTerm: "október 2026", name: "Ľudovít Novák", email: "ludovit@example.test", phone: "+421905123456" });
  assert.equal(parseInquiry({ ...valid, preferredTerm: "čo najskôr", areaM2: 0.01 }).areaM2, "0.01");
});
for (const field of [...INQUIRY_FIELDS, "submissionKey"]) {
  test("required field rejected: " + field, () => {
    const body: Record<string, unknown> = { ...valid };
    delete body[field];
    assert.throws(() => parseInquiry(body), (error) =>
      error instanceof InquiryRequestError && error.status === 422 && Boolean(error.fieldErrors[field as keyof typeof error.fieldErrors]));
  });
}
for (const field of INQUIRY_FIELDS) {
  test("wrong type rejected: " + field, () => {
    assert.throws(() => parseInquiry({ ...valid, [field]: { injected: true } }), InquiryRequestError);
  });
}
for (const area of [0, -1, "", "Infinity", Infinity, NaN, "12abc", "1e2", "2.345", 100000.01, "0.001", true]) {
  test("invalid area rejected: " + String(area), () => {
    assert.throws(() => parseInquiry({ ...valid, areaM2: area }), InquiryRequestError);
  });
}
test("enum and malformed top-level bodies are rejected", () => {
  for (const body of [null, [], "text", 12]) assert.throws(() => parseInquiry(body), InquiryRequestError);
  for (const type of ["other", "NEW", "", null]) assert.throws(() => parseInquiry({ ...valid, roofType: type }), InquiryRequestError);
});
test("emails and header injection rejected", () => {
  for (const email of ["", "x", "a@@example.test", "a..b@example.test", "a@-example.test", "a@example.test\r\nBcc: x@example.test", "a".repeat(255)]) {
    assert.throws(() => parseInquiry({ ...valid, email }), InquiryRequestError);
  }
});
test("phone structure rejected", () => {
  for (const phone of ["123", "++421905123456", "abc123456789", "+421 (905 123456", ")123456789(", "1".repeat(16)]) {
    assert.throws(() => parseInquiry({ ...valid, phone }), InquiryRequestError);
  }
});
test("excessive lengths reject instead of truncating", () => {
  for (const [field, count] of [["name", 101], ["location", 161], ["preferredTerm", 161], ["phone", 33]] as const) {
    assert.throws(() => parseInquiry({ ...valid, [field]: "x".repeat(count) }), InquiryRequestError);
  }
});
test("unexpected/prototype fields rejected", () => {
  assert.throws(() => parseInquiry({ ...valid, recipient: "attacker@example.test" }), InquiryRequestError);
  assert.throws(() => parseInquiry(JSON.parse(JSON.stringify(valid).replace("{", '{"__proto__":{"admin":true},'))), InquiryRequestError);
});
test("request parser rejects malformed JSON, wrong content type, cross-origin and oversized streaming data", async () => {
  const f = fixture();
  const handler = createInquiryHandler(f.deps);
  const malformed = await handler(new Request("https://krovex.example.test/api/inquiries", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: "{"
  }));
  assert.equal(malformed.status, 400);
  assert.equal((await handler(new Request("https://krovex.example.test/api/inquiries", { method: "POST", body: "{}" }))).status, 415);
  const foreign = request();
  foreign.headers.set("Origin", "https://foreign.example.test");
  assert.equal((await handler(foreign)).status, 403);
  const huge = new Request("https://krovex.example.test/api/inquiries", {
    method: "POST", headers: { "Content-Type": "application/json", "Content-Length": "1" },
    body: " ".repeat(MAX_INQUIRY_BYTES + 1)
  });
  assert.equal((await handler(huge)).status, 413);
  assert.deepEqual(f.events, []);
});
test("UTF-8 byte bound and malformed UTF-8 are enforced", async () => {
  for (const body of [new TextEncoder().encode("ž".repeat(MAX_INQUIRY_BYTES)), new Uint8Array([0xff])]) {
    await assert.rejects(readInquiryRequest(new Request("https://krovex.example.test/api/inquiries", {
      method: "POST", headers: { "Content-Type": "application/json" }, body
    })), InquiryRequestError);
  }
});
test("HTTP validation maps all required field errors and never touches storage", async () => {
  const f = fixture();
  const response = await createInquiryHandler(f.deps)(request({ submissionKey: valid.submissionKey }));
  assert.equal(response.status, 422);
  const body = await response.json();
  for (const field of INQUIRY_FIELDS) assert.equal(typeof body.fieldErrors[field], "string");
  assert.deepEqual(f.events, []);
});
test("happy path persists before both emails and records each result", async () => {
  const f = fixture();
  const response = await createInquiryHandler(f.deps)(request());
  assert.equal(response.status, 201);
  assert.deepEqual(f.events, ["insert", "company", "record:company", "customer", "record:customer"]);
  assert.equal(f.records.size, 1);
  const receipt = await response.json();
  assert.equal(receipt.inquiryId, 42);
  assert.deepEqual(receipt.delivery, { company: "sent", customer: "sent" });
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal("email" in receipt, false);
});
test("same key and normalized data returns receipt without new record or email", async () => {
  const f = fixture();
  const handler = createInquiryHandler(f.deps);
  await handler(request());
  const result = await handler(request({ ...valid, areaM2: 120.5, phone: "+421905123456", location: "Žilina" }));
  assert.equal(result.status, 200);
  assert.equal((await result.json()).duplicate, true);
  assert.equal(f.records.size, 1);
  assert.equal(f.sent.length, 2);
});
test("same key with changed data conflicts and sends nothing extra", async () => {
  const f = fixture();
  const handler = createInquiryHandler(f.deps);
  await handler(request());
  const result = await handler(request({ ...valid, location: "Bratislava" }));
  assert.equal(result.status, 409);
  assert.equal(f.sent.length, 2);
  assert.equal(f.records.size, 1);
});
test("concurrent duplicates have only one sender", async () => {
  const f = fixture();
  let release: (() => void) | undefined;
  const held = new Promise<void>((resolve) => { release = resolve; });
  f.deps.sendCompany = async () => { f.events.push("company"); await held; return { status: "sent" }; };
  const first = submitInquiry(input(), f.deps);
  const second = await submitInquiry(input(), f.deps);
  assert.equal(second.duplicate, true);
  assert.equal(second.delivery.company, "pending");
  release?.();
  await first;
  assert.equal(f.records.size, 1);
  assert.equal(f.events.filter((event) => event === "company").length, 1);
  assert.equal(f.events.filter((event) => event === "customer").length, 1);
});
test("DB failure attempts no mail and exposes no raw infrastructure error", async () => {
  const f = fixture();
  f.deps.store.create = async () => { throw new Error("private credentials and SQL"); };
  const response = await createInquiryHandler(f.deps)(request());
  assert.equal(response.status, 503);
  assert.doesNotMatch(await response.text(), /private|credentials|SQL/);
  assert.equal(f.sent.length, 0);
  assert.equal(f.records.size, 0);
});
for (const failed of [["company"], ["customer"], ["company", "customer"]] as Recipient[][]) {
  test("saved inquiry survives SMTP failure: " + failed.join(","), async () => {
    const f = fixture();
    const fail = async (): Promise<MailOutcome> => ({ status: "failed", reason: "smtp_send_failed" });
    if (failed.includes("company")) f.deps.sendCompany = fail;
    if (failed.includes("customer")) f.deps.sendCustomer = fail;
    const response = await createInquiryHandler(f.deps)(request());
    assert.equal(response.status, 201);
    const result = await response.json();
    for (const who of ["company", "customer"]) assert.equal(result.delivery[who], failed.includes(who as Recipient) ? "failed" : "sent");
    assert.equal(f.records.size, 1);
    assert.equal(f.records.get(input().submissionKey)?.companyEmailStatus, result.delivery.company);
    assert.equal(f.records.get(input().submissionKey)?.customerEmailStatus, result.delivery.customer);
    const retry = await createInquiryHandler(f.deps)(request());
    assert.equal(retry.status, 200);
  });
}
test("throwing owner sender does not suppress customer send", async () => {
  const f = fixture();
  f.deps.sendCompany = async () => { throw new Error("SMTP secret"); };
  const receipt = await submitInquiry(input(), f.deps);
  assert.deepEqual(receipt.delivery, { company: "failed", customer: "sent" });
  assert.doesNotMatch(JSON.stringify(f.logs), /SMTP secret|ludovit/);
});
test("outcome-update failure preserves inquiry and still attempts other email", async () => {
  const f = fixture();
  f.deps.store.recordDelivery = async () => { throw new Error("DB temporarily unavailable"); };
  const receipt = await submitInquiry(input(), f.deps);
  assert.equal(receipt.deliveryRecorded, false);
  assert.equal(f.records.size, 1);
  assert.equal(f.sent.length, 2);
  assert.equal(f.records.get(input().submissionKey)?.companyEmailStatus, "pending");
  await submitInquiry(input(), f.deps);
  assert.equal(f.sent.length, 2);
});
test("company and customer templates include the complete inquiry, escaping and next step", () => {
  const inquiry = row({ ...input(), name: 'Ľudo <script>alert("x")</script> & syn', location: "Žilina <dom>" });
  for (const template of [companyInquiryTemplate(inquiry), customerInquiryTemplate(inquiry)]) {
    for (const value of ["42", "Nová strecha", "120.50 m²", "október 2026", inquiry.email, inquiry.phone, inquiry.createdAt.toISOString()]) {
      assert.ok(template.text.includes(value));
      assert.ok(template.html.includes(value));
    }
    assert.ok(template.text.includes(inquiry.name));
    assert.ok(template.text.includes(inquiry.location));
    assert.ok(template.html.includes("&lt;script&gt;"));
    assert.ok(template.html.includes("&quot;x&quot;"));
    assert.ok(template.html.includes("&amp; syn"));
    assert.ok(template.html.includes("Žilina &lt;dom&gt;"));
    assert.doesNotMatch(template.html, /<script>/);
    assert.doesNotMatch(JSON.stringify(template), /stripe|payment|checkout|mailto|platb/i);
  }
  assert.ok(customerInquiryTemplate(inquiry).html.includes(INQUIRY_NEXT_STEP));
  assert.ok(customerInquiryTemplate(inquiry).text.includes(INQUIRY_NEXT_STEP));
});
test("SMTP transport is mocked: exact password, mandatory inquiry sends, recipients and timeouts", async () => {
  const keys = ["SMTP_HOST", "SMTP_PORT", "SMTP_SECURE", "SMTP_USER", "SMTP_PASS", "SMTP_FROM", "SMTP_REPLY_TO", "OWNER_NOTIFICATION_EMAIL", "EMAIL_NOTIFICATIONS_ENABLED"];
  const previous = new Map(keys.map((key) => [key, process.env[key]]));
  Object.assign(process.env, {
    SMTP_HOST: "smtp.example.test", SMTP_PORT: "587", SMTP_SECURE: "false",
    SMTP_USER: "test", SMTP_PASS: "  synthetic\r\npassword  ", SMTP_FROM: "KROVEX <sender@example.test>",
    SMTP_REPLY_TO: "contact@example.test", OWNER_NOTIFICATION_EMAIL: "owner@example.test", EMAIL_NOTIFICATIONS_ENABLED: "false"
  });
  const mails: nodemailer.SendMailOptions[] = [];
  let options: unknown;
  const stub = mock.method(nodemailer, "createTransport", (config: unknown) => {
    options = config;
    return {
      async sendMail(message: nodemailer.SendMailOptions) {
        mails.push(message);
        return { accepted: [message.to], rejected: [] };
      }
    };
  });
  try {
    assert.equal((await sendCompanyInquiry(row())).status, "sent");
    assert.equal((await sendCustomerInquiry(row())).status, "sent");
    const config = options as { auth: { pass: string }; connectionTimeout: number; socketTimeout: number; requireTLS: boolean };
    assert.equal(config.auth.pass, "  synthetic\r\npassword  ");
    assert.equal(config.requireTLS, true);
    assert.ok(config.connectionTimeout > 0 && config.socketTimeout > 0);
    assert.equal(mails[0].to, "owner@example.test");
    assert.equal(mails[0].replyTo, input().email);
    assert.equal(mails[1].to, input().email);
    assert.equal(mails[1].replyTo, "contact@example.test");
    assert.ok(mails[1].html);
    assert.ok(mails[1].text);
    assert.equal((await sendEmail("x@example.test\r\nBcc: attacker@example.test", customerInquiryTemplate(row()))).status, "failed");
    process.env.SMTP_PORT = "587oops";
    assert.equal((await sendCompanyInquiry(row())).status, "failed");
    assert.equal(mails.length, 2);
  } finally {
    stub.mock.restore();
    for (const [key, value] of previous) { if (value === undefined) delete process.env[key]; else process.env[key] = value; }
  }
});
test("generated migration is isolated and additive", () => {
  const files = readdirSync("db/krovex-migrations").filter((file) => file.endsWith(".sql"));
  assert.equal(files.length, 1);
  const sql = readFileSync("db/krovex-migrations/" + files[0], "utf8");
  assert.match(sql, /CREATE TABLE .krovex_inquiries./);
  assert.match(sql, /UNIQUE.*submission_key/);
  assert.doesNotMatch(sql, /\b(DROP|TRUNCATE|DELETE|ALTER)\b/i);
  assert.doesNotMatch(sql, /stripe|payments|bookings|projects|leads/i);
});
