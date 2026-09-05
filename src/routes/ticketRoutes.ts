import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { downloadTicket } from "../controllers/ticketController";

const router = Router();

router.get(
  "/:id/download",
  authenticate,
  downloadTicket
);

export default router;