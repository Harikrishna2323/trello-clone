import { z } from "zod";
import { GetAuditLogsType } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { AuditLogType } from "@/types";

export type InputType = z.infer<typeof GetAuditLogsType>;
export type ReturnType = ActionState<InputType, AuditLogType[]>;
