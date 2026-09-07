import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { createPropertySchema, updatePropertySchema, listPropertiesSchema } from "../../modules/property/property.validation.js";
import * as ctrl from "../../modules/property/property.controller.js";

const router = Router();

router.get("/search", ctrl.searchProperties);
router.get("/", validate(listPropertiesSchema), ctrl.listProperties);
router.get("/:id", ctrl.getProperty);
router.post("/", authenticate, authorize("OWNER"), validate(createPropertySchema), ctrl.createProperty);
router.patch("/:id", authenticate, authorize("OWNER"), validate(updatePropertySchema), ctrl.updateProperty);
router.delete("/:id", authenticate, authorize("OWNER"), ctrl.deleteProperty);

export default router;