"use server";

import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { UpdateListOrderSchema } from "./schema";
import dbConnect from "@/lib/mongodb";
import List from "@/models/List";
import { revalidatePath } from "next/cache";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { boardId, items } = data;

  let lists = [];

  await dbConnect();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const promises = items.map(async (list) => {
      let query = {
        _id: list._id,
        boardId,
      };
      return await List.findByIdAndUpdate(
        query,
        { $set: { order: list.order } },
        { new: true }
      );
    });

    lists = await Promise.all(promises);

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      error: "Failed to change list",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: lists };
};

export const updateListOrder = createSafeAction(UpdateListOrderSchema, handler);
