import express from "express";

import * as authController from "../controllers/auth.controller.js";
import authMiddleware from "../../../middlewares/auth.middleware.js";

const router = express.Router();

// REGISTER
router.post(
  "/register",
  authController.register
);

// LOGIN
router.post(
  "/login",
  authController.login
);

// GENERATE 2FA
router.post(
  "/generate-2fa",
  authMiddleware,
  authController.generate2FA
);

// VERIFY ENABLE 2FA
router.post(
  "/verify-2fa",
  authMiddleware,
  authController.verify2FA
);

// VERIFY LOGIN OTP
router.post(
  "/verify-login-otp",
  authController.verifyLoginOtp
);

router.post(
  "/disable-2fa",
  authMiddleware,
  authController.disable2FA
);

router.post(
  "/verify-email/:token",
  authController.verifyEmail
)

router.post("/refresh-token", authController.refresh);

router.post("/logout", authController.logout);

export default router;