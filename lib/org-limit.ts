import { auth } from "@clerk/nextjs/server";

import { MAX_FREE_BOARDS } from "@/constants/boards";
import dbConnect from "./mongodb";
import OrgLimit from "@/models/OrgLimit";

export const incrementAvailableCount = async () => {
  const { orgId } = auth();

  if (!orgId) throw new Error("Unauthorized");

  try {
    await dbConnect();

    const orgLimit = await OrgLimit.findOne({ orgId });

    if (orgLimit) {
      const newCount = orgLimit.count + 1;

      await OrgLimit.findByIdAndUpdate(
        orgLimit._id,
        { $set: { count: newCount } },
        { new: true }
      );
    } else {
      await OrgLimit.create({
        orgId,
        count: 1,
      });
    }
  } catch (error) {
    return { error };
  }
};

export const decreaseAvailableCount = async () => {
  const { orgId } = auth();

  if (!orgId) throw new Error("Unauthorized");

  try {
    await dbConnect();

    const orgLimit = await OrgLimit.findOne({ orgId });

    if (orgLimit) {
      await OrgLimit.findByIdAndUpdate(
        orgLimit._id,
        { $set: { count: orgLimit.count > 0 ? orgLimit.count - 1 : 0 } },
        { new: true }
      );
    } else {
      await OrgLimit.create({
        orgId,
        count: 1,
      });
    }
  } catch (error) {
    return { error };
  }
};

export const hasAvailableCount = async () => {
  const { orgId } = auth();

  if (!orgId) throw new Error("Unauthorized");

  const orgLimit = await OrgLimit.findOne({ orgId });

  if (!orgLimit || orgLimit.count < MAX_FREE_BOARDS) {
    return true;
  } else {
    return false;
  }
};

export const getAvailableCount = async () => {
  const { orgId } = auth();

  if (!orgId) throw new Error("Unauthorized");

  const orgLimit = await OrgLimit.findOne({ orgId });

  if (!orgLimit) return 0;

  return orgLimit.count;
};
