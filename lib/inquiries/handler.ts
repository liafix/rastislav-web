import "server-only";
import { readInquiryRequest } from "./request";
import { submitInquiry, type InquiryDependencies } from "./service";
import { InquiryRequestError } from "./validation";

export function createInquiryHandler(deps: InquiryDependencies) {
  return async (request: Request): Promise<Response> => {
    const headers = { "Cache-Control": "no-store" };
    try {
      const input = await readInquiryRequest(request);
      const result = await submitInquiry(input, deps);
      return Response.json(result, { status: result.duplicate ? 200 : 201, headers });
    } catch (error) {
      if (error instanceof InquiryRequestError) {
        return Response.json({ ok: false, code: error.code, error: error.message, fieldErrors: error.fieldErrors }, { status: error.status, headers });
      }
      deps.log("inquiry_storage_failed", {});
      return Response.json({ ok: false, code: "service_unavailable", error: "Dopyt sa nepodarilo potvrdiť. Skúste odoslanie znova; rovnaký dopyt sa neuloží dvakrát." }, { status: 503, headers });
    }
  };
}
