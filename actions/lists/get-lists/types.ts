import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { GetListsSchema } from "./schema";
import { ListType, TypeList } from "@/types";

export type InputType = z.infer<typeof GetListsSchema>;
export type ReturnType = ActionState<InputType, TypeList[]>;
