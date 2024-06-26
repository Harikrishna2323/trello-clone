import { auth } from "@clerk/nextjs/server";

import dbConnect from "./mongodb";
import OrgSubscription from "@/models/OrgSubscription";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  const { orgId } = auth();

  console.log("Check for isPro");

  let orgSubscription;

  if (!orgId) {
    return false;
  }

  try {
    await dbConnect();
    orgSubscription = await OrgSubscription.findOne({ orgId });
  } catch (error) {
    throw new Error("Interbal server error");
  }

  if (!orgSubscription) {
    return false;
  }

  const isValid =
    orgSubscription.stripePriceId &&
    orgSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

  return !!isValid;
};
