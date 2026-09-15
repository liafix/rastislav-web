import "server-only";
import { isSameOrigin } from "../request-origin";
import { InquiryRequestError, parseInquiry } from "./validation";
export const MAX_INQUIRY_BYTES = 16 * 1024;

export async function readInquiryRequest(request: Request) {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    throw new InquiryRequestError(415, "unsupported_media_type", "Odošlite údaje ako JSON.");
  }
  const origin = request.headers.get("origin");
  if (origin && !isSameOrigin(request)) {
    throw new InquiryRequestError(403, "invalid_origin", "Požiadavka nepochádza z tohto webu.");
  }
  const declaredLength = request.headers.get("content-length");
  if (declaredLength && Number(declaredLength) > MAX_INQUIRY_BYTES) {
    throw new InquiryRequestError(413, "payload_too_large", "Požiadavka je príliš veľká.");
  }
  const reader = request.body?.getReader();
  if (!reader) throw new InquiryRequestError(400, "invalid_json", "Požiadavka neobsahuje platný JSON.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_INQUIRY_BYTES) {
        await reader.cancel();
        throw new InquiryRequestError(413, "payload_too_large", "Požiadavka je príliš veľká.");
      }
      chunks.push(value);
    }
  } catch (error) {
    if (error instanceof InquiryRequestError) throw error;
    throw new InquiryRequestError(400, "invalid_json", "Požiadavku sa nepodarilo prečítať.");
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  let body: unknown;
  try { body = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
  catch { throw new InquiryRequestError(400, "invalid_json", "Požiadavka neobsahuje platný JSON."); }
  return parseInquiry(body);
}
