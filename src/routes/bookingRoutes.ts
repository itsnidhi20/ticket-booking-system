import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
} from "../controllers/bookingController";

const router = Router();

router.post("/", authenticate, createBooking);

router.get("/my", authenticate, getMyBookings);

router.delete("/:id", authenticate, cancelBooking);

export default router;