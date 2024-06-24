import { z } from "zod";
import { CopyCardSchema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { CardType } from "@/types";

export type InputType = z.infer<typeof CopyCardSchema>;
export type ReturnType = ActionState<InputType, CardType>;
