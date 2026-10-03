import { z } from "zod";

export const upsertProfileSchema = z.object({
  body: z.object({
    budgetMin: z.number().int().positive(),
    budgetMax: z.number().int().positive(),
    preferredCity: z.string().min(2),
    lifestyleTags: z.array(z.string()).default([]),
    bio: z.string().optional(),
  }),
});