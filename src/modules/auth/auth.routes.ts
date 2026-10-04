import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { registerSchema, loginSchema ,googleLoginSchema } from "../../modules/auth/auth.validation.js";
import { register, login, refresh, logout,googleLogin } from "../../modules/auth/auth.controller.js";


const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", refresh);
router.post("/logout", logout);
router.post("/google", validate(googleLoginSchema), googleLogin);

export default router;