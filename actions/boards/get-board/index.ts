"use server";

import dbConnect from "@/lib/mongodb";
import Board from "@/models/Board";
import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  let board;

  const { boardId, orgId } = data;

  try {
    await dbConnect();
    board = await Board.findById(boardId).where({ orgId });
  } catch (error) {
    return {
      error: "Failed to fetch boards",
    };
  }

  return { data: board };
};

export const getBoard = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  let board;

  const { boardId, orgId } = data;

  try {
    await dbConnect();
    board = await Board.findOne({ _id: boardId, orgId });
  } catch (error) {
    return {
      error: "Failed to fetch board",
    };
  }

  return { data: board };
};
