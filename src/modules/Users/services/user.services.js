import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

import prisma from '../../../config/prisma.js';

import generateToken from '../../utils/generateToken.js';


// ==========================
// SIGNUP SERVICE
// ==========================

export const signupService = async (payload) => {

  const { name, email, password } = payload;

  if (!name || !email || !password) {
    throw new Error(
      'Name, email, and password are required'
    );
  }

  // CHECK EXISTING USER

  const existingUser =
    await prisma.user.findUnique({
      where: { email },
    });

  if (existingUser) {
    throw new Error(
      'User already exists with this email'
    );
  }

  // HASH PASSWORD

  const hashedPassword =
    await bcrypt.hash(password, 10);

  // CREATE USER

  // const user = await prisma.user.create({
  //   data: {
  //     name,
  //     email,
  //     password: hashedPassword,
  //   },
  // });

  const user = {
    name,
    email,
    password: hashedPassword,
  }

  // For Verification Email
  onHandleEmailTrigger({toAddress: email, data: {name: user.name}})

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  };
};


// ==========================
// LOGIN SERVICE
// ==========================

export const loginService = async (payload) => {

  const { email, password } = payload;

  if (!email || !password) {
    throw new Error(
      'Email and password are required'
    );
  }

  // FIND USER

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error(
      'Invalid email or password'
    );
  }

  // CHECK PASSWORD

  const isPasswordMatch =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isPasswordMatch) {
    throw new Error(
      'Invalid email or password'
    );
  }

  // CHECK 2FA ENABLED

  if (user.twoFactorEnabled) {

    return {
      twoFactorRequired: true,
      userId: user.id,
    };
  }

  // GENERATE JWT TOKEN

  const token = generateToken({
    id: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    accessToken: token,
  };
};


// ==========================
// GENERATE 2FA
// ==========================

export const generateTwoFactorService =
  async (userId) => {

    // GENERATE SECRET

    const secret =
      speakeasy.generateSecret({
        name: 'MyApp',
      });

    // SAVE SECRET IN DB

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        twoFactorSecret:
          secret.base32,
      },
    });

    // GENERATE QR CODE

    const qrCode =
      await QRCode.toDataURL(
        secret.otpauth_url
      );

    return {
      qrCode,
    };
  };


// ==========================
// VERIFY & ENABLE 2FA
// ==========================

export const verifyTwoFactorService =
  async (userId, token) => {

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (!user) {
      throw new Error('User not found');
    }

    // VERIFY OTP

    const verified =
      speakeasy.totp.verify({
        secret:
          user.twoFactorSecret,
        encoding: 'base32',
        token,
      });

    if (!verified) {
      throw new Error('Invalid OTP');
    }

    // ENABLE 2FA

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        twoFactorEnabled: true,
      },
    });

    return {
      message:
        '2FA enabled successfully',
    };
  };


// ==========================
// VERIFY LOGIN OTP
// ==========================

export const verifyLoginOtpService =
  async (userId, otp) => {

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (!user) {
      throw new Error('User not found');
    }

    // VERIFY LOGIN OTP

    const verified =
      speakeasy.totp.verify({
        secret:
          user.twoFactorSecret,
        encoding: 'base32',
        token: otp,
      });

    if (!verified) {
      throw new Error('Invalid OTP');
    }

    // GENERATE ACCESS TOKEN

    const accessToken =
      generateToken({
        id: user.id,
        email: user.email,
      });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    };
  };

export const getCurrentUserService =
    async (userId) => {

        const user =
            await prisma.user.findUnique({
                where: {
                    id: userId,
                }
            });

        if (!user) {
            throw new Error(
                "User not found"
            );
        }

        return user;
    };