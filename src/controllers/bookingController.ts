import { Request, Response } from "express";
import {
  createBookingService,
  getMyBookingsService,
  cancelBookingService,
} from "../services/bookingService";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const { eventId, seatNumber } = req.body;

    const booking = await createBookingService(
      userId,
      eventId,
      seatNumber
    );

    res.status(201).json(booking);
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(400).json({
        message: "Seat already booked",
      });
    }

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getMyBookings = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const bookings = await getMyBookingsService(userId);

    res.json(bookings);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const cancelBooking = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const bookingId = Number(req.params.id);

    const result = await cancelBookingService(
      userId,
      bookingId
    );

    res.json(result);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};