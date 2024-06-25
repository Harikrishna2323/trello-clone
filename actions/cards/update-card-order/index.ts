"use server";

import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCardOrderSchema } from "./schema";
import { InputType, ReturnType } from "./types";
import { revalidatePath } from "next/cache";
import Card from "@/models/Card";
import dbConnect from "@/lib/mongodb";
import List from "@/models/List";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { cardId, items, boardId, destListId } = data;

  let updatedCards = [];
  await dbConnect();

  const session = await mongoose.startSession();

  session.startTransaction();
  try {
    // find card by id
    const card = await Card.findById(cardId).session(session);
    if (!card) throw new Error("Card not found");

    const oldListId = card.list;

    // Update the card's listId
    card.listId = destListId;
    card.list = destListId;
    await card.save({ session });

    let oldList;

    // Remove the card from the old list's cards array
    oldList = await List.findById(oldListId);
    if (oldList) {
      oldList.cards = oldList.cards.filter((id: any) => !id.equals(cardId));
      await oldList.save({ session });
    }

    // Remove the card from the old list's cards array manually

    // Add the card to the new list's cards array manually
    const newList = await List.findById(destListId);
    if (newList) {
      newList.cards.push(cardId);
      await newList.save({ session });
      console.log(
        `Added card ${cardId} to new List ${destListId}. Updated new list:`,
        newList
      );
    }

    /////// ORDER UPDATION START ///////////
    const promises = items.map(async (card) => {
      let query = {
        _id: card._id,
      };

      const foundCard = await Card.findByIdAndUpdate(
        query,
        { $set: { order: card.order, list: card.listId } },
        { session, new: true }
      );

      // remove the corresponding card from List.cards

      return foundCard;
    });

    updatedCards = await Promise.all(promises);

    /////// ORDER UPDATION END ///////////

    // if (updatedCards) {
    //   await createAuditLog({
    //     entityId: card._id,
    //     entityTitle: card.title,
    //     entityType: "CARD",
    //     action: "CREATE",
    //   });
    // }

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      error: "Failed to change list",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: updatedCards };
};

export const updateCardOrder = createSafeAction(UpdateCardOrderSchema, handler);
