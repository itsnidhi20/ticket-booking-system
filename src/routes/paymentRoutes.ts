import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import {
  verifyPayment,
} from "../controllers/paymentController";

const router = Router();

router.post("/verify", authenticate, verifyPayment);

export default router;