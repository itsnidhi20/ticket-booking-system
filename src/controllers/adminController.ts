import { Request, Response } from "express";
import {
  getDashboardService,
  getAllEventsService,
  deleteEventService,
  updateEventService,
  addEventService,
  getVenuesService,
  addVenueService,
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
  image_url,
  event_date,
  start_time,
  end_time,
  price,
  premium_price,
  executive_price,
  normal_price,
} = req.body;

    await updateEventService(
  id,
  title,
  image_url,
  event_date,
  start_time,
  end_time,
  Number(price),
  Number(premium_price),
  Number(executive_price),
  Number(normal_price)
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
  image_url,
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
  image_url,
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

export const getVenues = async (
  _req: Request,
  res: Response
) => {
  try {
    const venues = await getVenuesService();
    res.json(venues);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const addVenue = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, city, address, capacity } = req.body;

    const venue = await addVenueService(
      name,
      city,
      address,
      Number(capacity)
    );

    res.status(201).json(venue);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};