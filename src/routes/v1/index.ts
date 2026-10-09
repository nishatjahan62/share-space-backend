import { Router } from "express";
import authRoutes from "../../modules/auth/auth.routes.js"
import propertyRoutes from "../../modules/property/property.routes.js";
import { propertyNestedRouter, roomRouter } from "../../modules/room/room.routes.js";
import { userRoommateRouter, matchRouter } from "../../modules/roommate/roommate.routes.js";
import viewingRoutes from "../../modules/viewing/viewing.routes.js";
const router = Router();

router.use("/auth",authRoutes)
router.use("/properties", propertyRoutes);
router.use("/properties", propertyNestedRouter);
router.use("/rooms", roomRouter);
router.use("/users", userRoommateRouter);
router.use("/matches", matchRouter);
router.use("/viewing-requests", viewingRoutes);

export default router;