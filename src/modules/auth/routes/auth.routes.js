const express = require("express");

const router = express.Router();

const authController =
  require("../controllers/auth.controller");

const authMiddleware =
  require("../middleware/auth.middleware");


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


module.exports = router;