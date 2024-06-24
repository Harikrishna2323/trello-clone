import { auth, currentUser } from "@clerk/nextjs/server";

import dbConnect from "./mongodb";
import AuditLog from "@/models/AuditLog";

interface Props {
  entityId: string;
  entityType: string;
  entityTitle: string;
  action: string;
}

export const createAuditLog = async (props: Props) => {
  try {
    await dbConnect();
    const { orgId } = auth();
    const user = await currentUser();

    if (!orgId || !user) {
      throw new Error("User not found");
    }
    const { entityId, entityTitle, entityType, action } = props;

    console.log({ props });

    const auditLog = await AuditLog.create({
      orgId,
      entityId,
      entityTitle,
      entityType,
      action,
      userId: user.id,
      userImage: user?.imageUrl,
      userName: user?.firstName + " " + user?.lastName,
    });

    console.log({ auditLog });
  } catch (error) {
    console.log("[Audit log error] : ", error);
  }
};
