-- ===========================
-- USERS
-- ===========================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    otp VARCHAR(6),
    otp_expiry TIMESTAMP,
    reset_otp VARCHAR(6),
    reset_otp_expiry TIMESTAMP,

    is_verified BOOLEAN DEFAULT FALSE,
    role VARCHAR(20) DEFAULT 'user'
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

    premium_price DECIMAL(10,2),
    premium_rows INT,
    premium_seats INT,

    executive_price DECIMAL(10,2),
    executive_rows INT,
    executive_seats INT,

    normal_price DECIMAL(10,2),
    normal_rows INT,
    normal_seats INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (venue_id)
        REFERENCES venues(id)
        ON DELETE CASCADE
);


-- ===========================
-- SEATS
-- ===========================

CREATE TABLE seats (
    id SERIAL PRIMARY KEY,

    venue_id INT NOT NULL,
    event_id INT NOT NULL,

    seat_number VARCHAR(10) NOT NULL,
    row_name VARCHAR(10),
    section VARCHAR(50),
    price DECIMAL(10,2),

    FOREIGN KEY (venue_id)
        REFERENCES venues(id)
        ON DELETE CASCADE,

    FOREIGN KEY (event_id)
        REFERENCES events(id)
        ON DELETE CASCADE,

    UNIQUE (event_id, seat_number)
);


-- ===========================
-- BOOKINGS
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