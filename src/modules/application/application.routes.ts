import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { createApplicationSchema } from "../../modules/application/application.validation.js";
import * as ctrl from "../../modules/application/application.controller.js";

const router = Router();
router.post("/", authenticate, authorize("TENANT"), validate(createApplicationSchema), ctrl.createApplication);
router.get("/my", authenticate, authorize("TENANT"), ctrl.getMyApplications);
router.patch("/:id/approve", authenticate, authorize("OWNER"), ctrl.approveApplication);
router.patch("/:id/reject", authenticate, authorize("OWNER"), ctrl.rejectApplication);

export default router;