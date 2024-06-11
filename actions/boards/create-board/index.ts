"use server";

import dbConnect from "@/lib/mongodb";
import Board from "@/models/Board";
import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoardSchema } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title } = data;

  let board;

  try {
    await dbConnect();
    board = await Board.create({
      title,
    });
  } catch (error) {
    return {
      error: "Failed to create.",
    };
  }
  revalidatePath(`/board/${board?.id}`);
  // revalidatePath("/organization/org_2hdsNvvb7ADX8ADPp0EllkdZww0");
  return { data: board };
};

export const createBoard = createSafeAction(CreateBoardSchema, handler);
