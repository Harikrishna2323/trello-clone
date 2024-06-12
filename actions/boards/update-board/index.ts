"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import Board from "@/models/Board";
import dbConnect from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateBoardSchema } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId)
    return {
      error: "Unauthorized",
    };

  const { id, title } = data;

  const query = { _id: id, orgId: orgId };

  let board;
  try {
    await dbConnect();
    board = await Board.findOneAndUpdate(
      query,
      { $set: { title } },
      { new: true } // to return the updated document
    );
  } catch (error) {
    return {
      error: "Failed to update",
    };
  }

  revalidatePath(`/board/${id}`);
  return { data: board };
};

export const updateBoard = createSafeAction(UpdateBoardSchema, handler);
