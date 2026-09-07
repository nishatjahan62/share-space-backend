import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  role: string;
}

const ACCESS_SECRET: Secret = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET as string;

const ACCESS_OPTIONS: SignOptions = {
  expiresIn: (process.env.JWT_ACCESS_EXPIRES || "15m") as NonNullable<SignOptions["expiresIn"]>,
};

const REFRESH_OPTIONS: SignOptions = {
  expiresIn: (process.env.JWT_REFRESH_EXPIRES || "7d") as NonNullable<SignOptions["expiresIn"]>,
};

export const signAccessToken = (payload: JwtPayload): string =>
  jwt.sign({ ...payload }, ACCESS_SECRET, ACCESS_OPTIONS);

export const signRefreshToken = (payload: JwtPayload): string =>
  jwt.sign({ ...payload }, REFRESH_SECRET, REFRESH_OPTIONS);

export const verifyAccessToken = (token: string): JwtPayload =>
  jwt.verify(token, ACCESS_SECRET) as JwtPayload;

export const verifyRefreshToken = (token: string): JwtPayload =>
  jwt.verify(token, REFRESH_SECRET) as JwtPayload;