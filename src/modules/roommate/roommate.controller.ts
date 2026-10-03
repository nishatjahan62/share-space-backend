
import type { AuthRequest } from "../../middlewares/auth.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as roommateService from "../../modules/roommate/roommate.service.js"
import type { Response } from "express";

export const upsertProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const profile = await roommateService.upsertProfile(req.user!.userId, req.body);
  res.json(ApiResponse.success(profile, "Profile saved"));
});

export const getMyProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const profile = await roommateService.getMyProfile(req.user!.userId);
  res.json(ApiResponse.success(profile));
});

export const findMatches = catchAsync(async (req: AuthRequest, res: Response) => {
  const matches = await roommateService.findMatches(req.user!.userId);
  res.json(ApiResponse.success(matches, "Matches fetched"));
});