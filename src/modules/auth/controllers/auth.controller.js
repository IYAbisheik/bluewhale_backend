import generateToken from "../../utils/generateToken.js";
import * as authService from "../services/auth.service.js";
import jwt from "jsonwebtoken";

// REGISTER

export const register = async (req, res) => {
  try {
    const result =
      await authService.registerUser(
        req.body
      );

    res.status(201).json(result);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// LOGIN

export const login = async (req, res) => {
  try {
    const result =
      await authService.loginUser(
        req.body
      );

    if (result.twoFactorRequired) {
      return res.status(200).json(result);
    }

    res.cookie("refreshToken", result?.refreshtoken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }
    )

    return res.status(200).json({
      message: "Login successful",
      user: result.user,
      accessToken: result.accessToken,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// GENERATE 2FA

export const generate2FA = async (req, res) => {
  try {
    
    const result =
      await authService.generateTwoFactor(
        req.user.id
      );

    res.json(result);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// VERIFY ENABLE 2FA

export const verify2FA = async (req, res) => {
  try {
    const result =
      await authService.verifyTwoFactor(
        req.user.id,
        req.body.token
      );

    res.json(result);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// VERIFY LOGIN OTP

export const verifyLoginOtp = async (
  req,
  res
) => {
  try {
    const result =
      await authService.verifyLoginOtp(
        req.body.userId,
        req.body.otp
      );

    res.json(result);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

export const disable2FA = async (
  req,
  res
) => {
  try {

    const result =
      await authService.disableTwoFactor(
        req.user.id
      );

    res.json(result);

  } catch (error) {

    res.status(400).json({
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const response = await authService.verifyEmail(token);

        return res.status(200).json({
            success: true,
            message: response.message,
        });

    } catch (error) {
        console.error("Verify Email Controller Error:", error);

        return res.status(
            error.statusCode || 400
        ).json({
            success: false,
            message:
                error.message ||
                "Email verification failed.",
        });
    }
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

      console.log("LINE182", refreshToken);

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token missing",
    });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET
    );

        console.log("LINE183", decoded);

    const accessToken = generateToken({
      id: decoded.id,
    });

    console.log("LINE181", accessToken);

    return res.status(200).json({
      accessToken,
    });

  } catch (error) {
    console.log("LINE192", error);
    
    return res.status(403).json({
      message: "Invalid refresh token",
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
};