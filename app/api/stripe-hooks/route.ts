import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  console.log("Stripe Event Received");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  const rawBody = await req.text();

  let event;
  
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, signingSecret);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  console.log({ event });

  const supabase = await createAdminClient();

  switch(event.type) {
    case "customer.subscription.updated":
      console.log("Subscription Updated");
      console.log(event.data.object.customer);
      console.log(event.data.object.items.data[0].plan.interval);
      await supabase
        .from("profile")
        .update({
          is_subscribed: true,
          interval: event.data.object.items.data[0].plan.interval,
        })
        .eq("stripe_customer", event.data.object.customer)
    break;
    case "customer.subscription.deleted":
      console.log("Subscription Deleted");
      console.log(event.data.object.customer);
      console.log(event.data.object.items.data[0].plan.interval);
      await supabase
        .from("profile")
        .update({
          is_subscribed: false,
          interval: null,
        })
        .eq("stripe_customer", event.data.object.customer)
    break;
      }
  console.log(JSON.stringify(event, null, 2));

  return NextResponse.json({ received: true });
}
