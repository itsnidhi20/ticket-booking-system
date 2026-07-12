-- ===========================
-- USERS
-- ===========================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    password_hash VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- VENUES
-- ===========================

CREATE TABLE venues (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    city VARCHAR(100) NOT NULL,

    address TEXT NOT NULL,

    capacity INT NOT NULL
);

-- ===========================
-- EVENTS
-- ===========================

CREATE TABLE events (
    id SERIAL PRIMARY KEY,

    title VARCHAR(150) NOT NULL,

    description TEXT,

    venue_id INT NOT NULL,

    event_date DATE NOT NULL,

    start_time TIME NOT NULL,

    end_time TIME NOT NULL,

    price DECIMAL(10,2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (venue_id)
        REFERENCES venues(id)
        ON DELETE CASCADE
);

-- ===========================
-- SEATS
-- Physical seats inside a venue
-- ===========================

CREATE TABLE seats (
    id SERIAL PRIMARY KEY,

    venue_id INT NOT NULL,

    seat_number VARCHAR(10) NOT NULL,

    FOREIGN KEY (venue_id)
        REFERENCES venues(id)
        ON DELETE CASCADE,

    UNIQUE (venue_id, seat_number)
);

-- ===========================
-- BOOKINGS
-- One booking = One seat for one event
-- ===========================

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,

    user_id INT NOT NULL,

    event_id INT NOT NULL,

    seat_id INT NOT NULL,

    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    total_amount DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (event_id)
        REFERENCES events(id)
        ON DELETE CASCADE,

    FOREIGN KEY (seat_id)
        REFERENCES seats(id)
        ON DELETE CASCADE,

    UNIQUE (event_id, seat_id)
);