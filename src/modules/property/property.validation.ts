import { z } from "zod";

export const createPropertySchema = z.object({
  body: z.object({
    title: z.string().min(2),
    address: z.string().min(3),
    city: z.string().min(2),
    description: z.string().optional(),
  }),
});

export const updatePropertySchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    address: z.string().min(3).optional(),
    city: z.string().min(2).optional(),
    description: z.string().optional(),
  }),
  params: z.object({ id: z.string() }),
});

export const listPropertiesSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    city: z.string().optional(),
    minRent: z.string().optional(),
    maxRent: z.string().optional(),
    sortBy: z.enum(["createdAt", "title"]).optional(),
  }),
});