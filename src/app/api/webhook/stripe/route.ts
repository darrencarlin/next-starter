import {
  getSubscriptionStatus,
  updateStripeSubscription,
} from "@/lib/stripe/actions";
import {stripe} from "@/lib/stripe/server";
import {getErrorMessage} from "@/lib/utils";
import {CustomStatuses} from "@/types";
import {headers} from "next/headers";
import {NextResponse} from "next/server";
import Stripe from "stripe";

export const POST = async (req: Request) => {
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      {message: "Webhook Error: Missing signature"},
      {status: 400},
    );
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Error verifying webhook signature:", err);
    return NextResponse.json(
      {message: "Webhook Error: Invalid signature"},
      {status: 400},
    );
  }

  const subscriptionStatus = await getSubscriptionStatus(event);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event, subscriptionStatus);
        break;

      case "customer.subscription.deleted":
        await handleCustomerSubscriptionDeleted(event);
        break;

      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }
  } catch (error: unknown) {
    console.error(`Error processing ${event.type}:`, error);
    return NextResponse.json(
      {success: false, message: getErrorMessage(error)},
      {status: 500},
    );
  }

  return NextResponse.json({success: true});
};

const handleCheckoutSessionCompleted = async (
  event: Stripe.Event,
  subscriptionStatus: CustomStatuses,
) => {
  const session = event.data.object as Stripe.Checkout.Session;
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ["data.price.product"],
  });

  const email = session.customer_details?.email;
  const stripeCustomerId = session.customer as string;
  const stripePriceId = lineItems.data[0]?.price?.id;
  const stripeSubscriptionId = session.subscription as string;
  const planName = (lineItems.data[0]?.price?.product as Stripe.Product)?.name;

  if (!email || !stripePriceId || !planName) {
    throw new Error("Missing required session data");
  }

  await updateStripeSubscription({
    email,
    stripeCustomerId,
    stripeSubscriptionId,
    stripePriceId,
    subscriptionStatus,
    plan: planName,
  });
};

const handleCustomerSubscriptionDeleted = async (event: Stripe.Event) => {
  const subscription = event.data.object as Stripe.Subscription;
  const customer = await stripe.customers.retrieve(
    subscription.customer as string,
  );

  if (!customer || customer.deleted) {
    throw new Error("Customer not found or deleted");
  }

  const email = customer.email;
  if (!email) {
    throw new Error("Customer email not found");
  }

  await updateStripeSubscription({
    email,
    stripeCustomerId: customer.id,
    stripeSubscriptionId: "",
    subscriptionStatus: "",
    stripePriceId: "",
    plan: "",
  });
};
