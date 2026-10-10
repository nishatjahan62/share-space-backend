import { Router } from "express";
import authRoutes from "../../modules/auth/auth.routes.js"
import propertyRoutes from "../../modules/property/property.routes.js";
import { propertyNestedRouter, roomRouter } from "../../modules/room/room.routes.js";
import { userRoommateRouter, matchRouter } from "../../modules/roommate/roommate.routes.js";
import viewingRoutes from "../../modules/viewing/viewing.routes.js";
import applicationRoutes from "../../modules/application/application.routes.js";
import paymentRoutes from "../../modules/payment/payment.routes.js";
import { roomBillRouter, billRouter, splitRouter } from "../../modules/bill/bill.routes.js";
import maintenanceRoutes from "../../modules/maintenance/maintenance.routes.js";
import adminRoutes from "../../modules/admin/admin.routes.js";
import userRoutes from "../../modules/user/user.routes.js";

const router = Router();

router.use("/auth",authRoutes)
router.use("/properties", propertyRoutes);
router.use("/properties", propertyNestedRouter);
router.use("/rooms", roomRouter);
router.use("/users", userRoommateRouter);
router.use("/matches", matchRouter);
router.use("/viewing-requests", viewingRoutes);
router.use("/applications", applicationRoutes);
router.use("/payments", paymentRoutes);
router.use("/rooms", roomBillRouter); 
router.use("/utility-bills", billRouter);
router.use("/bill-splits", splitRouter);
router.use("/maintenance-requests", maintenanceRoutes);
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);


export default router;