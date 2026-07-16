import { Request, Response } from "express";
import {
  createUser,
  login,
  getProfileService,
  verifyOTPService,
  forgotPasswordService,
  resetPasswordService,
} from "../services/userService";

// ===============================
// Register
// ===============================
export const registerUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    await createUser(
      name,
      email,
      password
    );

    res.status(201).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

// ===============================
// Verify OTP
// ===============================
export const verifyOTP = async (
  req: Request,
  res: Response
) => {
  try {

    const { email, otp } = req.body;

    const result = await verifyOTPService(
      email,
      otp
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;

    const result = await forgotPasswordService(email);

    res.status(200).json({
      success: true,
      message: result.message,
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

// ===============================
// Login
// ===============================
export const loginUser = async (
  req: Request,
  res: Response
) => {
  try {

    const { email, password } = req.body;

    const data = await login(
      email,
      password
    );

    res.status(200).json({
      success: true,
      ...data,
    });

  } catch (error: any) {

    res.status(401).json({
      success: false,
      message: error.message,
    });

  }
};

// ===============================
// Profile
// ===============================
export const getProfile = async (
  req: Request,
  res: Response
) => {
  try {

    const userId = (req as any).user.id;

    const profile =
      await getProfileService(userId);

    res.status(200).json({
      success: true,
      profile,
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

export const resetPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      email,
      otp,
      newPassword,
    } = req.body;

    const result =
      await resetPasswordService(
        email,
        otp,
        newPassword
      );

    res.status(200).json({
      success: true,
      message: result.message,
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};