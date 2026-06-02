const prisma = require("../prisma/prismaClient");

const bcrypt = require("bcryptjs");

const speakeasy = require("speakeasy");

const QRCode = require("qrcode");

const { generateToken } = require("../utils/jwt");


// REGISTER USER

const registerUser = async (body) => {

  const { email, password } = body;

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword
    }
  });

  return user;
};


// LOGIN USER

const loginUser = async (body) => {

  const { email, password } = body;

  const user = await prisma.user.findUnique({
    where: {
      email
    }
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

  // CHECK 2FA

  if (user.twoFactorEnabled) {

    return {
      twoFactorRequired: true,
      userId: user.id
    };
  }

  const token = generateToken({
    id: user.id
  });

  return {
    token
  };
};


// GENERATE 2FA

const generateTwoFactor = async (userId) => {

  const secret = speakeasy.generateSecret({
    name: "MyApp"
  });

  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      twoFactorSecret: secret.base32
    }
  });

  const qrCode =
    await QRCode.toDataURL(
      secret.otpauth_url
    );

  return {
    qrCode
  };
};


// VERIFY ENABLE 2FA

const verifyTwoFactor = async (
  userId,
  token
) => {

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });

  const verified =
    speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token
    });

  if (!verified) {
    throw new Error("Invalid OTP");
  }

  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      twoFactorEnabled: true
    }
  });

  return {
    message: "2FA enabled"
  };
};


// VERIFY LOGIN OTP

const verifyLoginOtp = async (
  userId,
  otp
) => {

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });

  const verified =
    speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: otp
    });

  if (!verified) {
    throw new Error("Invalid OTP");
  }

  const token = generateToken({
    id: user.id
  });

  return {
    token
  };
};


module.exports = {
  registerUser,
  loginUser,
  generateTwoFactor,
  verifyTwoFactor,
  verifyLoginOtp
};