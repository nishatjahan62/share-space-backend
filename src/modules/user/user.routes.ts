import { Router } from "express";
import { authenticate } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { updateMeSchema } from "./user.validation.js";
import * as ctrl from "./user.controller.js";

const router = Router();
router.get("/me", authenticate, ctrl.getMe);
router.patch("/me", authenticate, validate(updateMeSchema), ctrl.updateMe);

export default router;