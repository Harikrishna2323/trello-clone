import { z } from "zod";
import { UpdateListOrderSchema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { ListType } from "@/types";

export type InputType = z.infer<typeof UpdateListOrderSchema>;
export type ReturnType = ActionState<InputType, ListType[]>;
