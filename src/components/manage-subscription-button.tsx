"use client";

import {Button} from "@/components/ui/button";
import {ActiveSubscription, SimplifiedProduct} from "@/types";
import {useRouter} from "next/navigation";

interface Props {
  activeSubscription: ActiveSubscription;
}

export const ManageSubscriptionButton = ({activeSubscription}: Props) => {
  const router = useRouter();

  // Redirect to the Stripe billing portal
  const manageSubscription = async () => {
    router.push("https://billing.stripe.com/p/login/test_4gw1744Do7gk1BC5kk");
  };

  // If the user does not have an active subscription, return null
  if (!activeSubscription) {
    return null;
  }

  return (
    <Button variant="outline" type="button" onClick={manageSubscription}>
      Manage {activeSubscription.name} Subscription
    </Button>
  );
};
