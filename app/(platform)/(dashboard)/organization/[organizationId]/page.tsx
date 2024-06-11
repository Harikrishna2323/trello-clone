import { Button } from "@/components/ui/button";
import { createBoard } from "../../../../../actions/boards/create-board";

import { getBoards } from "@/actions/boards/get-boards";
import { Info } from "./_components/info";
import { Separator } from "@/components/ui/separator";
import { BoardList } from "./_components/board-list";

const OrganizationIdPage = async () => {
  const boards = await getBoards();

  return (
    <div className="w-full mb-20">
      <Info />
      <Separator className="my-4" />
      <div className="px-2 md:px-4">
        <BoardList />
      </div>
    </div>
  );
};
export default OrganizationIdPage;
