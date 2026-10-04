import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { registerUser, loginUser, refreshTokens, loginWithGoogle } from "../../modules/auth/auth.service.js";

export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const tokens = await registerUser(name, email, password, role);
  res.status(201).json(ApiResponse.success(tokens, "Registered successfully"));
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const tokens = await loginUser(email, password);
  res.json(ApiResponse.success(tokens, "Logged in successfully"));
});

export const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const { idToken, role } = req.body;
  const tokens = await loginWithGoogle(idToken, role);
  res.json(ApiResponse.success(tokens, "Logged in with Google"));
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const tokens = await refreshTokens(refreshToken);
  res.json(ApiResponse.success(tokens, "Token refreshed"));
});

export const logout = catchAsync(async (_req: Request, res: Response) => {
  // Stateless JWT: client discards tokens. If you add a token blacklist/Redis later, revoke here.
  res.json(ApiResponse.success({}, "Logged out successfully"));
});

