import express from "express";
import cors from "cors";

import eventRoutes from "./routes/eventRoutes";
import userRoutes from "./routes/userRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import { authenticate } from "./middleware/authMiddleware";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.send("Ticket Booking API is running 🚀");
});

app.get("/profile", authenticate, (req, res) => {
  res.json({
    message: "Protected Route",
    user: (req as any).user,
  });
});

app.use("/events", eventRoutes);
app.use("/users", userRoutes);
app.use("/bookings", bookingRoutes);

export default app;