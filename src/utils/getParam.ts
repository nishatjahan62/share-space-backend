import type { Request } from "express";
import { ApiError } from "../utils/ApiError.js";

export const getParam = (req: Request, name: string): string => {
  const value = req.params[name];
  if (typeof value !== "string") throw new ApiError(400, `${name} is required`);
  return value;
};