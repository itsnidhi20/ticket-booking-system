import { Request, Response } from "express";
import {
  listEvents,
  getSeatsForEvent,
} from "../services/eventService";

// ===============================
// Get All Events
// ===============================
export const getEvents = async (
  _req: Request,
  res: Response
) => {
  try {
    const events = await listEvents();

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// ===============================
// Get Seats For Event
// ===============================
export const getEventSeats = async (
  req: Request,
  res: Response
) => {
  try {
    const eventId = Number(req.params.id);

    const seats = await getSeatsForEvent(eventId);

    res.status(200).json({
      success: true,
      seats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getSeatsByEventService = async (
  eventId: number
) => {
  const result = await pool.query(
    `
    SELECT
      s.id,
      s.seat_number,
      s.row_name,
      s.section,

      CASE
        WHEN b.id IS NULL THEN false
        ELSE true
      END AS booked

    FROM seats s

    LEFT JOIN bookings b
      ON b.seat_id = s.id
      AND b.event_id = $1

    ORDER BY
      s.row_name,
      s.seat_number
    `,
    [eventId]
  );

  return result.rows;
};