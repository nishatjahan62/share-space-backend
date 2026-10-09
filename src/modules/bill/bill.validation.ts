import { z } from "zod";

export const createBillSchema = z.object({
  body: z.object({
    type: z.enum(["ELECTRICITY", "WATER", "GAS", "INTERNET"]),
    amount: z.number().int().positive(),
    billingMonth: z.string().regex(/^\d{4}-\d{2}$/),
  }),
  params: z.object({ roomId: z.string() }),
});