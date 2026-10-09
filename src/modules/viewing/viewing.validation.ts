import { z } from "zod";

export const createViewingSchema = z.object({
  body: z.object({
    roomId: z.string(),
    requestedDate: z.string().datetime(),
  }),
});

export const updateViewingStatusSchema = z.object({
  body: z.object({ status: z.enum(["CONFIRMED", "REJECTED", "COMPLETED"]) }),
  params: z.object({ id: z.string() }),
});