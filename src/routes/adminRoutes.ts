import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/adminMiddleware";
import {
  getDashboard,
  getAllEvents,
  deleteEvent,
  updateEvent,
  addEvent,
  getVenues,
  addVenue,
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

router.get(
  "/venues",
  authenticate,
  isAdmin,
  getVenues
);

router.post(
  "/venues",
  authenticate,
  isAdmin,
  addVenue
);
export default router;