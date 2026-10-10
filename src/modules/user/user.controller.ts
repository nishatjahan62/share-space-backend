import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { ApiResponse } from "../../utils/ApiResponse.js"

import * as userService from "../../modules/user/user.service.js";

export const getMe = catchAsync(async (req: AuthRequest, res: Response) => {
  res.json(ApiResponse.success(await userService.getMe(req.user!.userId)));
});

export const updateMe = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await userService.updateMe(req.user!.userId, req.body);
  res.json(ApiResponse.success(user, "Profile updated"));
});