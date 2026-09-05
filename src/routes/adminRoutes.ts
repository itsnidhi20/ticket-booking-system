import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/adminMiddleware";
import {
  getDashboard,
  getAllEvents,
  deleteEvent,
  updateEvent,
  addEvent,
} from "../controllers/adminController";

const router = Router();

router.get(
  "/dashboard",
  authenticate,
  isAdmin,
  getDashboard
);

router.get(
  "/events",
  authenticate,
  isAdmin,
  getAllEvents
);

router.delete(
  "/events/:id",
  authenticate,
  isAdmin,
  deleteEvent
);

router.put(
  "/events/:id",
  authenticate,
  isAdmin,
  updateEvent
);

router.post(
  "/events",
  authenticate,
  isAdmin,
  addEvent
);
export default router;