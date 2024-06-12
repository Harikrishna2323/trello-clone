"use server";
import dbConnect from "@/lib/mongodb";
import Board from "@/models/Board";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteBoardSchema } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  let board;
  const { id } = data;

  try {
    await dbConnect();
    board = await Board.findByIdAndDelete({ _id: id, orgId });
  } catch (error) {
    return {
      error: "Failed to delete.",
    };
  }
  revalidatePath(`/organization/${orgId}`);
  redirect(`/organization/${orgId}`);
  // return {
  //   data: board,
  // };
};

export const deleteBoard = createSafeAction(DeleteBoardSchema, handler);
