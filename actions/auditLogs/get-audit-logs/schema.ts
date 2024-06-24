import { z } from "zod";

export const GetAuditLogsType = z.object({
  orgId: z.string(),
});
