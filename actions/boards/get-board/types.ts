import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { GetBoardSchema } from "./schema";
import { BoardType } from "@/types";

export type InputType = z.infer<typeof GetBoardSchema>;
export type ReturnType = ActionState<InputType, BoardType>;
