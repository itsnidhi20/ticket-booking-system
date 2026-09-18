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
      e.image_url,
      e.premium_price,
      e.executive_price,
      e.normal_price,
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
  image_url: string,
  event_date: string,
  start_time: string,
  end_time: string,
  price: number,
  premium_price: number,
  executive_price: number,
  normal_price: number
) => {
  if (
    premium_price <= 0 ||
    executive_price <= 0 ||
    normal_price <= 0
  ) {
    throw new Error("All seat prices must be greater than 0");
  }

  await pool.query(
    `
    UPDATE events
    SET
      title = $1,
      image_url = $2,
      event_date = $3,
      start_time = $4,
      end_time = $5,
      price = $6,
      premium_price = $7,
      executive_price = $8,
      normal_price = $9
    WHERE id = $10
    `,
    [
      title,
      image_url,
      event_date,
      start_time,
      end_time,
      price,
      premium_price,
      executive_price,
      normal_price,
      id,
    ]
  );

  await pool.query(
    `
    UPDATE seats
    SET price = CASE
      WHEN section = 'Premium' THEN $1
      WHEN section = 'Executive' THEN $2
      WHEN section = 'Normal' THEN $3
      ELSE price
    END
    WHERE event_id = $4
    `,
    [
      premium_price,
      executive_price,
      normal_price,
      id,
    ]
  );
};
export const addEventService = async (
  title: string,
  image_url: string,
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


   const totalSeats =
    premium_rows * premium_seats +
    executive_rows * executive_seats +
    normal_rows * normal_seats;

  if (
  premium_price <= 0 ||
  executive_price <= 0 ||
  normal_price <= 0
) {
  throw new Error("All seat prices must be greater than 0");
}

if (
  premium_rows <= 0 ||
  premium_seats <= 0 ||
  executive_rows <= 0 ||
  executive_seats <= 0 ||
  normal_rows <= 0 ||
  normal_seats <= 0
) {
  throw new Error("All seating values must be greater than 0");
}
if (venue_id <= 0) {
  throw new Error("Please select a valid venue");
}
  const venueResult = await pool.query(
    `SELECT capacity FROM venues WHERE id = $1`,
    [venue_id]
  );

 const venueCapacity = venueResult.rows[0]?.capacity;
 const conflictResult = await pool.query(
  `
  SELECT id
  FROM events
  WHERE venue_id = $1
    AND event_date = $2
    AND start_time < $4
    AND end_time > $3
  LIMIT 1;
  `,
  [venue_id, event_date, start_time, end_time]
);

if (conflictResult.rows.length > 0) {
  throw new Error(
    "This venue is already booked for another event at this time"
  );
}

if (!venueCapacity) {
  throw new Error("Venue not found");
}

if (totalSeats <= 0) {
  throw new Error("Event must have at least 1 seat");
}

if (totalSeats > venueCapacity) {
  throw new Error(
    `Total seats (${totalSeats}) exceed venue capacity (${venueCapacity})`
  );
}

  const event = await pool.query(
    `
    INSERT INTO events
    (
      title,
      image_url,
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
    ($1,$2,$3,$4,$5,$6,$7,
   $8,$9,$10,
   $11,$12,$13,
   $14,$15,$16)
    RETURNING id;
    `,
    [
      title,
       image_url,
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

export const getVenuesService = async () => {
  const result = await pool.query(`
    SELECT
      id,
      name,
      city,
      address,
      capacity
    FROM venues
    ORDER BY name;
  `);

  return result.rows;
};

export const addVenueService = async (
  name: string,
  city: string,
  address: string,
  capacity: number
) => {
  if (
  !name.trim() ||
  !city.trim() ||
  !address.trim()
) {
  throw new Error("Venue name, city and address are required");
}

if (capacity <= 0) {
  throw new Error("Venue capacity must be greater than 0");
}
  const result = await pool.query(
    `
    INSERT INTO venues
    (
      name,
      city,
      address,
      capacity
    )
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, city, address, capacity;
    `,
    [name, city, address, capacity]
  );

  return result.rows[0];
};