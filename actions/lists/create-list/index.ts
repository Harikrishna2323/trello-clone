"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import dbConnect from "@/lib/mongodb";
import List from "@/models/List";
import Board from "@/models/Board";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateListSchema } from "./schema";
import mongoose from "mongoose";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }
  const { title, boardId } = data;
  let list;

  try {
    const mongoClient: typeof mongoose = await dbConnect();

    const board = await Board.findById(boardId).where({ orgId });

    if (!board)
      return {
        error: "Board not found",
      };

    const lastList = await List.findOne({ boardId }).sort({
      order: "descending",
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    const session = await mongoClient.startSession();

    try {
      await session.withTransaction(async () => {
        // CREATE NEW LIST
        list = await List.create({
          title,
          boardId,
          board: boardId,
          order: newOrder,
        });

        if (list) {
          await createAuditLog({
            entityId: list._id,
            entityTitle: list.title,
            entityType: "LIST",
            action: "CREATE",
          });
        }
      });
    } catch (error) {
      await session.abortTransaction();
      return {
        error: "Transaaction error",
      };
    }
  } catch (error) {
    console.log({ error });
    return {
      error: "Failed to create list",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: list,
  };
};

export const createList = createSafeAction(CreateListSchema, handler);
