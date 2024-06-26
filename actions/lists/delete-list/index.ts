"use server";
import dbConnect from "@/lib/mongodb";
import List from "@/models/List";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteListSchema } from "./schema";
import mongoose from "mongoose";
import Card from "@/models/Card";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;

  let list;

  await dbConnect();

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    list = await List.findById(id)
      .populate({ path: "board", select: "orgId" })
      .populate({ path: "cards", select: "_id" })
      .select("board");

    if (!list) {
      await session.abortTransaction();
      session.endSession();
      return {
        error: "Transaction Error - Failed",
      };
    }

    if (list.board.orgId !== orgId)
      return {
        error: "Unauthorized (Board)",
      };

    // DELETE associated Cards
    await Card.deleteMany({ _id: { $in: list.cards } }).session(session);
    //?????????????? LOG FOR EACH DELETED CARD ???????????????
    // Delete the list
    list = await List.findByIdAndDelete({ _id: id, boardId }).session(session);

    if (list) {
      await createAuditLog({
        entityId: list._id,
        entityTitle: list.title,
        entityType: "LIST",
        action: "DELETE",
      });
    }
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      error: "Failed to delete.",
    };
  }
  revalidatePath(`/board/${boardId}`);

  return { data: list };
};

export const deleteList = createSafeAction(DeleteListSchema, handler);
