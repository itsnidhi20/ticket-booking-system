import { Router } from "express";
import {
  getEvents,
  getEventSeats,
} from "../controllers/eventController";

const router = Router();

// Get all events
router.get("/", getEvents);

// Get seats for an event
router.get("/:id/seats", getEventSeats);

export default router;