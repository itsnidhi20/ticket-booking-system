import { Router } from "express";
import {
  registerUser,
  loginUser,
  verifyOTP,
  getProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/userController";

import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/verify-otp", verifyOTP);

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password",
  resetPassword
);

router.get(
  "/profile",
  authenticate,
  getProfile
);

export default router;