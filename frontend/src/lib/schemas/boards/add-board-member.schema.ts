import { z } from "zod";

export const addBoardMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email."),
});

export type AddBoardMemberSchema = z.infer<typeof addBoardMemberSchema>;

export default addBoardMemberSchema;
