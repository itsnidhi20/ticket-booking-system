import express from "express";
import eventRoutes from "./routes/eventRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.send("Ticket Booking API is running 🚀");
});

app.use("/events", eventRoutes);
app.use("/users", userRoutes);

export default app;