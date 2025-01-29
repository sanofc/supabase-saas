import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";


export async function POST(req: NextRequest) {

  if(req.nextUrl.searchParams.get("API_ROUTE_SECRET") !== process.env.API_ROUTE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const { record } = body;

    console.log("Creating Stripe customer for:", record.email);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! );
    // Stripeカスタマーの作成
    const customer = await stripe.customers.create({
      email: record.email,
    });


    const supabase = await createClient();
    // SupabaseにStripeカスタマーIDを保存
    await supabase
      .from("profile")
      .update({ stripe_customer: customer.id })
      .eq("id", record.id);

    return NextResponse.json(
      { message: `Stripe customer created: ${customer.id}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}