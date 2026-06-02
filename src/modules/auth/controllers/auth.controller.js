const authService =
  require("../services/auth.service");


// REGISTER

const register = async (req, res) => {

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

const login = async (req, res) => {

  try {

    const result =
      await authService.loginUser(
        req.body
      );

    res.json(result);

  } catch (error) {

    res.status(400).json({
      message: error.message
    });
  }
};


// GENERATE 2FA

const generate2FA = async (req, res) => {

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

const verify2FA = async (req, res) => {

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

const verifyLoginOtp = async (
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


module.exports = {
  register,
  login,
  generate2FA,
  verify2FA,
  verifyLoginOtp
};