import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db";
import { sendOTPEmail } from "../utils/sendEmail";


export const createUser = async (
  name: string,
  email: string,
  password: string
) => {

  // Validation
  if (!name.trim()) {
    throw new Error("Name is required");
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new Error("Invalid email address");
  }

  if (password.length < 6) {
    throw new Error(
      "Password must be at least 6 characters"
    );
  }

  // Check duplicate email
  const existingUser = await pool.query(
    `
    SELECT id
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("Email already registered");
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const otp = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const expiry = new Date(
    Date.now() + 10 * 60 * 1000
  );

  await pool.query(
    `
    INSERT INTO users
    (
      name,
      email,
      password_hash,
      otp,
      otp_expiry
    )
    VALUES ($1,$2,$3,$4,$5)
    `,
    [
      name,
      email,
      hashedPassword,
      otp,
      expiry,
    ]
  );

  await sendOTPEmail(email, otp);
};

export const login = async (
  email: string,
  password: string
) => {
  const result = await pool.query(
    `
    SELECT *
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  if (!user.is_verified) {
    throw new Error("Please verify your email first");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

export const getProfileService = async (
  userId: number
) => {
  const result = await pool.query(
    `
    SELECT
      id,
      name,
      email,
      created_at
    FROM users
    WHERE id = $1
    `,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
};

export const verifyOTPService = async (
  email: string,
  otp: string
) => {
  const result = await pool.query(
    `
    SELECT *
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];

  console.log("========== OTP DEBUG ==========");
  console.log("Email:", email);
  console.log("Entered OTP:", otp);
  console.log("DB OTP:", user.otp);
  console.log("Verified:", user.is_verified);
  console.log("Expiry:", user.otp_expiry);
  console.log("===============================");

  if (user.is_verified) {
    throw new Error("Email already verified");
  }

  if (String(user.otp).trim() !== String(otp).trim()) {
    throw new Error("Invalid OTP");
  }

  if (new Date() > new Date(user.otp_expiry)) {
    throw new Error("OTP has expired");
  }

  await pool.query(
    `
    UPDATE users
    SET
      is_verified = true,
      otp = NULL,
      otp_expiry = NULL
    WHERE id = $1
    `,
    [user.id]
  );

  return {
    message: "Email verified successfully",
  };
};

export const forgotPasswordService = async (
  email: string
) => {
  const result = await pool.query(
    `
    SELECT *
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];

  const otp = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const expiry = new Date(
    Date.now() + 10 * 60 * 1000
  );

  await pool.query(
    `
    UPDATE users
    SET
      reset_otp = $1,
      reset_otp_expiry = $2
    WHERE id = $3
    `,
    [
      otp,
      expiry,
      user.id,
    ]
  );

  await sendOTPEmail(email, otp);

  return {
    message: "Password reset OTP sent successfully",
  };
};

export const resetPasswordService = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const result = await pool.query(
    `
    SELECT *
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];

  if (
    String(user.reset_otp).trim() !==
    String(otp).trim()
  ) {
    throw new Error("Invalid OTP");
  }

  if (
    new Date() >
    new Date(user.reset_otp_expiry)
  ) {
    throw new Error("OTP has expired");
  }

  const hashedPassword =
    await bcrypt.hash(newPassword, 10);

  await pool.query(
    `
    UPDATE users
    SET
      password_hash = $1,
      reset_otp = NULL,
      reset_otp_expiry = NULL
    WHERE id = $2
    `,
    [
      hashedPassword,
      user.id,
    ]
  );

  return {
    message: "Password reset successful",
  };
};