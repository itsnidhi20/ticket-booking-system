import express from "express";
import cors from "cors";

import eventRoutes from "./routes/eventRoutes";
import userRoutes from "./routes/userRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import { authenticate } from "./middleware/authMiddleware";
import ticketRoutes from "./routes/ticketRoutes";
import { isAdmin } from "./middleware/adminMiddleware";
import adminRoutes from "./routes/adminRoutes";
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
app.use("/tickets", ticketRoutes);
app.use("/admin", adminRoutes);
app.get(
  "/admin-test",
  authenticate,
  isAdmin,
  (req, res) => {
    res.json({
      message: "Welcome Admin 🎉",
    });
  }
);

export default app;