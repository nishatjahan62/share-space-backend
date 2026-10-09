import { z } from "zod";

export const createApplicationSchema = z.object({
  body: z.object({
    roomId: z.string(),
    moveInDate: z.string().datetime(),
    message: z.string().optional(),
  }),
});