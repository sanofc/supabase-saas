import { Stripe } from "stripe";
import React from "react";
import Subscribe from "@/components/subscribe";

export default async function Pricing() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const { data: prices } = await stripe.prices.list();

  console.log(prices);
  const plans = await Promise.all(
    prices.map(async (price) => {
      const product = await stripe.products.retrieve(price.product as string);
      return {
        id: price.id,
        name: product.name,
        interval: price.recurring?.interval,
        price: price.unit_amount,
        currency: price.currency,
      };
    })
  );
  console.log(plans);

  const sortedPlans = plans.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  return (
    <div className="w-full max-w-3xl mx-auto py-16 flex justify-around">
      {sortedPlans.map((plan) => (
        <div key={plan.id} className="w-80 h-40 rounded shadow px-6 py-4">
          <h2>{plan.name}</h2>
          <p>
            {plan.price} {plan.currency} / {plan.interval}
          </p>
          <Subscribe planId={plan.id} />
        </div>
      ))}
    </div>
  );
}
