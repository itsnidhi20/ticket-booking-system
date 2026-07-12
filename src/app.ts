import express from "express";
import eventRoutes from "./routes/eventRoutes";
import userRoutes from "./routes/userRoutes";
import { authenticate } from "./middleware/authMiddleware";
import bookingRoutes from "./routes/bookingRoutes";


const app = express();

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