"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import dbConnect from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import Card from "@/models/Card";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyCardSchema } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;

  let card;

  try {
    await dbConnect();

    // Find card to copy
    const cardToCopy = await Card.findById(id).populate("list");

    if (!cardToCopy) return { error: "Card not found" };

    const lastCard = await Card.findOne({ list: cardToCopy.list })
      .sort({
        order: "desc",
      })
      .select("order");

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    card = await Card.create({
      title: `${cardToCopy.title} - Copy`,
      description: cardToCopy.description,
      order: newOrder as number,
      listId: cardToCopy.listId,
      list: cardToCopy.list,
    });

    if (card) {
      await createAuditLog({
        entityId: card._id,
        entityTitle: card.title,
        entityType: "CARD",
        action: "CREATE",
      });
    }
  } catch (error) {
    return {
      error: "Failed to copy card",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: JSON.parse(JSON.stringify(card)) };
};

export const copyCard = createSafeAction(CopyCardSchema, handler);
