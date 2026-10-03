import { Router } from "express";
import { authenticate } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { upsertProfileSchema } from "../../modules/roommate/roommate.validation.js";
import * as ctrl from "../../modules/roommate/roommate.controller.js";

const router = Router();
router.use(authenticate);
router.post("/me/roommate-profile", validate(upsertProfileSchema), ctrl.upsertProfile);
router.get("/me/roommate-profile", ctrl.getMyProfile);

const matchRouter = Router();
matchRouter.get("/roommates", authenticate, ctrl.findMatches);

export { router as userRoommateRouter, matchRouter };