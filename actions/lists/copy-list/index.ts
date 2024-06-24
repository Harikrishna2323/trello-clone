"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { CopyListSchema } from "./schema";
import { auth, getAuth } from "@clerk/nextjs/server";
import List from "@/models/List";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import { CardType, ListType } from "@/types";
import Card from "@/models/Card";
import { revalidatePath } from "next/cache";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  console.log({ userId, orgId });

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;
  let list: ListType;

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
        let newCards: any = [];
        // create cards-copy for each card in lists
        if (listToCopy?.cards?.length > 0) {
          listToCopy.cards.forEach(async (card: CardType) => {
            let cardCopy: CardType;
            cardCopy = await Card.create({
              title: card.title,
              order: card.order,
              description: card.description,
              listId: list._id,
              list: list._id,
            });

            if (cardCopy) newCards.push(cardCopy._id);
          });
        }

        //CREATE NEW LIST
        list = await List.create({
          boardId: listToCopy.boardId,
          board: listToCopy.board,
          title: `${listToCopy.title} - Copy`,
          order: newOrder,
          cards: newCards,
        });

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
  return { data: JSON.parse(JSON.stringify(list)) };
};

export const copyList = createSafeAction(CopyListSchema, handler);
