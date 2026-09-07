import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { ApiResponse } from "../utils/ApiResponse.js";

export const validate = (schema: z.ZodType) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({ body: req.body, params: req.params, query: req.query });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json(ApiResponse.error("Validation failed", err.issues));
      }
      next(err);
    }
  };