import type { AuthRequest } from "../../middlewares/auth.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import type { Response } from "express";
import * as maintenanceService from "../../modules/maintenance/maintenance.service.js";
import { getParam } from "../../utils/getParam.js";

export const createRequest = catchAsync(async (req: AuthRequest, res: Response) => {
  const request = await maintenanceService.createRequest(req.user!.userId, req.body);
  res.status(201).json(ApiResponse.success(request, "Maintenance request submitted"));
});

export const getMyRequests = catchAsync(async (req: AuthRequest, res: Response) => {
  const requests = await maintenanceService.getMyRequests(req.user!.userId);
  res.json(ApiResponse.success(requests));
});

export const updateStatus = catchAsync(async (req: AuthRequest, res: Response) => {
  const request = await maintenanceService.updateStatus(getParam(req,"id"), req.user!.userId, req.body.status);
  res.json(ApiResponse.success(request, "Status updated"));
});