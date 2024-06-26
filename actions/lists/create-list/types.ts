import { z } from "zod";
import { CreateListSchema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { ListType } from "@/types";

export type InputType = z.infer<typeof CreateListSchema>;

export type ReturnType = ActionState<InputType, ListType>;
