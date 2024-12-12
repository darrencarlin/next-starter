import {ManageSubscriptionButton} from "@/components/manage-subscription-button";
import {SubscriptionProductButtons} from "@/components/subscrption-products";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {auth} from "@/lib/auth";

import {getActiveSubscription} from "@/lib/stripe/actions";
import {redirect} from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/");
  }

  // Get the active subscription
  const {data: activeSubscription} = await getActiveSubscription(
    session?.user.stripePriceId,
  );

  // Check if the user has a subscription
  const hasSubscription =
    (session?.user?.subscriptionStatus !== null ||
      session?.user?.subscriptionStatus !== "") &&
    activeSubscription.name !== "";

  return (
    <div className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User</CardTitle>
        </CardHeader>
        <CardContent>
          <pre>
            <code>{JSON.stringify({session: session?.user}, null, 2)}</code>
          </pre>
        </CardContent>
      </Card>

      {hasSubscription && activeSubscription ? (
        <Card className="w-full">
          <CardHeader>
            <CardDescription>
              You have an active subscription. Thank you for your support!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ManageSubscriptionButton activeSubscription={activeSubscription} />
          </CardContent>
        </Card>
      ) : (
        <>
          {session?.user.emailVerified ? (
            <SubscriptionProductButtons />
          ) : (
            <p className="mb-4 w-fit border border-dashed p-4 text-lg">
              Please verify your email to access subscription products
            </p>
          )}
        </>
      )}
    </div>
  );
}
