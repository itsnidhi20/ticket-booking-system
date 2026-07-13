import { Request, Response } from "express";
import {
  createUser,
  login,
  getProfileService,
  verifyOTPService,
} from "../services/userService";


export const registerUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    const user = await createUser(
      name,
      email,
      password
    );

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
    });
  }
};

export const loginUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const data = await login(email, password);

    res.status(200).json(data);
  } catch (error: any) {
    res.status(401).json({
      message: error.message,
    });
  }
};

export const getProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const profile = await getProfileService(userId);

    res.json(profile);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

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

    res.json(result);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};