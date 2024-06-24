import { z } from "zod";

export const UpdateCardOrderSchema = z.object({
  cardId: z.string(),
  destListId: z.string(),
  boardId: z.string(),
  items: z.array(
    z.object({
      _id: z.string(),
      title: z.string(),
      order: z.number(),
      listId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
});
