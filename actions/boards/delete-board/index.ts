"use server";
import dbConnect from "@/lib/mongodb";
import Board from "@/models/Board";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteBoardSchema } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { decreaseAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const isPro = await checkSubscription();

  let board;
  const { id } = data;

  try {
    await dbConnect();
    board = await Board.findByIdAndDelete({ _id: id, orgId });

    if (board) {
      if (!isPro) await decreaseAvailableCount();
      await createAuditLog({
        entityId: board._id,
        entityTitle: board.title,
        entityType: "BOARD",
        action: "DELETE",
      });
    }
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
