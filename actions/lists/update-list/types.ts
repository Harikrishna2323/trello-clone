import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { UpdateListSchema } from "./schema";
import { ListType } from "@/types";

export type InputType = z.infer<typeof UpdateListSchema>;
export type ReturnType = ActionState<InputType, ListType>;
