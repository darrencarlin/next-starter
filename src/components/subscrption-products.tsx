import {StripeProductButton} from "@/components/stripe-product-button";
import {getStripeSubscriptions} from "@/lib/stripe/actions";

export const NoSubsrciptionProduct = () => (
  <p className="mb-4 w-fit border border-dashed p-4 text-lg">
    No subscription products found
  </p>
);

export const SubscriptionProductButtons = async () => {
  // Fetch subscription products
  const {data: products} = await getStripeSubscriptions();

  if (!products) {
    return <NoSubsrciptionProduct />;
  }

  return (
    <div className="flex w-full gap-4">
      {products.map((product) => (
        <StripeProductButton product={product} key={product.id} />
      ))}
    </div>
  );
};
