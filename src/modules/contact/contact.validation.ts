import { z } from "zod";

export const contactSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    subject: z.string().min(3).max(120),
    message: z.string().min(10).max(2000),
  }),
});