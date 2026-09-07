import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as propertyService from "../../modules/property/property.service.js";
import { ApiError } from "../../utils/ApiError.js";

export const createProperty = catchAsync(async (req: AuthRequest, res: Response) => {
  const property = await propertyService.createProperty(req.user!.userId, req.body);
  res.status(201).json(ApiResponse.success(property, "Property created"));
});

export const listProperties = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await propertyService.listProperties(req.query);
  res.json(ApiResponse.success(result, "Properties fetched"));
});

export const getProperty = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (typeof id !== "string") throw new ApiError(400, "Property id is required");

  const property = await propertyService.getPropertyById(id);
  res.json(ApiResponse.success(property));
});

export const updateProperty = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (typeof id !== "string") throw new ApiError(400, "Property id is required");

  const property = await propertyService.updateProperty(id, req.user!.userId, req.body);
  res.json(ApiResponse.success(property, "Property updated"));
});

export const deleteProperty = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (typeof id !== "string") throw new ApiError(400, "Property id is required");

  await propertyService.deleteProperty(id, req.user!.userId);
  res.json(ApiResponse.success({}, "Property deleted"));
});


export const searchProperties = catchAsync(async (req: AuthRequest, res: Response) => {
  const results = await propertyService.searchProperties(String(req.query.q || ""));
  res.json(ApiResponse.success(results));
});