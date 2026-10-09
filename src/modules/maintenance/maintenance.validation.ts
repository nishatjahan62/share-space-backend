import { z } from "zod";

export const createMaintenanceSchema = z.object({
  body: z.object({
    roomId: z.string(),
    title: z.string().min(2),
    description: z.string().min(5),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  }),
});

export const updateMaintenanceStatusSchema = z.object({
  body: z.object({ status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]) }),
  params: z.object({ id: z.string() }),
});