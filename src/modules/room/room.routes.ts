import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { createRoomSchema, updateAvailabilitySchema } from "../../modules/room/room.validation.js";
import * as ctrl from "../../modules/room/room.controller.js";

const propertyNestedRouter = Router();
propertyNestedRouter.post("/:propertyId/rooms", authenticate, authorize("OWNER"), validate(createRoomSchema), ctrl.createRoom);

const roomRouter = Router();
roomRouter.get("/:id", ctrl.getRoom);
roomRouter.patch("/:id", authenticate, authorize("OWNER"), ctrl.updateRoom);
roomRouter.patch("/:id/availability", authenticate, authorize("OWNER"), validate(updateAvailabilitySchema), ctrl.updateAvailability);

export { propertyNestedRouter, roomRouter };