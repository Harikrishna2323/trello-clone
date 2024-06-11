"use server";

import dbConnect from "@/lib/mongodb";
import Board from "@/models/Board";
import { auth } from "@clerk/nextjs/server";

// const handler = async (): Promise<ReturnType> => {
//   const { userId } = auth();

//   if (!userId) {
//     return {
//       error: "Unauthorized",
//     };
//   }

//   let boards;

//   try {
//     await dbConnect();
//     boards = await Board.find();
//   } catch (error) {
//     return {
//       error: "Failed to fetch boards",
//     };
//   }

//   return { data: boards };
// };

export const getBoards = async () => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  let boards: BoardType[];

  try {
    await dbConnect();
    boards = await Board.find();
  } catch (error) {
    return {
      error: "Failed to fetch boards",
    };
  }

  return { data: boards };
};
