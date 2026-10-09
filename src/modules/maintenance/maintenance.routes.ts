import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { createMaintenanceSchema, updateMaintenanceStatusSchema } from "../../modules/maintenance/maintenance.validation.js";
import * as ctrl from "../../modules/maintenance/maintenance.controller.js";

const router = Router();
router.post("/", authenticate, authorize("TENANT"), validate(createMaintenanceSchema), ctrl.createRequest);
router.get("/my", authenticate, authorize("TENANT"), ctrl.getMyRequests);
router.patch("/:id/status", authenticate, authorize("OWNER"), validate(updateMaintenanceStatusSchema), ctrl.updateStatus);

export default router;