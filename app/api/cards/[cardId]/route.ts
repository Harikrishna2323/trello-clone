import dbConnect from "@/lib/mongodb";
import Card from "@/models/Card";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    console.log({ params });
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();

    const card = await Card.findOne({ _id: params.cardId }).populate({
      path: "list",
      select: ["title", "description"],
    });

    console.log({ card });

    return NextResponse.json(card);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
