import { getBoard } from "@/actions/boards/get-board";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BoardTitleForm } from "./board-title-form";
import { BoardOptions } from "./board-options";

interface BoardNavbarProps {
  board: BoardType;
}

export const BoardNavbar = async ({ board }: BoardNavbarProps) => {
  return (
    <div className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4 text-white">
      <BoardTitleForm data={board} />
      <div className="ml-auto">
        <BoardOptions id={board._id} />
      </div>
    </div>
  );
};
