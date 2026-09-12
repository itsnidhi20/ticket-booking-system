import { Request, Response } from "express";
import {
  createBookingService,
  getMyBookingsService,
  cancelBookingService,
} from "../services/bookingService";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const { eventId, seatNumbers } = req.body;

    // Validate eventId
    if (
      typeof eventId !== "number" ||
      !Number.isInteger(eventId) ||
      eventId <= 0
    ) {
      return res.status(400).json({
        message: "Valid eventId is required",
      });
    }

    // Validate seatNumbers
    if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({
        message: "At least one seat is required",
      });
    }

    // Limit maximum seats per booking
    if (seatNumbers.length > 10) {
      return res.status(400).json({
        message: "Maximum 10 seats can be booked at once",
      });
    }

    // Validate each seat number
    if (
      !seatNumbers.every(
        (seat: unknown) =>
          typeof seat === "string" &&
          seat.trim().length > 0 &&
          seat.trim().length <= 10
      )
    ) {
      return res.status(400).json({
        message: "Invalid seat number",
      });
    }

    const result = await createBookingService(
      userId,
      eventId,
      seatNumbers
    );

    res.status(201).json(result);
  } catch (error: any) {
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

    // Validate booking ID
    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

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

