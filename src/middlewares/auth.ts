import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../../src/utils/ApiError.js";
import { verifyAccessToken } from "../../src/utils/token.js";

export interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "Not authenticated");
  }

  const token = header.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Not authenticated");
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
};

export const authorize = (...roles: string[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, "You do not have permission for this action");
    }
    next();
  };