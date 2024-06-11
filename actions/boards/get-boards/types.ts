import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";

export type ReturnType = ActionState<undefined, BoardType[]>;
