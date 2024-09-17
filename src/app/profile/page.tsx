import {ManageSubscriptionButton} from "@/components/manage-subscription-button";
import {SubscriptionProductButtons} from "@/components/subscrption-products";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {validateRequest} from "@/lib/auth/actions";
import {getActiveSubscription} from "@/lib/stripe/actions";
import {redirect} from "next/navigation";

export default async function ProfilePage() {
  const {user, session} = await validateRequest();

  if (!user) {
    return redirect("/");
  }

  // Get the active subscription
  const {data: activeSubscription} = await getActiveSubscription(
    user.stripePriceId,
  );

  // Check if the user has a subscription
  const hasSubscription = user?.subscriptionStatus !== "";

  return (
    <div className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User</CardTitle>
          <CardDescription>Currently Logged In User</CardDescription>
        </CardHeader>
        <CardContent>
          <pre>
            <code>{JSON.stringify({user, session}, null, 2)}</code>
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
          {user.verified ? (
            <SubscriptionProductButtons />
          ) : (
            <p className="mb-4 w-fit rounded border border-dashed p-4 text-lg">
              Please verify your email to access subscription products
            </p>
          )}
        </>
      )}
    </div>
  );
}
