import { z } from "zod";

import { CardType } from "@/types";
import { ActionState } from "@/lib/create-safe-action";
import { DeleteCardSchema } from "./schema";

export type InputType = z.infer<typeof DeleteCardSchema>;
export type ReturnType = ActionState<InputType, CardType>;
