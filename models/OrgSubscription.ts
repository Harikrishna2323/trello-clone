import mongoose from "mongoose";

const OrgSubscriptionSchema = new mongoose.Schema({
  orgId: {
    type: String,
    unique: true,
  },
  stripeCustomerId: {
    type: String,
    unique: true,
    alias: "stripe_customer_id",
  },
  stripeSubscriptionId: {
    type: String,
    unique: true,
    alias: "stripe_subscription_id",
  },
  stripePriceId: {
    type: String,
    alias: "stripe_price_id",
  },
  stripeCurrentPeriodEnd: {
    type: Date,
    alias: "stripe_current_period_end",
  },
});

const OrgSubscription =
  mongoose.models?.OrgSubscription ||
  mongoose.model("OrgSubscription", OrgSubscriptionSchema);

export default OrgSubscription;
