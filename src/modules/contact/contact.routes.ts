import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { contactSchema } from "./contact.validation.js";
import * as ctrl from "./contact.controller.js";

const router = Router();

router.post("/", validate(contactSchema), ctrl.createMessage);

export default router;