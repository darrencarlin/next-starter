import Stripe from "stripe";
import {z} from "zod";

export const fileUploadSchema = z.object({
  file: z.any(),
});

// Stripe Types
export interface Product {
  product: Stripe.Product;
  price: Stripe.Price;
}

export interface Products {
  products: Stripe.Product;
  prices: Stripe.Price;
}

export interface SimplifiedProduct {
  priceId: string;
  unit_amount: number;
  name: string;
  description: string;
  id: string;
}

export interface ActiveSubscription {
  name: string;
}

export interface StripeUserMetadata {
  email: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  subscriptionStatus: CustomStatuses;
  plan: string;
}

export interface CheckoutSessionID {
  sessionId: string;
}

export type CustomStatuses =
  | "lifetime" // Special status for lifetime access
  | "active" // Active subscription
  | "cancelled_but_active" // Subscription cancelled but still active
  | "" // No subscription
  | "unknown"; // Unknown status

export type ResponseWithMetadata = {
  success: boolean;
  message: string;
};

export interface ResponseWithData<T> extends ResponseWithMetadata {
  data: T;
}

export type ResponseType<T = void> = T extends void
  ? ResponseWithMetadata
  : ResponseWithData<T>;
