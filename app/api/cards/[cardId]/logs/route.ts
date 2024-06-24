import dbConnect from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();

    const auditLogs = await AuditLog.find({
      orgId,
      entityId: params.cardId,
      entityType: "CARD",
    })
      .sort({ createdAt: "desc" })
      .limit(3);

    return NextResponse.json(auditLogs);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
