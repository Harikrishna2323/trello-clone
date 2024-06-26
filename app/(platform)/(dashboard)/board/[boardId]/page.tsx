import { getLists } from "@/actions/lists/get-lists";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ListContainer } from "./_components/list-container";

interface BoardIdPageProps {
  params: {
    boardId: string;
  };
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  const { orgId } = auth();

  if (!orgId) redirect("select-org");

  const lists = await getLists({
    boardId: params.boardId,
  });

  return (
    <div className="p-4 h-full overflow-auto">
      <ListContainer boardId={params.boardId} data={lists?.data!} />
    </div>
  );
};

export default BoardIdPage;
