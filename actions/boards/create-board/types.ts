import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { CreateBoardSchema } from "./schema";
import { BoardType } from "@/types";

export type InputType = z.infer<typeof CreateBoardSchema>;
export type ReturnType = ActionState<InputType, BoardType>;
