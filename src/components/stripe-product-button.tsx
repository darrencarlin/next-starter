"use client";

import {Button} from "@/components/ui/button";
import getStripe from "@/lib/stripe/client";
import {useState} from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {toast} from "@/hooks/use-toast";
import {createCheckoutSession} from "@/lib/stripe/actions";
import {getErrorMessage} from "@/lib/utils";
import {SimplifiedProduct} from "@/types";

interface Props {
  product: SimplifiedProduct;
}

export const StripeProductButton = ({product}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const {unit_amount, priceId, name, description, id} = product;

  const handleCheckout = async ({priceId}: {priceId: string}) => {
    setIsLoading(true);

    try {
      // Load Stripe.js (client-side)
      const stripe = await getStripe();

      if (!stripe) {
        throw new Error("Stripe hasn't been initialized");
      }

      // Create a Checkout Session.
      const {data} = await createCheckoutSession({priceId});

      if (!data?.sessionId) {
        throw new Error("Failed to create checkout session");
      }

      // Redirect to Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: getErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formattedPrice = unit_amount && (unit_amount / 100).toFixed(2);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full font-bold"
          key={id}
          type="button"
          onClick={() => handleCheckout({priceId: priceId})}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : `$${formattedPrice}/month`}
        </Button>
      </CardContent>
    </Card>
  );
};
