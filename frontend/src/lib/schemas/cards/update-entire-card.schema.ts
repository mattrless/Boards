import { z } from "zod";

export const cardInformationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Card title is required.")
    .max(50, "Card title must be 50 characters or less."),
  description: z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or less."),
});

export type CardInformationSchema = z.infer<typeof cardInformationSchema>;
