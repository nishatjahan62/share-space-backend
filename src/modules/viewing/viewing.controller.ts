import type { AuthRequest } from "../../middlewares/auth.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import type { Response } from "express";
import * as viewingService from "../../modules/viewing/viewing.service.js";
import { getParam } from "../../utils/getParam.js";


export const createViewing = catchAsync(async (req: AuthRequest, res: Response) => {
  const { roomId, requestedDate } = req.body;
  const viewing = await viewingService.createViewingRequest(req.user!.userId, roomId, requestedDate);
  res.status(201).json(ApiResponse.success(viewing, "Viewing request created"));
});

export const updateStatus = catchAsync(async (req: AuthRequest, res: Response) => {
  const viewing = await viewingService.updateViewingStatus(
    getParam(req, "id"),
    req.user!.userId,
    req.body.status
  );
  res.json(ApiResponse.success(viewing, "Viewing status updated"));
});