import {CustomStatuses} from "@/types";
import {Lucia} from "lucia";
import adapter from "./adapter";

export const lucia = new Lucia(adapter, {
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      email: attributes.email,
      stripePriceId: attributes.stripePriceId,
      stripeCustomerId: attributes.stripeCustomerId,
      stripeSubscriptionId: attributes.stripeSubscriptionId,
      subscriptionStatus: attributes.subscriptionStatus,
      plan: attributes.plan,
      verified: attributes.verified,
      createdAt: attributes.createdAt,
      updatedAt: attributes.updatedAt,
    };
  },
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

interface DatabaseUserAttributes {
  id: string;
  email: string;
  stripePriceId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  subscriptionStatus: CustomStatuses;
  plan: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
