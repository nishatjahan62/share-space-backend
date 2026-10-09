import express, { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.js";
import * as ctrl from "../../modules/payment/payment.controller.js";

// Normal payment routes (JSON body), mounted under /api/v1/payments via v1 router
const router = Router();
router.post("/initiate", authenticate, authorize("TENANT"), ctrl.initiate);
router.get("/:id", authenticate, authorize("TENANT"), ctrl.getPayment);

// Stripe webhook needs the RAW body to verify the signature, so it gets its own router
export const webhookRouter = Router();
webhookRouter.post("/", express.raw({ type: "application/json" }), ctrl.webhook);

export default router;