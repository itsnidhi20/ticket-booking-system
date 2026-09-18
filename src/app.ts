import express from "express";
import cors from "cors";

import eventRoutes from "./routes/eventRoutes";
import userRoutes from "./routes/userRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import adminRoutes from "./routes/adminRoutes";
import paymentRoutes from "./routes/paymentRoutes";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.send("Ticket Booking API is running 🚀");
});

app.use("/events", eventRoutes);
app.use("/users", userRoutes);
app.use("/bookings", bookingRoutes);
app.use("/tickets", ticketRoutes);
app.use("/admin", adminRoutes);
app.use("/payments", paymentRoutes);

export default app;