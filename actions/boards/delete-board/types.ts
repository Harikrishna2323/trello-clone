import { z } from "zod";
import { DeleteBoardSchema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { BoardType } from "@/types";

export type InputType = z.infer<typeof DeleteBoardSchema>;
export type ReturnType = ActionState<InputType, BoardType>;
