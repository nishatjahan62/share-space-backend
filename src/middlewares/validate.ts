import type { Request, Response, NextFunction } from "express";
import {ZodError } from "zod";
import { ApiResponse } from "../utils/ApiResponse.js";
import type { AnyZodObject } from "zod/v3";

export const validate = (schema: AnyZodObject) =>
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