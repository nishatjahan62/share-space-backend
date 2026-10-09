import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as adminService from "../../modules/admin/admin.service.js";
import { getParam } from "../../utils/getParam.js";

export const listUsers = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await adminService.listUsers(req.query.page as string, req.query.limit as string);
  res.json(ApiResponse.success(result));
});

export const verifyUser = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await adminService.verifyUser(req.user!.userId, getParam(req,"id"));
  res.json(ApiResponse.success(user, "User verified"));
});

export const getDashboardStats = catchAsync(async (_req: AuthRequest, res: Response) => {
  const stats = await adminService.getDashboardStats();
  res.json(ApiResponse.success(stats));
});

export const getAuditLogs = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await adminService.getAuditLogs(req.query.page as string, req.query.limit as string);
  res.json(ApiResponse.success(result));
});