import { Request, Response } from "express";
import {
  getDashboardService,
  getAllEventsService,
  deleteEventService,
  updateEventService,
  addEventService,
} from "../services/adminService";

export const getDashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await getDashboardService();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllEvents = async (
  req: Request,
  res: Response
) => {
  try {
    const events = await getAllEventsService();
    res.json(events);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await deleteEventService(id);

    res.json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateEvent = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const {
      title,
      event_date,
      start_time,
      end_time,
      price,
    } = req.body;

    await updateEventService(
      id,
      title,
      event_date,
      start_time,
      end_time,
      Number(price)
    );

    res.json({
      message: "Event updated successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const addEvent = async (
  req: Request,
  res: Response
) => {
  try {
    const {
  title,
  event_date,
  start_time,
  end_time,
  venue_id,

  premium_price,
  premium_rows,
  premium_seats,

  executive_price,
  executive_rows,
  executive_seats,

  normal_price,
  normal_rows,
  normal_seats,
} = req.body;

await addEventService(
  title,
  event_date,
  start_time,
  end_time,
  Number(venue_id),

  Number(premium_price),
  Number(premium_rows),
  Number(premium_seats),

  Number(executive_price),
  Number(executive_rows),
  Number(executive_seats),

  Number(normal_price),
  Number(normal_rows),
  Number(normal_seats)
);

    res.status(201).json({
      message: "Event added successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};