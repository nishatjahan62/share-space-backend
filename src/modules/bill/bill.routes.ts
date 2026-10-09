import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { createBillSchema } from "../../modules/bill/bill.validation.js";
import * as ctrl from "../../modules/bill/bill.controller.js";

const roomBillRouter = Router();
roomBillRouter.post("/:roomId/utility-bills", authenticate, authorize("OWNER"), validate(createBillSchema), ctrl.createBill);

const billRouter = Router();
billRouter.get("/:id/splits", authenticate, ctrl.getSplits);

const splitRouter = Router();
splitRouter.patch("/:id/pay", authenticate, authorize("TENANT"), ctrl.paySplit);

export { roomBillRouter, billRouter, splitRouter };