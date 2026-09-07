import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as roomService from "../../modules/room/room.service.js";
import { ApiError } from "../../utils/ApiError.js";

export const createRoom = catchAsync(async (req: AuthRequest, res: Response) => {
  const { propertyId } = req.params;
  if (typeof propertyId !== "string") throw new ApiError(400, "Property id is required");

  const room = await roomService.createRoom(propertyId, req.user!.userId, req.body);
  res.status(201).json(ApiResponse.success(room, "Room created"));
});

export const getRoom = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (typeof id !== "string") throw new ApiError(400, "Room id is required");

  const room = await roomService.getRoomById(id);
  res.json(ApiResponse.success(room));
});

export const updateRoom = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (typeof id !== "string") throw new ApiError(400, "Room id is required");

  const room = await roomService.updateRoom(id, req.user!.userId, req.body);
  res.json(ApiResponse.success(room, "Room updated"));
});

export const updateAvailability = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (typeof id !== "string") throw new ApiError(400, "Room id is required");

  const room = await roomService.updateAvailability(id, req.user!.userId, req.body.status);
  res.json(ApiResponse.success(room, "Availability updated"));
});