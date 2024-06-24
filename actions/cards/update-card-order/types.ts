import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { UpdateCardOrderSchema } from "./schema";
import { CardType } from "@/types";

export type InputType = z.infer<typeof UpdateCardOrderSchema>;
export type ReturnType = ActionState<InputType, CardType[]>;
