import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { pool } from "../config/db";

export const downloadTicket = async (
  req: Request,
  res: Response
) => {
  try {
    const bookingId = Number(req.params.id);
    const userId = (req as any).user.id;

    const result = await pool.query(
      `
      SELECT
        u.name,
        e.title,
        e.event_date,
        e.start_time,
        e.end_time,
        v.name AS venue,
        s.seat_number,
        b.total_amount,
        b.booking_time
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN events e ON b.event_id = e.id
      JOIN venues v ON e.venue_id = v.id
      JOIN seats s ON b.seat_id = s.id
      WHERE b.id = $1
      AND b.user_id = $2
      `,
      [bookingId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const ticket = result.rows[0];

    const qr = await QRCode.toDataURL(
      `TicketHub

Booking ID: ${bookingId}
Name: ${ticket.name}
Event: ${ticket.title}
Venue: ${ticket.venue}
Seat: ${ticket.seat_number}
Date: ${new Date(ticket.event_date).toDateString()}
Time: ${ticket.start_time} - ${ticket.end_time}
Amount: ₹${ticket.total_amount}`
    );

    const doc = new PDFDocument({
      margin: 50,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=ticket-${bookingId}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(24).text("🎟 TicketHub", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(16).text(`Booking ID : ${bookingId}`);
    doc.moveDown(0.5);

    doc.text(`Name : ${ticket.name}`);
    doc.text(`Event : ${ticket.title}`);
    doc.text(`Venue : ${ticket.venue}`);
    doc.text(
      `Date : ${new Date(ticket.event_date).toDateString()}`
    );
    doc.text(
      `Time : ${ticket.start_time} - ${ticket.end_time}`
    );
    doc.text(`Seat : ${ticket.seat_number}`);
    doc.text(`Amount : ₹${ticket.total_amount}`);

    doc.moveDown(2);

    const qrBuffer = Buffer.from(
      qr.replace(/^data:image\/png;base64,/, ""),
      "base64"
    );

    doc.image(qrBuffer, {
      fit: [170, 170],
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(12).text(
      "Scan this QR Code to view ticket information.",
      {
        align: "center",
      }
    );

    doc.end();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};