import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { CardType } from "@/types";
import { UpdateCardSchema } from "./schema";

export type InputType = z.infer<typeof UpdateCardSchema>;
export type ReturnType = ActionState<InputType, CardType>;
