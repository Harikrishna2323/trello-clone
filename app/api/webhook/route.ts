import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { stripe } from "@/lib/stripe";
import OrgSubscription from "@/models/OrgSubscription";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return new NextResponse("Webhoook Error !", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.orgId) {
      return new NextResponse("Org ID is required", { status: 400 });
    }
    try {
      await dbConnect();

      await OrgSubscription.create({
        orgId: session?.metadata?.orgId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      });
    } catch (error) {
      return new NextResponse("Internal server error", { status: 500 });
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    try {
      await dbConnect();
      const oldSubscription = await OrgSubscription.findOne({
        stripeSubscriptionId: subscription.id,
      });

      if (oldSubscription) {
        await OrgSubscription.findByIdAndUpdate(
          oldSubscription._id,
          {
            $set: {
              stripePriceId: subscription.items.data[0].price.id,
              stripeCurrentperiodEnd: subscription.current_period_end * 1000,
            },
          }
          //   { new: true }
        );
      }
    } catch (error) {
      return new NextResponse("Internal server error", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
