import type { Request, Response, NextFunction } from "express";
import {  ZodError } from "zod";
import { ApiResponse } from "../../utils/ApiResponse.js";
import type { ZodTypeAny } from "zod/v3";

 const validate = (schema: ZodTypeAny) =>
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
  export default validate