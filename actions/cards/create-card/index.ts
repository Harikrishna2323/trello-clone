"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { CreateCardSchema } from "./schema";
import List from "@/models/List";
import Card from "@/models/Card";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, boardId, listId } = data;
  let card;

  try {
    await dbConnect();

    const list = await List.findOne({ _id: listId, board: boardId });
    if (!list) {
      return {
        error: "List not found",
      };
    }

    const lastCard = await Card.findOne({ listId })
      .sort({ order: "desc" })
      .select("order");

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    card = await Card.create({
      title,
      listId,
      list: listId,
      order: newOrder,
    });
  } catch (error) {
    return {
      error: "Failed to create",
    };
  }

  revalidatePath(`/board/${boardId}`);

  return { data: card };
};

export const createCard = createSafeAction(CreateCardSchema, handler);
