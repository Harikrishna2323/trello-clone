"use server";

import { auth } from "@clerk/nextjs/server";

import Card from "@/models/Card";
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { UpdateCardSchema } from "./schema";
import dbConnect from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId, ...values } = data;

  // console.log({ data });
  let card;

  try {
    await dbConnect();
    let query = {
      _id: id,
    };
    card = await Card.findByIdAndUpdate(
      query,
      { $set: { title: values.title, description: values.description } },
      { new: true }
    );

    if (card) {
      await createAuditLog({
        entityId: card._id,
        entityTitle: card.title,
        entityType: "CARD",
        action: "UPDATE",
      });
    }
  } catch (error) {
    return {
      error: "Failed to update",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: JSON.parse(JSON.stringify(card)) };
};

export const updateCard = createSafeAction(UpdateCardSchema, handler);
