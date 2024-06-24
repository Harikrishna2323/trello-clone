"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import dbConnect from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateListSchema } from "./schema";
import List from "@/models/List";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId)
    return {
      error: "Unauthorized",
    };

  const { id, title, boardId } = data;
  let list = await List.findById(id).populate("board");

  if (list.board.orgId !== orgId)
    return {
      error: "Unauthorized (Board)",
    };

  const query = {
    _id: id,
    boardId: boardId,
  };

  try {
    await dbConnect();
    list = await List.findOneAndUpdate(
      query,
      { $set: { title } },
      { new: true } // to return the updated document
    );

    if (list) {
      await createAuditLog({
        entityId: list._id,
        entityTitle: list.title,
        entityType: "LIST",
        action: "UPDATE",
      });
    }
  } catch (error) {
    console.log({ error });
    return {
      error: "Failed to update",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const updateList = createSafeAction(UpdateListSchema, handler);
