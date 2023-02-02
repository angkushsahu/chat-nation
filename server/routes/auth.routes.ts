import { Router } from "express";
import * as authController from "../controllers/auth.controller";
const router = Router();

router.route("/signup").post(authController.userRegister);
router.route("/login").post(authController.userLogin);
router.route("/forgot-password").post(authController.forgotPassword);
router.route("/reset-password/:id").post(authController.resetPassword);

export default router;
