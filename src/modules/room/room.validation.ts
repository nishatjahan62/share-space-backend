import { z } from "zod";

export const createRoomSchema = z.object({
  body: z.object({
    roomNumber: z.string().min(1),
    rentAmount: z.number().int().positive(),
    capacity: z.number().int().positive(),
  }),
  params: z.object({ propertyId: z.string() }),
});

export const updateAvailabilitySchema = z.object({
  body: z.object({ status: z.enum(["AVAILABLE", "OCCUPIED", "RESERVED"]) }),
  params: z.object({ id: z.string() }),
});