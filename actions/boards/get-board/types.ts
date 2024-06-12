import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { GetBoardSchema } from "./schema";

export type InputType = z.infer<typeof GetBoardSchema>;
export type ReturnType = ActionState<InputType, BoardType>;
