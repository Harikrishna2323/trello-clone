"use server";

import dbConnect from "@/lib/mongodb";
import Board from "@/models/Board";
import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoardSchema } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, image } = data;

  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
    image.split("|");

  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageLinkHTML ||
    !imageUserName
  )
    return {
      error: "Missing fields. Failed to create board",
    };

  let board;

  try {
    await dbConnect();
    board = await Board.create({
      title,
      orgId,
      imageId,
      imageThumbUrl,
      imageFullUrl,
      imageLinkHTML,
      imageUserName,
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
