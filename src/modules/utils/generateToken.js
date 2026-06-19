import jwt from 'jsonwebtoken';

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  })
}

export const requestLogger = (
  req,
  res,
  next
) => {
  console.log(
    `${new Date().toISOString()} | ${
      req.method
    } | ${req.originalUrl}`
  );

  next();
};

export default generateToken;