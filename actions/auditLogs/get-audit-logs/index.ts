"use server";
import { auth } from "@clerk/nextjs/server";

import { createSafeAction } from "@/lib/create-safe-action";
import dbConnect from "@/lib/mongodb";
import { InputType, ReturnType } from "./types";
import AuditLog from "@/models/AuditLog";
import { GetAuditLogsType } from "./schema";

// const handler = async (data: InputType): Promise<ReturnType> => {
//   const { orgId } = auth();

//   const { orgId: clientOrgId } = data;

//   if (orgId !== clientOrgId)
//     return {
//       error: "Unauthorized",
//     };

//   try {
//     await dbConnect();
//     const auditLogs = await AuditLog.find({ orgId });

//     return { data: JSON.parse(JSON.stringify(auditLogs)) };
//   } catch (error) {
//     return { error: "Failed to fetch logs" };
//   }
// };

export const getAuditLogs = async (data: InputType): Promise<ReturnType> => {
  const { orgId } = auth();

  const { orgId: clientOrgId } = data;

  if (orgId !== clientOrgId)
    return {
      error: "Unauthorized",
    };

  try {
    await dbConnect();
    const auditLogs = await AuditLog.find({ orgId }).sort({
      createdAt: "desc",
    });

    return { data: JSON.parse(JSON.stringify(auditLogs)) };
  } catch (error) {
    return { error: "Failed to fetch logs" };
  }
};
