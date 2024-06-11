"use server";
import dbConnect from "@/lib/mongodb";
import Board from "@/models/Board";
import { revalidatePath } from "next/cache";

export const deleteBoard = async (id: string) => {
  try {
    await dbConnect();

    const board = await Board.findByIdAndDelete(id, {
      new: true,
    });

    revalidatePath("/organization/org_2hdsNvvb7ADX8ADPp0EllkdZww0");
  } catch (error) {
    console.log(error);
  }
};
