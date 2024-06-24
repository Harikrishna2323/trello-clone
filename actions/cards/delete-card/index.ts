"use server";

import { auth } from "@clerk/nextjs/server";

import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteCardSchema } from "./schema";
import { InputType, ReturnType } from "./types";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
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
  let card;

  try {
    await dbConnect();

    card = await Card.findByIdAndDelete(id);

    if (card) {
      await createAuditLog({
        entityId: card._id,
        entityTitle: card.title,
        entityType: "CARD",
        action: "DELETE",
      });
    }
  } catch (error) {
    console.log({ error });
    return {
      error: "Failed to delete",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: JSON.parse(JSON.stringify(card)) };
};

export const deleteCard = createSafeAction(DeleteCardSchema, handler);
