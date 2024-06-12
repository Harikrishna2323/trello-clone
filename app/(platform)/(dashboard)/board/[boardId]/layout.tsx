import { getBoard } from "@/actions/boards/get-board";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { BoardNavbar } from "./_components/board-navbar";

export async function generateMetadata({
  params,
}: {
  params: { boardId: string };
}) {
  const { orgId } = auth();

  if (!orgId)
    return {
      title: "Board",
    };
  const board = await getBoard({
    boardId: params.boardId,
    orgId,
  });

  return {
    title: board?.data?.title || "Board",
  };
}

const BoardIdlayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { boardId: string };
}) => {
  const { orgId } = auth();

  if (!orgId) redirect("/select-org");

  const board = await getBoard({
    boardId: params.boardId,
    orgId,
  });
  if (!board) notFound();
  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage: `url(${board?.data?.imageFullUrl})`,
      }}
    >
      <BoardNavbar board={board.data!} />
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  );
};

export default BoardIdlayout;
