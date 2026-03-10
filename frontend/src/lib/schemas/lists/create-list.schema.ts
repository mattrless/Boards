import { z } from "zod";

export const createListSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "List name is required.")
    .max(50, "List name must be 50 characters or less."),
});

export type CreateListSchema = z.infer<typeof createListSchema>;

export default createListSchema;
