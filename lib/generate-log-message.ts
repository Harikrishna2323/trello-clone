import AuditLog from "@/models/AuditLog";
import { AuditLogType } from "@/types";

const ACTION = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
};

export const generateLogMessage = (log: AuditLogType) => {
  const { action, entityTitle, entityType } = log;

  switch (action) {
    case ACTION.CREATE:
      return `created ${entityType.toLowerCase()} "${entityTitle}" `;

    case ACTION.UPDATE:
      return `updated ${entityType.toLowerCase()} "${entityTitle}" `;

    case ACTION.DELETE:
      return `deleted ${entityType.toLowerCase()} "${entityTitle}" `;
    default:
      return `unknown action on ${entityType.toLowerCase()} "${entityTitle}" `;
  }
};
