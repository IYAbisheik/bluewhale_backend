import { signupService, loginService } from '../services/user.services.js';

// SIGNUP CONTROLLER
export const signup = async (req, res) => {
  try {
    const result = await signupService(req.body);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    console.error('Signup Error:', error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// LOGIN CONTROLLER
export const login = async (req, res) => {
  try {
    const result = await loginService(req.body);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    console.error('Login Error:', error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};