import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import {
  createPaymentOrder,
  verifyPayment,
} from "../controllers/paymentController";

const router = Router();

router.post("/create-order", authenticate, createPaymentOrder);

router.post("/verify", authenticate, verifyPayment);

export default router;