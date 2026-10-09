import type { AuthRequest } from "../../middlewares/auth.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import type { Response } from "express";

import * as applicationService from "../../modules/application/application.service.js";
import { getParam } from "../../utils/getParam.js";

export const createApplication = catchAsync(async (req: AuthRequest, res: Response) => {
  const application = await applicationService.createApplication(
    req.user!.userId, req.body.roomId, req.body.moveInDate, req.body.message
  );
  res.status(201).json(ApiResponse.success(application, "Application submitted"));
});

export const getMyApplications = catchAsync(async (req: AuthRequest, res: Response) => {
  const applications = await applicationService.getMyApplications(req.user!.userId);
  res.json(ApiResponse.success(applications));
});

export const approveApplication = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await applicationService.approveApplication(getParam(req, "id"), req.user!.userId);
  res.json(ApiResponse.success(result, "Application approved, tenancy created"));
});

export const rejectApplication = catchAsync(async (req: AuthRequest, res: Response) => {
  const application = await applicationService.rejectApplication(getParam(req, "id"), req.user!.userId);
  res.json(ApiResponse.success(application, "Application rejected"));
});