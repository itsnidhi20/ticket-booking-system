# 🎟️ Event Ticket Booking System

A full-stack event ticket booking platform built with **React, TypeScript, Node.js, Express, and PostgreSQL**, with secure authentication, dynamic event-specific seating, concurrency-safe booking, Razorpay payments, and digital ticket generation.

The project focuses on backend correctness and real-world booking problems such as **race conditions, seat locking, payment verification, authorization, and transactional database operations**.

---

## 🚀 Features

### Authentication & Authorization

* User registration and login
* Password hashing with **bcrypt**
* JWT-based authentication
* Email OTP verification
* Forgot/reset password flow
* Role-based access control
* Protected admin routes

### 🎭 Event Management

* Browse upcoming events
* Event-specific seat layouts
* Multiple seating sections
* Configurable seat pricing
* Admin event management
* Events automatically hidden after their end time

### 💺 Booking System

* Select multiple seats
* Server-side seat and price validation
* PostgreSQL transactions
* Row-level seat locking using `FOR UPDATE`
* Deterministic seat-lock ordering to reduce deadlock risk
* Database-level unique constraint preventing duplicate bookings
* Temporary booking holds with expiry
* Automatic cleanup of expired pending bookings

### 💳 Payments

* Razorpay Test Mode integration
* Server-side Razorpay order creation
* Payment signature verification using **HMAC-SHA256**
* Payment status tracking
* Refund support for eligible cancellations

### 🎫 Digital Tickets

* Booking-specific admission tickets
* QR code generation
* Downloadable PDF tickets
* Ticket access restricted to paid bookings

### 🛡️ Security

* Password hashing
* JWT authentication
* Role-based authorization
* Server-side price validation
* Payment signature verification
* User-specific booking authorization
* Environment-based secrets
* Protected ticket access

---

## 🧠 Engineering Highlights

### 1. Concurrency-Safe Seat Booking

The booking flow uses a PostgreSQL transaction and row-level locking:

```sql
SELECT id, price
FROM seats
WHERE event_id = $1
AND seat_number = $2
FOR UPDATE;
```

Seats are locked before checking availability and creating bookings.

A unique database constraint provides an additional layer of protection:

```sql
UNIQUE (event_id, seat_id)
```

This prevents two users from successfully booking the same seat even under concurrent requests.

---

### 2. Deterministic Lock Ordering

When multiple seats are requested, seat numbers are sorted before acquiring database locks.

For example:

```text
User A → A1, A2
User B → A2, A1
```

Both transactions acquire locks in the same order:

```text
A1 → A2
```

This reduces the possibility of deadlocks caused by inconsistent lock ordering.

---

### 3. Transactional Booking Flow

Booking creation is handled inside a PostgreSQL transaction:

```text
BEGIN
   ↓
Validate event
   ↓
Lock requested seats
   ↓
Validate seat prices
   ↓
Remove expired holds
   ↓
Check availability
   ↓
Create PENDING bookings
   ↓
Create Razorpay order
   ↓
Store Razorpay order ID
   ↓
COMMIT
```

If any step fails, the transaction is rolled back.

---

### 4. Temporary Seat Holds

Unpaid bookings are created with:

```text
status = PENDING
expires_at = NOW() + 10 minutes
```

Expired pending bookings are automatically removed when seat availability is requested, allowing those seats to become available again.

---

### 5. Payment Verification

The frontend does not decide whether a payment is valid.

After Razorpay payment completion, the backend verifies the payment signature using:

```text
HMAC-SHA256
```

The server then updates the corresponding booking only after successful verification.

---

## 🏗️ Architecture

The backend follows a layered structure:

```text
Client
  │
  ▼
React Frontend
  │
  │ HTTP / REST API
  ▼
Express Routes
  │
  ▼
Controllers
  │
  ▼
Services
  │
  ├── Authentication
  ├── Event Management
  ├── Booking
  ├── Payment
  └── Admin
  │
  ▼
PostgreSQL
```

Supporting components:

```text
React + Vite
      │
      ▼
Node.js + Express + TypeScript
      │
      ├── JWT / bcrypt
      ├── Razorpay
      ├── QR / PDF generation
      │
      ▼
PostgreSQL
```

---

## 🗂️ Project Structure

```text
ticket-booking-system/
│
├── backend/
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── frontend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── __tests__/
│   ├── app.ts
│   └── server.ts
│
├── .env
├── jest.config.js
├── package.json
└── README.md
```

---

## 🛠️ Tech Stack

| Layer           | Technology                   |
| --------------- | ---------------------------- |
| Frontend        | React, TypeScript, Vite      |
| Backend         | Node.js, Express, TypeScript |
| Database        | PostgreSQL                   |
| Authentication  | JWT, bcrypt                  |
| Payments        | Razorpay                     |
| Testing         | Jest, Supertest              |
| PDF Tickets     | PDF generation               |
| QR Tickets      | QR Code generation           |
| Version Control | Git, GitHub                  |

---

## 🧪 Testing

Automated API tests are implemented using **Jest + Supertest**.

Current test coverage includes:

* Authentication
* JWT authorization
* Event APIs
* Booking validation
* Duplicate seat prevention
* Payment verification
* Admin authorization
* Booking cancellation

Current test result:

```text
Test Suites: 6 passed, 6 total
Tests:       23 passed, 23 total
```

---

## 🔐 Database Design

Core entities:

```text
Users
  │
  ├── Bookings
  │       │
  │       └── Seats
  │
Events
  │
  ├── Seats
  │
  └── Venues
```

Important constraints include:

```sql
UNIQUE (event_id, seat_number)
```

and:

```sql
UNIQUE (event_id, seat_id)
```

These constraints enforce booking integrity at the database level rather than relying only on application logic.

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/itsnidhi20/ticket-booking-system.git

cd ticket-booking-system
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Configure PostgreSQL

Create a PostgreSQL database and run:

```text
database/schema.sql
```

Then populate initial data using:

```text
database/seed.sql
```

### 4. Configure environment variables

Create a `.env` file:

```env
DB_USER=your_postgres_user
DB_HOST=localhost
DB_NAME=ticket_booking_db
DB_PASSWORD=your_postgres_password
DB_PORT=5432

JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

FRONTEND_URL=http://localhost:5173
```

### 5. Start the backend

```bash
npm run dev
```

The API runs on:

```text
http://localhost:5000
```

### 6. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

## 🔑 API Overview

### Authentication

```text
POST /users/register
POST /users/login
POST /users/verify-otp
POST /users/forgot-password
POST /users/reset-password
```

### Events

```text
GET /events
GET /events/:id/seats
```

### Bookings

```text
POST /bookings
GET /bookings/my
DELETE /bookings/:id
```

### Payments

```text
POST /payments/verify
```

### Tickets

```text
GET /tickets/:bookingId
```

### Admin

```text
GET /admin/dashboard
```

---

## 📌 Key Design Decisions

### PostgreSQL over an ORM

Raw SQL was intentionally used to gain direct control over:

* Transactions
* Row-level locking
* Constraints
* Queries
* Database behavior

### Server-Side Seat Pricing

The frontend does not determine the final booking price.

Seat prices are retrieved and validated from PostgreSQL on the backend to prevent client-side price manipulation.

### Database-Level Integrity

Application-level checks are backed by PostgreSQL constraints wherever possible.

This provides protection even when multiple requests arrive concurrently.

---

## 🚧 Future Improvements

Possible production-scale improvements include:

* Payment webhooks and reconciliation
* Background workers for expired booking cleanup
* Redis-based distributed seat holds
* Rate limiting
* Structured logging
* Monitoring and observability
* Automated CI/CD deployment

These are intentionally outside the current MVP scope.

---

## 👩‍💻 Author

**Nidhii Warankar**

Computer Engineering Student

GitHub: [itsnidhi20](https://github.com/itsnidhi20)
