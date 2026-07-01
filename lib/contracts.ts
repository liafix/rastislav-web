export const SCENE_STAGES = [
  "hero",
  "value",
  "craft",
  "services",
  "index",
  "proof",
  "booking",
  "footer"
] as const;

export type SceneStage = (typeof SCENE_STAGES)[number];

export const MODEL_KEYS = [
  "chair",
  "nightstand",
  "coffeeTable",
  "sideTable",
  "ducato"
] as const;

export type ModelKey = (typeof MODEL_KEYS)[number];

export const PAYMENT_TYPES = ["reservation_fee", "consultation_fee"] as const;

export type PaymentType = (typeof PAYMENT_TYPES)[number];

export const DEFERRED_PAYMENT_TYPES = ["project_deposit", "stage_payment"] as const;

export type DeferredPaymentType = (typeof DEFERRED_PAYMENT_TYPES)[number];

export const SERVICE_SLUGS = [
  "obklady",
  "dlazby",
  "omietky",
  "podlahy",
  "sanita",
  "dvere-zarubne-kovania",
  "sadrokarton",
  "rekonstrukcie-interieru"
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const ANALYTICS_EVENTS = [
  "phone_click",
  "whatsapp_click",
  "form_start",
  "form_submit",
  "booking_start",
  "booking_submit",
  "checkout_started",
  "payment_success",
  "payment_cancelled",
  "service_cta_click",
  "reference_view",
  "scroll_depth",
  "reduced_motion_fallback_used",
  "webgl_fallback_used"
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

export const ATTRIBUTION_FIELDS = [
  "landing_page",
  "referrer",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content"
] as const;

export type AttributionField = (typeof ATTRIBUTION_FIELDS)[number];

export type AttributionPayload = Partial<Record<AttributionField, string>>;

export type SceneDomDataset = {
  sceneStage: SceneStage;
  sceneModel?: ModelKey;
  sceneIntensity?: "rest" | "low" | "medium" | "high";
};

export type SceneState = {
  stage: SceneStage;
  progress: number;
  activeModel: ModelKey | null;
  reducedMotion: boolean;
  webglEnabled: boolean;
};

export type ServiceContentContract = {
  slug: ServiceSlug;
  label: string;
  h1: string;
  intro: string;
  localities: readonly string[];
  primaryCta: string;
  metaTitle?: string;
  metaDescription?: string;
  benefits?: readonly string[];
  processSteps?: readonly string[];
  faq?: readonly {
    question: string;
    answer: string;
  }[];
  paymentType?: PaymentType;
};

export type CheckoutMetadataContract = AttributionPayload & {
  leadId: string;
  bookingId?: string;
  paymentType: PaymentType;
  service: ServiceSlug;
  source: "website";
};

export type AnalyticsEventContract = AttributionPayload & {
  event: AnalyticsEventName;
  service?: ServiceSlug;
  stage?: SceneStage;
  paymentType?: PaymentType;
  valueCents?: number;
};

export const SCENE_STAGE_MODEL_MAP = {
  hero: null,
  value: null,
  craft: null,
  services: null,
  index: null,
  proof: null,
  booking: null,
  footer: "ducato"
} satisfies Record<SceneStage, ModelKey | null>;

export const SCENE_STAGE_INTENSITY_MAP = {
  hero: "high",
  value: "rest",
  craft: "medium",
  services: "high",
  index: "rest",
  proof: "medium",
  booking: "medium",
  footer: "rest"
} satisfies Record<SceneStage, NonNullable<SceneDomDataset["sceneIntensity"]>>;

export const SCENE_DOM_ATTRIBUTES = {
  stage: "data-scene-stage",
  model: "data-scene-model",
  intensity: "data-scene-intensity"
} as const;

export function isSceneStage(value: string): value is SceneStage {
  return SCENE_STAGES.includes(value as SceneStage);
}

export function isModelKey(value: string): value is ModelKey {
  return MODEL_KEYS.includes(value as ModelKey);
}

export function isPaymentType(value: string): value is PaymentType {
  return PAYMENT_TYPES.includes(value as PaymentType);
}

export function isServiceSlug(value: string): value is ServiceSlug {
  return SERVICE_SLUGS.includes(value as ServiceSlug);
}
