import type { AuthRequest } from "../../middlewares/auth.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import type { Response } from "express";
import * as billService from "../../modules/bill/bill.service.js";
import { getParam } from "../../utils/getParam.js";

export const createBill = catchAsync(async (req: AuthRequest, res: Response) => {
  const bill = await billService.createUtilityBill(getParam(req,"id") , req.user!.userId, req.body);
  res.status(201).json(ApiResponse.success(bill, "Utility bill created and split"));
});

export const getSplits = catchAsync(async (req: AuthRequest, res: Response) => {
  const splits = await billService.getBillSplits(getParam(req,"id"));
  res.json(ApiResponse.success(splits));
});

export const paySplit = catchAsync(async (req: AuthRequest, res: Response) => {
  const split = await billService.markSplitPaid(getParam(req,"id"), req.user!.userId);
  res.json(ApiResponse.success(split, "Bill share marked as paid"));
});