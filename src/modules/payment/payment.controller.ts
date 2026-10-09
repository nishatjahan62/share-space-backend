import type { AuthRequest } from "../../middlewares/auth.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import type { Request , Response } from "express";
import { stripe } from "../../config/stripe.js";
import * as paymentService from "../../modules/payment/payment.service.js";
import { getParam } from "../../utils/getParam.js";

export const initiate = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await paymentService.initiatePayment(req.user!.userId, req.body.rentPaymentId);
  res.json(ApiResponse.success(result, "Checkout session created"));
});

// Raw body required for Stripe signature verification — configured in routes below
export const webhook = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  await paymentService.handleWebhookEvent(event);
  res.json({ received: true });
});

export const getPayment = catchAsync(async (req: AuthRequest, res: Response) => {
  const payment = await paymentService.getPaymentById(getParam(req,"id"), req.user!.userId);
  res.json(ApiResponse.success(payment));
});