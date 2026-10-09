import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.js";
import * as ctrl from "../../modules/admin/admin.controller.js";


const router = Router();
router.use(authenticate, authorize("ADMIN"));
router.get("/users", ctrl.listUsers);
router.patch("/users/:id/verify", ctrl.verifyUser);
router.get("/dashboard-stats", ctrl.getDashboardStats);
router.get("/audit-logs", ctrl.getAuditLogs);

export default router;