import { Request, Response } from "express";
import { pool } from "../config/db";

export const getEvents = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM events ORDER BY event_date`);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getEventSeats = async (req: Request, res: Response) => {
  try {
    const eventId = Number(req.params.id);

    const result = await pool.query(
      `SELECT s.id, s.seat_number FROM seats s WHERE s.venue_id = (SELECT venue_id FROM events WHERE id = $1) ORDER BY s.seat_number`,
      [eventId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default {
  getEvents,
  getEventSeats,
};
