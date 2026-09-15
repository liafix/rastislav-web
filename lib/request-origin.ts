import "server-only";
// Next may construct request.url using its internal hostname. Host is the
// browser's request target; do not accept a caller-supplied forwarded host.
export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const target = new URL(request.url);
    const host = request.headers.get("host") ?? target.host;
    const expected = new URL(target.protocol + "//" + host);
    return expected.host === host && origin === expected.origin;
  } catch { return false; }
}
