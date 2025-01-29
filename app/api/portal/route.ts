import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(
  req: NextRequest
) {
  console.log("subscription");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);
  console.log(user?.id);
  if (!user) {
    return NextResponse.json({ message: `User not found` });
  }

  const { data } = await supabase
    .from("profile")
    .select("stripe_customer")
    .eq("id", user.id)
    .single();
  const stripe_customer = data?.stripe_customer;

  console.log({
    ...user,
    stripe_customer,
  });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const session = await stripe.billingPortal.sessions.create({
    customer: stripe_customer,
    return_url: `${process.env.CLIENT_URL}/dashboard`,
  })

  return NextResponse.json({ url: session.url });
}