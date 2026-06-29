import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function assertStripeConfig() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is required for checkout.");
  }
}

export function assertStripeWebhookConfig() {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET is required for Stripe webhooks.");
  }
}

export function getStripe() {
  if (stripeClient) return stripeClient;

  assertStripeConfig();
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is required for checkout.");
  }

  stripeClient = new Stripe(secretKey, {
    appInfo: {
      name: "Martis MV website",
      version: "0.1.0"
    }
  });

  return stripeClient;
}
