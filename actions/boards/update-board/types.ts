import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { UpdateBoardSchema } from "./schema";
import { BoardType } from "@/types";

export type InputType = z.infer<typeof UpdateBoardSchema>;
export type ReturnType = ActionState<InputType, BoardType>;
