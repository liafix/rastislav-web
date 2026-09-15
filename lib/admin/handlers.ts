import "server-only";
import { requestToken, sessionCookie } from "./auth";
import { isSameOrigin } from "../request-origin";
export type AdminDependencies = {
  password: (value: string) => boolean | Promise<boolean>;
  sign: () => string;
  verify: (token: string | undefined) => boolean;
  complete: (id: number) => Promise<boolean>;
  production?: boolean;
};
export function positiveId(value: string | undefined) {
  if (typeof value !== "string" || !value || !/^[1-9]\d{0,14}$/.test(value)) return undefined;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : undefined;
}
const json = (body: object, status = 200, cookie?: string) => Response.json(body, { status, headers: { "Cache-Control": "no-store", ...(cookie ? { "Set-Cookie": cookie } : {}) } });
const sameOrigin = isSameOrigin;
export function createAdminHandlers(deps: AdminDependencies) {
  return {
    async login(request: Request) {
      if (!sameOrigin(request)) return json({ error: "Prístup zamietnutý." }, 403);
      if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") return json({ error: "Neplatná požiadavka." }, 415);
      try {
        const reader = request.body?.getReader();
        if (!reader) return json({ error: "Neplatná požiadavka." }, 400);
        const chunks: Uint8Array[] = []; let size = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > 2048) { await reader.cancel(); return json({ error: "Príliš veľká požiadavka." }, 413); }
          chunks.push(value);
        }
        let body;
        try { body = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks))); }
        catch { return json({ error: "Neplatná požiadavka." }, 400); }
        if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).length !== 1 || typeof body.password !== "string" || Buffer.byteLength(body.password) > 1024) return json({ error: "Neplatná požiadavka." }, 400);
        if (!await deps.password(body.password)) return json({ error: "Nesprávne heslo." }, 401);
        return json({ ok: true }, 200, sessionCookie(deps.sign(), deps.production));
      } catch { return json({ error: "Prihlásenie teraz nie je dostupné." }, 503); }
    },
    async logout(request: Request) {
      if (!sameOrigin(request)) return json({ error: "Prístup zamietnutý." }, 403);
      return json({ ok: true }, 200, sessionCookie("", deps.production));
    },
    async complete(request: Request, value: string) {
      if (!sameOrigin(request)) return json({ error: "Prístup zamietnutý." }, 403);
      try {
        if (!deps.verify(requestToken(request))) return json({ error: "Prihláste sa." }, 401);
        const id = positiveId(value);
        if (!id) return json({ error: "Neplatný dopyt." }, 400);
        if (!await deps.complete(id)) return json({ error: "Dopyt sa nenašiel." }, 404);
        return json({ ok: true });
      } catch { return json({ error: "Zmenu sa nepodarilo uložiť." }, 503); }
    }
  };
}
