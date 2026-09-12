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

    const eventDate = new Date(ticket.event_date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

    const qr = await QRCode.toDataURL(
      `TicketHub
Booking ID: ${bookingId}
Name: ${ticket.name}
Event: ${ticket.title}
Venue: ${ticket.venue}
Seat: ${ticket.seat_number}
Date: ${eventDate}
Time: ${ticket.start_time} - ${ticket.end_time}
Amount: Rs. ${ticket.total_amount}`
    );

    const qrBuffer = Buffer.from(
      qr.replace(/^data:image\/png;base64,/, ""),
      "base64"
    );

    const doc = new PDFDocument({
      size: "A5",
      margin: 0,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=ticket-${bookingId}.pdf`
    );

    doc.pipe(res);

    // =========================
    // COLORS
    // =========================

    const paper = "#F3E7CF";
    const dark = "#2C211C";
    const burgundy = "#722F32";
    const muted = "#765F52";
    const faded = "#B99F82";

    // =========================
    // BACKGROUND
    // =========================

    doc
      .rect(0, 0, 420, 595)
      .fill(paper);

    // Outer border
    doc
      .lineWidth(2)
      .strokeColor(dark)
      .roundedRect(18, 18, 384, 559, 12)
      .stroke();

    // Inner border
    doc
      .lineWidth(0.7)
      .strokeColor(faded)
      .roundedRect(25, 25, 370, 545, 8)
      .stroke();

    // =========================
    // HEADER
    // =========================

    doc
      .fillColor(burgundy)
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("TICKETHUB", 42, 43);

    doc
      .fillColor(muted)
      .font("Helvetica")
      .fontSize(8)
      .text("ADMISSION TICKET", 42, 59);

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(`#${bookingId}`, 340, 48, {
        width: 38,
        align: "right",
      });

    // Small header divider
    doc
      .moveTo(42, 82)
      .lineTo(378, 82)
      .lineWidth(1)
      .strokeColor(faded)
      .stroke();

    // =========================
    // EVENT
    // =========================

    doc
      .fillColor(muted)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text("EVENT", 42, 105);

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(25)
      .text(ticket.title.toUpperCase(), 42, 120, {
        width: 330,
        lineGap: 2,
      });

    // =========================
    // EVENT DETAILS
    // =========================

    const detailsY = 190;

    // Date
    doc
      .fillColor(muted)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text("DATE", 42, detailsY);

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(eventDate, 42, detailsY + 13);

    // Time
    doc
      .fillColor(muted)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text("TIME", 185, detailsY);

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(
        `${ticket.start_time} - ${ticket.end_time}`,
        185,
        detailsY + 13
      );

    // Seat
    doc
      .fillColor(burgundy)
      .roundedRect(310, detailsY - 8, 68, 48, 6)
      .fill();

    doc
      .fillColor(paper)
      .font("Helvetica-Bold")
      .fontSize(7)
      .text("SEAT", 310, detailsY + 1, {
        width: 68,
        align: "center",
      });

    doc
      .fillColor(paper)
      .font("Helvetica-Bold")
      .fontSize(20)
      .text(ticket.seat_number, 310, detailsY + 13, {
        width: 68,
        align: "center",
      });

    // =========================
    // VENUE
    // =========================

    doc
      .fillColor(muted)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text("VENUE", 42, 260);

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(13)
      .text(ticket.venue, 42, 274, {
        width: 330,
      });

    // =========================
    // ATTENDEE
    // =========================

    doc
      .fillColor(muted)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text("ATTENDEE", 42, 315);

    doc
      .fillColor(dark)
      .font("Helvetica")
      .fontSize(12)
      .text(ticket.name, 42, 329);

    // =========================
    // PERFORATION
    // =========================

    doc
      .moveTo(42, 365)
      .lineTo(378, 365)
      .dash(3, { space: 5 })
      .lineWidth(1)
      .strokeColor(faded)
      .stroke();

    // Reset dash
    doc.undash();

    // =========================
    // QR SECTION
    // =========================

    doc
      .fillColor(muted)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text("ENTRY VERIFICATION", 42, 387);

    doc
      .fillColor(dark)
      .font("Helvetica")
      .fontSize(9)
      .text("Present this ticket at the venue entrance.", 42, 402);

    // QR background
    doc
      .fillColor("#FFFFFF")
      .roundedRect(255, 385, 110, 110, 6)
      .fill();

    doc.image(qrBuffer, 265, 395, {
      width: 90,
      height: 90,
    });

    // =========================
    // AMOUNT
    // =========================

    doc
      .fillColor(muted)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text("TOTAL PAID", 42, 450);

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(18)
     .text(`Rs. ${Number(ticket.total_amount).toFixed(2)}`, 42, 464);

    // =========================
    // FOOTER
    // =========================

    doc
      .fillColor(burgundy)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text(
        "KEEP THIS TICKET SAFE UNTIL ENTRY",
        42,
        535,
        {
          width: 336,
          align: "center",
        }
      );

    doc
      .fillColor(muted)
      .font("Helvetica")
      .fontSize(7)
      .text(
        "TicketHub • Valid for the event and seat mentioned above",
        42,
        550,
        {
          width: 336,
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