import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { createViewingSchema, updateViewingStatusSchema } from "../../modules/viewing/viewing.validation.js";
import * as ctrl from "../../modules/viewing/viewing.controller.js";

const router = Router();
router.post("/", authenticate, authorize("TENANT"), validate(createViewingSchema), ctrl.createViewing);
router.patch("/:id/status", authenticate, authorize("OWNER"), validate(updateViewingStatusSchema), ctrl.updateStatus);

export default router;