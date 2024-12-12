"use server";

import {getErrorMessage} from "@/lib/utils";
import type {
  ActiveSubscription,
  CheckoutSessionID,
  CustomStatuses,
  ResponseType,
  SimplifiedProduct,
  StripeUserMetadata,
} from "@/types";

import {prisma} from "@/lib/db";
import type Stripe from "stripe";

import {stripe} from "./server";

/**
 * Fetches the subscription status from the Stripe event and returns a custom status.
 */
export const getSubscriptionStatus = async (
  event: Stripe.Event,
): Promise<CustomStatuses> => {
  switch (event.type) {
    case "checkout.session.completed":
      const {mode} = event.data.object;
      switch (mode) {
        case "subscription":
          return "active"; // Subscription created
        case "payment":
          return "lifetime"; // One-time payment for lifetime access
      }

    case "customer.subscription.deleted":
      const {status, cancel_at_period_end, current_period_end} = event.data
        .object as Stripe.Subscription;

      switch (status) {
        case "active":
          return "active"; // Subscription still active
        case "canceled":
          const cancelledButActive =
            cancel_at_period_end && current_period_end * 1000 > Date.now();
          if (cancelledButActive) {
            return "cancelled_but_active"; // Subscription cancelled but still active until period end
          }
          return ""; // Subscription cancelled and inactive
      }

    default:
      return "unknown";
  }
};

/**
 * Updates the user's Stripe subscription details in the database.
 */
export const updateStripeSubscription = async ({
  email,
  stripeCustomerId,
  stripeSubscriptionId,
  stripePriceId,
  subscriptionStatus,
  plan,
}: StripeUserMetadata): Promise<ResponseType> => {
  try {
    // ✅  Update the user's stripe subscription details in the database
    await prisma.user.update({
      where: {email},
      data: {
        stripeCustomerId,
        stripeSubscriptionId,
        stripePriceId,
        subscriptionStatus,
        plan,
      },
    });

    return {
      success: true,
      message: "Stripe subscription details updated successfully",
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

export const createCheckoutSession = async ({
  priceId,
}: {
  priceId: string;
}): Promise<ResponseType<CheckoutSessionID>> => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile`, // Redirect to profile page if user cancels
  });

  return {
    success: true,
    message: "Checkout session created successfully",
    data: {
      sessionId: session.id,
    },
  };
};

/**
 * Fetches the products and prices from Stripe.
 */
export const getProductsAndPrices = async () => {
  const [products, prices] = await Promise.all([
    stripe.products.list({active: true}),
    stripe.prices.list({active: true}),
  ]);
  return {products, prices};
};

/**
 * Fetches the simplified subscription products from Stripe.
 */
export const getStripeSubscriptions = async (): Promise<
  ResponseType<SimplifiedProduct[]>
> => {
  try {
    const {products, prices} = await getProductsAndPrices();

    const productPrices = new Map(
      prices.data.map((price) => [
        typeof price.product === "string" ? price.product : price.product.id,
        price,
      ]),
    );

    const simplifiedProducts: SimplifiedProduct[] = products.data
      .map((product) => {
        const price = productPrices.get(product.id);
        if (price && price.unit_amount != null) {
          return {
            priceId: price.id,
            unit_amount: price.unit_amount,
            name: product.name,
            description: product.description,
            id: product.id,
          };
        }
        return null;
      })
      .filter((item): item is SimplifiedProduct => item !== null)
      .sort((a, b) => a.unit_amount - b.unit_amount);

    return {
      success: true,
      message: "Fetched and sorted simplified products successfully",
      data: simplifiedProducts,
    };
  } catch (error) {
    console.error("Error fetching and sorting products:", error);
    return {
      success: false,
      message: getErrorMessage(error),
      data: [],
    };
  }
};

/**
 *  Fetches the active subscription details for the current user from Stripe.
 */
export const getActiveSubscription = async (
  priceId: string,
): Promise<ResponseType<ActiveSubscription>> => {
  if (!priceId) {
    return {
      success: false,
      data: {name: ""},
      message: "No active subscription found",
    };
  }

  try {
    const price = await stripe.prices.retrieve(priceId);
    const product = await stripe.products.retrieve(price.product as string);

    const name = product.name;

    return {
      success: true,
      message: "Fetched active subscription successfully",
      data: {
        name,
      },
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      data: {name: ""},
      success: false,
      message: getErrorMessage(error),
    };
  }
};
