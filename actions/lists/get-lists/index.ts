"use server";

import dbConnect from "@/lib/mongodb";
import Board from "@/models/Board";
import List from "@/models/List";
import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { GetListsSchema } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { boardId } = data;

  let lists;

  try {
    await dbConnect();
    lists = await List.aggregate([
      // Match lists with the specified boardId
      { $match: { boardId: boardId } },

      // sort by order field
      { $sort: { order: 1 } },
      // Lookup to populate the board field
      {
        $lookup: {
          from: "boards", // Name of the board collection
          localField: "board", // Field in the lists collection
          foreignField: "_id", // Field in the board collection
          as: "board", // Alias for the output array
        },
      },
      // Unwind the board array (since it's expected to have only one board)
      { $unwind: "$board" },

      // Lookup to populate the cards field
      {
        $lookup: {
          from: "cards", // Name of the cards collection
          localField: "cards", // Field in the lists collection
          foreignField: "_id", // Field in the cards collection
          as: "cards", // Alias for the output array
        },
      },
      // Add fields to sort the cards array within each list
      {
        $addFields: {
          cards: {
            $sortArray: {
              input: "$cards",
              sortBy: { order: 1 },
            },
          },
        },
      },
    ]);
  } catch (error) {
    console.log("fetch error");
    return {
      error: "Failed to fetch List",
    };
  }

  return { data: lists };
};

export const getLists = createSafeAction(GetListsSchema, handler);
