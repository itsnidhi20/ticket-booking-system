import { pool } from "../config/db";

export const getDashboardService = async () => {

  const events = await pool.query(
    "SELECT COUNT(*) FROM events"
  );

  const users = await pool.query(
    "SELECT COUNT(*) FROM users"
  );

  const bookings = await pool.query(
    "SELECT COUNT(*) FROM bookings"
  );

  const revenue = await pool.query(
    `
    SELECT COALESCE(SUM(total_amount),0) AS revenue
    FROM bookings
    `
  );

  return {
    totalEvents: Number(events.rows[0].count),
    totalUsers: Number(users.rows[0].count),
    totalBookings: Number(bookings.rows[0].count),
    totalRevenue: Number(revenue.rows[0].revenue),
  };
};
export const getAllEventsService = async () => {
  const result = await pool.query(`
    SELECT
      e.id,
      e.title,
      e.event_date,
      e.start_time,
      e.end_time,
      e.price,
      v.name AS venue
    FROM events e
    JOIN venues v
      ON e.venue_id = v.id
    ORDER BY e.event_date;
  `);

  return result.rows;
};
export const deleteEventService = async (
  id: number
) => {
  await pool.query(
    "DELETE FROM events WHERE id = $1",
    [id]
  );
};
export const updateEventService = async (
  id: number,
  title: string,
  event_date: string,
  start_time: string,
  end_time: string,
  price: number
) => {
  await pool.query(
    `
    UPDATE events
    SET
      title = $1,
      event_date = $2,
      start_time = $3,
      end_time = $4,
      price = $5
    WHERE id = $6
    `,
    [
      title,
      event_date,
      start_time,
      end_time,
      price,
      id,
    ]
  );
};
export const addEventService = async (
  title: string,
  event_date: string,
  start_time: string,
  end_time: string,
  venue_id: number,

  premium_price: number,
  premium_rows: number,
  premium_seats: number,

  executive_price: number,
  executive_rows: number,
  executive_seats: number,

  normal_price: number,
  normal_rows: number,
  normal_seats: number
) => {

  const event = await pool.query(
    `
    INSERT INTO events
    (
      title,
      event_date,
      start_time,
      end_time,
      price,
      venue_id,

      premium_price,
      premium_rows,
      premium_seats,

      executive_price,
      executive_rows,
      executive_seats,

      normal_price,
      normal_rows,
      normal_seats
    )
    VALUES
    (
      $1,$2,$3,$4,$5,$6,
      $7,$8,$9,
      $10,$11,$12,
      $13,$14,$15
    )
    RETURNING id;
    `,
    [
      title,
      event_date,
      start_time,
      end_time,
      premium_price, // keeping events.price as premium price
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
    ]
  );

  const eventId = event.rows[0].id;

  const categories = [
    {
      section: "Premium",
      price: premium_price,
      rows: premium_rows,
      seats: premium_seats,
    },
    {
      section: "Executive",
      price: executive_price,
      rows: executive_rows,
      seats: executive_seats,
    },
    {
      section: "Normal",
      price: normal_price,
      rows: normal_rows,
      seats: normal_seats,
    },
  ];

  let currentRow = 65; // ASCII 'A'

  for (const category of categories) {

    for (let r = 0; r < category.rows; r++) {

      const rowName = String.fromCharCode(currentRow++);

      for (let s = 1; s <= category.seats; s++) {

        await pool.query(
          `
          INSERT INTO seats
          (
            venue_id,
            event_id,
            seat_number,
            row_name,
            section,
            price
          )
          VALUES
          ($1,$2,$3,$4,$5,$6)
          `,
          [
            venue_id,
            eventId,
            `${rowName}${s}`,
            rowName,
            category.section,
            category.price,
          ]
        );

      }

    }

  }

};