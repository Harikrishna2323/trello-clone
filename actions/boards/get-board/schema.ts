import { z } from "zod";

export const GetBoardSchema = z.object({
  boardId: z.string({
    required_error: "BoardId is required",
    invalid_type_error: "BoardId is required",
  }),
  orgId: z.string({
    required_error: "OrganizationId is required",
    invalid_type_error: "OrganizationId is required",
  }),
});
