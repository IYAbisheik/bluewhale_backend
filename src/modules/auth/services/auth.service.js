import prisma from "../../../config/prisma.js";

import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";

import generateToken, { generateRefreshToken } from "../../utils/generateToken.js";
import { onHandleEmailTrigger } from "../../../services/email/email.route.js";
import { correctDescriptions } from "../../gemini/controllers/aiController.js";


// REGISTER USER

export const registerUser = async (body) => {
  const { email, password, name, userName } = body;

  if (!name || !email || !password || !userName) {
    throw new Error(
      'Name, email, userName and password are required'
    );
  }
  const hashedPassword =
    await bcrypt.hash(password, 10);

  const existingUser =
    await prisma.user.findUnique({
      where: { email },
    });

  if (existingUser) {
    throw new Error(
      'User already exists with this email'
    );
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      userName,
      password: hashedPassword,
    },
  });

  const verificationToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  )

  console.log("LINE56", verificationToken, process.env.JWT_SECRET);

  await onHandleEmailTrigger({
    toAddress: user.email,
    subject: "Verify Your Email",
    data: {
      name: user.name,
      verificationLink: `http://localhost:3000/verify-email/${verificationToken}`,
    },
  });

  return user;
};


// LOGIN USER

export const loginUser = async (body) => {
  const { email, password } = body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isMatch) {
    throw new Error("Invalid password");
  }

  if (user.twoFactorEnabled) {
    return {
      twoFactorRequired: true,
      userId: user.id,
    };
  }

  const token = generateToken({
    id: user?.id,
  });

  const refreshtoken = generateRefreshToken({
    id: user?.id,
  })

    correctDescriptions()

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    accessToken: token,
    refreshtoken
  };
};


// GENERATE 2FA

export const generateTwoFactor = async (
  userId
) => {
  const secret =
    speakeasy.generateSecret({
      name: "whaleIQ",
    });

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      twoFactorSecret:
        secret.base32,
    },
  });

  const qrCode =
    await QRCode.toDataURL(
      secret.otpauth_url
    );

  return {
    qrCode,
  };
};


// VERIFY ENABLE 2FA

export const verifyTwoFactor = async (
  userId,
  token
) => {
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

  const verified =
    speakeasy.totp.verify({
      secret:
        user.twoFactorSecret,
      encoding: "base32",
      token,
    });

  if (!verified) {
    throw new Error("Invalid OTP");
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      twoFactorEnabled: true,
    },
  });

  return {
    message: "2FA enabled",
  };
};


// VERIFY LOGIN OTP

export const verifyLoginOtp = async (
  userId,
  otp
) => {
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

  console.log("LINE163", user, userId, otp);

  const verified =
    speakeasy.totp.verify({
      secret:
        user.twoFactorSecret,
      encoding: "base32",
      token: otp,
    });

  console.log("LINE173", verified);

  if (!verified) {
    throw new Error("Invalid OTP");
  }

  const token =
    generateToken({
      id: user.id,
    });

  return {
    token,
  };
};

export const disableTwoFactor = async (
  userId
) => {

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
    },
  });

  return {
    message: "2FA disabled successfully",
  };
};

export const verifyEmail = async (token) => {
    try {
      console.log("LINE250", token);
      
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
console.log("LINE256", decoded);
        const user = await prisma.user.findUnique({
    where: {
        id: decoded.userId,
    },
});

        if (!user) { 
            throw {
                statusCode: 404,
                message: "User not found.",
            };
        }

        if (user.isEmailVerified) {
            return {
                message:
                    "Email is already verified.",
            };
        }

        await user.update({
            isEmailVerified: true,
        });

        return {
            message:
                "Email verified successfully.",
        };

    } catch (error) {
        if (
            error.name === "TokenExpiredError"
        ) {
            throw {
                statusCode: 400,
                message:
                    "Verification link has expired.",
            };
        }

        if (
            error.name === "JsonWebTokenError"
        ) {
            throw {
                statusCode: 400,
                message:
                    "Invalid verification link.",
            };
        }

        throw error;
    }
};