"use client";

import { useUser } from "@/context/user";
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";

export default function Subscribe({ planId }: { planId: string }) {
  const { user, login, isLoading } = useUser();

  const showSubscribeButton = !!user && !user.is_subscribed;
  const showCreateAccountButton = !user;
  const showManagedSubscriptionButton = !!user && user.is_subscribed;

  const processSubscription = (planId: string) => async (): Promise<void> => {
    console.log("Processing subscription", planId);
    const response = await fetch(`/api/subscription/${planId}`);
    const data = await response.json();
    console.log(data);
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
    if (stripe) {
      await stripe.redirectToCheckout({ sessionId: data.id });
    } else {
      console.error("Stripe failed to load");
    }
  };

  return (
    <div>
      {!isLoading && (
        <div>
          {showSubscribeButton && (
            <button onClick={processSubscription(planId)}>Subscribe</button>
          )}
          {showCreateAccountButton && (
            <button onClick={login}>Create Account</button>
          )}
          {showManagedSubscriptionButton && (
            <Link href="/dashboard">Manage Subscription</Link>
          )}
        </div>
      )}
    </div>
  );
}
