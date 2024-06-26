import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { BoardType } from "@/types";

export type ReturnType = ActionState<undefined, BoardType[]>;
