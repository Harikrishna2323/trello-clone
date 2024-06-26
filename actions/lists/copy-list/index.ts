"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { CopyListSchema } from "./schema";
import { auth } from "@clerk/nextjs/server";
import List from "@/models/List";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import { CardType, ListType } from "@/types";
import Card from "@/models/Card";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;
  let newList: ListType = {
    _id: id,
    title: "",
    boardId,
    order: 0,
    cards: [],
  };

  let updatedList;

  try {
    const mongoClient: typeof mongoose = await dbConnect();
    const listToCopy = await List.findById(id).populate("cards");

    if (!listToCopy)
      return {
        error: "List not found",
      };

    const lastList = await List.findOne({ boardId })
      .sort({ order: "desc" })
      .select("order");

    const newOrder = lastList ? lastList.order + 1 : 1;

    // start transaction
    const session = await mongoClient.startSession();

    try {
      await session.withTransaction(async () => {
        //CREATE NEW LIST
        newList = await List.create({
          boardId: listToCopy.boardId,
          board: listToCopy.board,
          title: `${listToCopy.title} - Copy`,
          order: newOrder,
          // cards: newCards,
        });
        // create cards-copy for each card in lists

        let newCards: any = [];
        let cardCopy;
        if (listToCopy?.cards?.length > 0) {
          listToCopy.cards.forEach(async (card: CardType) => {
            cardCopy = await Card.create({
              title: card.title,
              order: card.order,
              description: card.description,
              listId: newList._id,
              list: newList,
            });

            if (cardCopy) newCards.push(cardCopy);
          });
        }

        // UPDATE THE NEWLY CREATED LIST's CARDS
        let updatedList = await List.findByIdAndUpdate(
          newList._id,
          { $set: { cards: newCards } },
          { new: true }
        );

        if (updatedList) {
          await createAuditLog({
            entityId: newList._id,
            entityTitle: newList.title,
            entityType: "LIST",
            action: "CREATE",
          });
        }

        await session.commitTransaction();
        session.endSession();
      });
    } catch (error) {
      await session.abortTransaction();
      return {
        error: "Transaction error",
      };
    }
  } catch (error) {
    return {
      error: "Failed to copy ",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: JSON.parse(JSON.stringify(updatedList)) };
};

export const copyList = createSafeAction(CopyListSchema, handler);
