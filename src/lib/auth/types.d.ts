import NextAuth, {type DefaultSession} from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      emailVerified: string;
      stripePriceId: string;
      stripeCustomerId: string;
      stripeSubscriptionId: string;
      subscriptionStatus: string;
      plan: string;
      createdAt: string;
      updatedAt: string;
    } & DefaultSession["user"];
  }
}
